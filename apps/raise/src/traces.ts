import dotenv from 'dotenv';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-grpc';
import { Resource } from '@opentelemetry/resources';
import { NodeSDK } from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  BatchSpanProcessor,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
  SpanProcessor,
} from '@opentelemetry/sdk-trace-base';
import { NestInstrumentation } from '@opentelemetry/instrumentation-nestjs-core';
import { diag, DiagConsoleLogger, DiagLogLevel } from '@opentelemetry/api';
import { HttpInstrumentation } from '@opentelemetry/instrumentation-http';
import { FastifyInstrumentation } from '@opentelemetry/instrumentation-fastify';
import { AsyncLocalStorageContextManager } from '@opentelemetry/context-async-hooks';

// we start very early before NestJS, so this is needed
dotenv.config();

export async function initTraces() {
  const tracesEnabled =
    process.env.OTEL_TRACES_ENABLED === 'true' ||
    process.env.OTEL_TRACES_ENABLED === '1';
  const tracesConsoleEnabled =
    process.env.OTEL_TRACES_CONSOLE_ENABLED === 'true' ||
    process.env.OTEL_TRACES_CONSOLE_ENABLED === '1';
  // For troubleshooting, set the log level to DiagLogLevel.DEBUG
  const logLevel = process.env.OTEL_LOG_LEVEL
    ? DiagLogLevel[
        process.env.OTEL_LOG_LEVEL.toUpperCase() as keyof typeof DiagLogLevel
      ]
    : DiagLogLevel.INFO;
  diag.setLogger(new DiagConsoleLogger(), logLevel);
  if (tracesEnabled) {
    console.info(`OpenTelemetry Traces enabled`);
    let spanProcessor: SpanProcessor | undefined = undefined;
    // const provider = new NodeTracerProvider({
    //   resource: new Resource({
    //     [SemanticResourceAttributes.SERVICE_NAME]: 'tmra-raise',
    //     [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
    //       process.env.APP_ENV,
    //     [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION,
    //   }),
    // });

    // export spans to OpenTelemetry collector
    // let otlpExporter: OTLPTraceExporter | undefined = undefined;
    if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
      const otlpExporter = new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      });
      console.info(
        `OpenTelemetry Traces > OTLP Exporter > OTLP traces endpoint: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`,
      );
      spanProcessor = new BatchSpanProcessor(otlpExporter);
      // provider.addSpanProcessor(spanProcessor);
    } else if (tracesConsoleEnabled) {
      // export spans to console (useful for debugging)
      // let consoleExporter: ConsoleSpanExporter | undefined = undefined;
      const consoleExporter = new ConsoleSpanExporter();
      console.info('OpenTelemetry Traces > Console span processor enabled');
      spanProcessor = new SimpleSpanProcessor(consoleExporter);
      // provider.addSpanProcessor(spanProcessor);
    }

    // Initialize the provider
    // provider.register();
    // register and load instrumentation and old plugins - old plugins will be loaded automatically as previously
    // but instrumentations needs to be added
    // registerInstrumentations({
    //   instrumentations: [new NestInstrumentation()],
    //   tracerProvider: provider,
    // });
    if (spanProcessor) {
      const sdk = new NodeSDK({
        resource: new Resource({
          [SemanticResourceAttributes.SERVICE_NAME]: 'tmra-raise',
          [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
            process.env.APP_ENV,
          [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION,
        }),
        // traceExporter: otlpExporter ?? consoleExporter,
        spanProcessor,
        contextManager: new AsyncLocalStorageContextManager(),
        instrumentations: [
          getNodeAutoInstrumentations(),
          // Fastify instrumentation expects HTTP layer to be instrumented
          new HttpInstrumentation(),
          new FastifyInstrumentation(),
          new NestInstrumentation(),
        ],
      });

      try {
        await sdk.start();
        console.info('OpenTelemetry Traces initialized');
      } catch (error) {
        console.error('Error initializing OpenTelemetry Traces', error);
      }

      process.on('SIGTERM', async () => {
        try {
          sdk.shutdown();
          console.info('OpenTelemetry Traces terminated');
        } catch (error) {
          console.error('Error terminating OpenTelemetry Traces', error);
        } finally {
          process.exit(0);
        }
      });
    }
  } else {
    console.info('OpenTelemetry Traces disabled');
  }
}

initTraces();
