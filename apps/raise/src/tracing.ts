import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import opentelemetry from '@opentelemetry/sdk-node';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';
import {
  BasicTracerProvider,
  ConsoleSpanExporter,
  SimpleSpanProcessor,
} from '@opentelemetry/sdk-trace-base';

export async function initTracing() {
  if (
    process.env.OTEL_TRACE_ENABLED === 'true' ||
    process.env.OTEL_TRACE_ENABLED === '1'
  ) {
    console.info(
      `OpenTelemetry Tracing enabled, endpoint: ${process.env.OTEL_EXPORTER_OTLP_ENDPOINT}`,
    );
    const exporter = new OTLPTraceExporter({
      url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
    });

    const provider = new BasicTracerProvider({
      resource: new Resource({
        [SemanticResourceAttributes.SERVICE_NAME]: 'tmra-raise',
        [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]:
          process.env.APP_ENV,
        [SemanticResourceAttributes.SERVICE_VERSION]: process.env.APP_VERSION,
      }),
    });
    // export spans to console (useful for debugging)
    provider.addSpanProcessor(
      new SimpleSpanProcessor(new ConsoleSpanExporter()),
    );
    // export spans to opentelemetry collector
    provider.addSpanProcessor(new SimpleSpanProcessor(exporter));

    provider.register();
    const sdk = new opentelemetry.NodeSDK({
      traceExporter: exporter,
      instrumentations: [getNodeAutoInstrumentations()],
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
        console.log('Tracing terminated');
      } catch (error) {
        console.error('Error terminating tracing', error);
      } finally {
        process.exit(0);
      }
    });
  } else {
    console.info('OpenTelemetry Tracing disabled');
  }
}
