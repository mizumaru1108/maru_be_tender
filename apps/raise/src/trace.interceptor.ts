import {
  CallHandler,
  ExecutionContext,
  Injectable,
  NestInterceptor,
} from '@nestjs/common';
import { catchError, Observable, tap, throwError } from 'rxjs';
import opentelemetry, {
  Tracer,
  trace,
  context as otelContext,
  SpanKind,
  SpanStatusCode,
} from '@opentelemetry/api';
// import { Request } from 'fastify';

@Injectable()
export class TraceInterceptor implements NestInterceptor {
  private tracer = opentelemetry.trace.getTracer('default');

  intercept(context: ExecutionContext, next: CallHandler): Observable<any> {
    return this.tracer.startActiveSpan(
      `${context.getClass().name}.${context.getHandler().name}`,
      { kind: SpanKind.SERVER },
      otelContext.active(),
      (span) => {
        // console.log('otelContext=', otelContext.active());
        const req = context.switchToHttp().getRequest();
        req.otelContext = otelContext.active();
        return next.handle().pipe(
          tap(() => {
            span.end();
          }),
          catchError((err) => {
            span.recordException(err);
            span.setStatus({
              code: SpanStatusCode.ERROR,
              message: String(err),
            });
            span.end();
            return throwError(() => err);
          }),
        );
        // try {
        //   // const span = opentelemetry.trace.getSpan(
        //   //   opentelemetry.context.active(),
        //   // );
        //   return await next.handle();
        // } catch (error) {
        //   span.recordException(error);
        //   span.setStatus({
        //     code: SpanStatusCode.ERROR,
        //     message: String(error),
        //   });
        //   return 0;
        // } finally {
        //   span.end();
        // }
      },
    );
  }
}
