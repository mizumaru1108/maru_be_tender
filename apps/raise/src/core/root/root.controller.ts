import { Controller, Get, Request, UseInterceptors } from '@nestjs/common';
import { CoreService, ResponseWrapper } from '../core.service';
import opentelemetry, {
  Tracer,
  trace,
  context,
  SpanOptions,
  Context,
} from '@opentelemetry/api';
import { TraceInterceptor } from 'src/trace.interceptor';

@Controller()
@UseInterceptors(TraceInterceptor)
export class RootController {
  private tracer = opentelemetry.trace.getTracer('RootController');

  constructor(private readonly coreService: CoreService) {}

  @Get()
  getHello(@Request() request: any): ResponseWrapper {
    // console.log('before otelContext=', request.otelContext);
    return this.tracer.startActiveSpan(
      'getHello',
      {},
      request.otelContext,
      (span) => {
        try {
          // const span = opentelemetry.trace.getSpan(
          //   opentelemetry.context.active(),
          // );
          return this.coreService.getHello();
        } finally {
          span.end();
        }
      },
    );
  }
}
