import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
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
import { JaegerExporter } from '@opentelemetry/exporter-jaeger';

export async function initTracing() {
  const traceEnabled =
    process.env.OTEL_TRACE_ENABLED === 'true' ||
    process.env.OTEL_TRACE_ENABLED === '1';
  const traceConsoleEnabled =
    process.env.OTEL_TRACE_CONSOLE_ENABLED === 'true' ||
    process.env.OTEL_TRACE_CONSOLE_ENABLED === '1';
  // For troubleshooting, set the log level to DiagLogLevel.DEBUG
  const logLevel =
    process.env.OTEL_LOG_LEVEL === 'DEBUG'
      ? DiagLogLevel.DEBUG
      : DiagLogLevel.INFO;
  diag.setLogger(new DiagConsoleLogger(), logLevel);
  if (traceEnabled || traceConsoleEnabled) {
    console.info(`OpenTelemetry Tracing enabled`);
    // const provider = new NodeTracerProvider({
    //   resource: new Resource({
    //     [SemanticResourceAttributes.SERVICE_NAME]: 'tmra-raise',
    //     [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
    //       process.env.APP_ENV,
    //     [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION,
    //   }),
    // });
    // export spans to console (useful for debugging)
    let spanProcessor: SpanProcessor | undefined = undefined;
    let consoleExporter: ConsoleSpanExporter | undefined = undefined;
    if (traceConsoleEnabled) {
      consoleExporter = new ConsoleSpanExporter();
      console.info('Console span processor enabled');
      // provider.addSpanProcessor(
      //   new SimpleSpanProcessor(new ConsoleSpanExporter()),
      // );
      spanProcessor = new BatchSpanProcessor(new ConsoleSpanExporter());
    }
    // export spans to OpenTelemetry collector
    let otlpExporter: OTLPTraceExporter | undefined = undefined;
    if (process.env.OTEL_EXPORTER_OTLP_ENDPOINT) {
      otlpExporter = new OTLPTraceExporter({
        url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
      });
      console.info(
        `OTLP trace endpoint: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`,
      );
      // provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
      spanProcessor = new BatchSpanProcessor(otlpExporter);
    }
    // export spans to OpenTelemetry collector
    let jaegerExporter: JaegerExporter | undefined = undefined;
    if (process.env.OTEL_EXPORTER_JAEGER_ENDPOINT) {
      jaegerExporter = new JaegerExporter({
        endpoint: process.env.OTEL_EXPORTER_JAEGER_ENDPOINT,
        port: 6832,
      });
      console.info(
        `Jaeger trace endpoint: ${process.env.OTEL_EXPORTER_JAEGER_ENDPOINT}`,
      );
      // provider.addSpanProcessor(new SimpleSpanProcessor(otlpExporter));
      spanProcessor = new BatchSpanProcessor(jaegerExporter);
    }

    // Initialize the provider
    // provider.register();
    // register and load instrumentation and old plugins - old plugins will be loaded automatically as previously
    // but instrumentations needs to be added
    // registerInstrumentations({
    //   instrumentations: [new NestInstrumentation()],
    //   tracerProvider: provider,
    // });
    if (otlpExporter || consoleExporter) {
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
          // new NestInstrumentation(),
        ],
      });

      try {
        await sdk.start();
        console.info('Tracing initialized');
      } catch (error) {
        console.error('Error initializing tracing', error);
      }

      process.on('SIGTERM', async () => {
        try {
          sdk.shutdown();
          console.info('Tracing terminated');
        } catch (error) {
          console.error('Error terminating tracing', error);
        } finally {
          process.exit(0);
        }
      });
    }
  } else {
    console.info('OpenTelemetry Tracing disabled');
  }
}
