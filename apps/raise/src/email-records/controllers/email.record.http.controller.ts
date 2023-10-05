import {
  BadRequestException,
  Body,
  ConflictException,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Post,
  Query,
  UploadedFiles,
  UseGuards,
  UseInterceptors,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation, ApiTags } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';

import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { BaseApiOkResponse } from '../../commons/decorators/base.api.ok.response.decorator';
import { BasePaginationApiOkResponse } from '../../commons/decorators/base.pagination.api.ok.response.decorator';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import {
  EmailRecordCreateCommand,
  MailingCreateCommandResult,
} from '../commands/email.record.create.command/email.record.create.command';
import { EmailRecordFindByIdQueryDto } from '../dto/queries/email.record.find.by.id.query.dto';
import { MailingCreateDto } from '../dto/requests/mailing.create.dto';
import { EmailRecordEntity } from '../entities/email.record.entity';
import {
  EmailRecordFindByIdQuery,
  EmailRecordFindByIdQueryResult,
} from '../queries/email.record.find.by.id/email.record.find.by.id.query';
import {
  EmailRecordFindManyQuery,
  EmailRecordFindManyQueryResult,
} from '../queries/email.record.find.many/email.record.find.many.query';
import { ClientEmailRecordFindManyQueryDto } from '../dto/queries/email.record.client.find.many.query.dto';
import { AdminEmailRecordFindManyQueryDto } from '../dto/queries/email.record.admin.find.many.query.dto';

@ApiTags('EmailRecords')
@Controller('tender/email-records')
export class EmailRecordHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(e: any) {
    console.trace(e);
    if (
      e instanceof BadRequestException ||
      e instanceof NotFoundException ||
      e instanceof ConflictException ||
      e instanceof InternalServerErrorException
    ) {
      return e;
    }

    return new InternalServerErrorException(e);
  }

  @ApiOperation({ summary: 'Send Email (supervisor)' })
  @BaseApiOkResponse(EmailRecordEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @UseInterceptors(
    FileFieldsInterceptor([{ name: 'attachments', maxCount: 4 }]),
  )
  @TenderRoles('tender_project_supervisor')
  @Post('create')
  async create(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() request: MailingCreateDto,
    @UploadedFiles() files: { attachments?: Express.Multer.File[] },
  ) {
    try {
      const command = Builder<EmailRecordCreateCommand>(
        EmailRecordCreateCommand,
        {
          ...request,
          sender_id: currentUser.id,
          attachments: files.attachments,
        },
      ).build();

      const { data } = await this.commandBus.execute<
        EmailRecordCreateCommand,
        MailingCreateCommandResult
      >(command);

      return baseResponseHelper(
        data,
        HttpStatus.CREATED,
        'Mailing Created Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  // @ApiOperation({
  //   summary: 'Updating track (admin only)',
  // })
  // @BaseApiOkResponse(EmailRecordEntity, 'object')
  // @UseGuards(TenderJwtGuard, TenderRolesGuard)
  // @TenderRoles('tender_admin')
  // @Patch('update')
  // async update(@Body() request: UpdateTrackDto) {
  //   try {
  //     const command = Builder<TrackUpdateCommand>(TrackUpdateCommand, {
  //       ...request,
  //     }).build();

  //     const result = await this.commandBus.execute<
  //       TrackUpdateCommand,
  //       TrackUpdateCommandResult
  //     >(command);

  //     return baseResponseHelper(
  //       result,
  //       HttpStatus.CREATED,
  //       'Track Updated Successfully!',
  //     );
  //   } catch (e) {
  //     throw this.errorMapper(e);
  //   }
  // }

  @ApiOperation({ summary: 'Find many email records' })
  @BasePaginationApiOkResponse(EmailRecordEntity)
  @UseGuards(TenderJwtGuard)
  @Get()
  async findMany(@Query() query: AdminEmailRecordFindManyQueryDto) {
    const builder = Builder<EmailRecordFindManyQuery>(
      EmailRecordFindManyQuery,
      {
        ...query,
      },
    );

    const { data, total } = await this.queryBus.execute<
      EmailRecordFindManyQuery,
      EmailRecordFindManyQueryResult
    >(builder.build());

    return manualPaginationHelper(
      data,
      total,
      query.page || 1,
      query.limit || 10,
      HttpStatus.OK,
      'Email Records List Fetched Successfully!',
    );
  }

  @ApiOperation({ summary: 'Find many email records' })
  @BasePaginationApiOkResponse(EmailRecordEntity)
  @UseGuards(TenderJwtGuard)
  @Get('mine')
  async findMine(@Query() query: ClientEmailRecordFindManyQueryDto) {
    const builder = Builder<EmailRecordFindManyQuery>(
      EmailRecordFindManyQuery,
      {
        ...query,
      },
    );

    const { data, total } = await this.queryBus.execute<
      EmailRecordFindManyQuery,
      EmailRecordFindManyQueryResult
    >(builder.build());

    return manualPaginationHelper(
      data,
      total,
      query.page || 1,
      query.limit || 10,
      HttpStatus.OK,
      'Email Records List Fetched Successfully!',
    );
  }

  @ApiOperation({ summary: 'find email record by id' })
  @BaseApiOkResponse(EmailRecordEntity, 'object')
  @UseGuards(TenderJwtGuard)
  @Get('/:email_record_id')
  async findById(
    @Param('email_record_id') email_record_id: string,
    @Query() queryParam: EmailRecordFindByIdQueryDto,
  ) {
    try {
      const queries = Builder<EmailRecordFindByIdQuery>(
        EmailRecordFindByIdQuery,
        {
          email_record_id,
          ...queryParam,
        },
      ).build();

      const { data } = await this.queryBus.execute<
        EmailRecordFindByIdQuery,
        EmailRecordFindByIdQueryResult
      >(queries);

      return baseResponseHelper(
        data,
        HttpStatus.OK,
        'Email Records Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }
}
