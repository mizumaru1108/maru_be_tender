import tracer from 'dd-trace';

// initialized in a different file to avoid hoisting.
tracer.init({
  service: 'tmra-raise',
  env: process.env.APP_ENV,
  version: process.env.APP_VERSION,
  // https://docs.datadoghq.com/tracing/connect_logs_and_traces/nodejs/
  logInjection: true,
  // logLevel: 'debug',
});
export default tracer;
