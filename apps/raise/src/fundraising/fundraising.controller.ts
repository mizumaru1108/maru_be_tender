import { Controller, UseInterceptors } from '@nestjs/common';
import { TraceInterceptor } from 'src/trace.interceptor';

@Controller('fundraising')
@UseInterceptors(TraceInterceptor)
export class FundraisingController {}
