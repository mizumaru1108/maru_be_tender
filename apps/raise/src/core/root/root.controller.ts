import { Controller, Get, Request } from '@nestjs/common';
import { CoreService, ResponseWrapper } from '../core.service';

@Controller()
export class RootController {
  // private tracer = opentelemetry.trace.getTracer('RootController');

  constructor(private readonly coreService: CoreService) {}

  @Get()
  getHello(@Request() request: any): ResponseWrapper {
    // return this.tracer.startActiveSpan('inner trace', (span) => {
    //   try {
    return this.coreService.getHello();
    //   } catch (err) {
    //     span.recordException(err);
    //     span.setStatus({
    //       code: SpanStatusCode.ERROR,
    //       message: String(err),
    //     });
    //     throw err;
    //   } finally {
    //     span.end();
    //   }
    // });
  }
}
