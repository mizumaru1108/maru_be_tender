import {
  BadRequestException,
  Body,
  Controller,
  Get,
  HttpStatus,
  InternalServerErrorException,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { CommandBus, QueryBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import { BaseApiOkResponse } from '../../commons/decorators/base.api.ok.response.decorator';
import { BasePaginationApiOkResponse } from '../../commons/decorators/base.pagination.api.ok.response.decorator';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { PayloadErrorException } from '../../tender-commons/exceptions/payload-error.exception';
import { manualPaginationHelper } from '../../tender-commons/helpers/manual-pagination-helper';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';
import {
  ContactUsCreateCommand,
  ContactUsCreateCommandResult,
} from '../commands/contact.us.create.command/contact.us.create.command';
import { ContactUsFindmanyQueryDto } from '../dtos/queries/contact.us.find.many.query.dto';
import { ContactUsCreateDto } from '../dtos/requests/contact.us.create.dto';
import { ContactUsEntity } from '../entities/contact.us.entity';
import {
  ContactUsFindManyQuery,
  ContactUsFindManyQueryResult,
} from '../queries/contact.us.find.many.query/contact.us.find.many.query';

@Controller('contact-us')
export class ContactUsHttpController {
  constructor(
    private readonly commandBus: CommandBus,
    private readonly queryBus: QueryBus,
  ) {}

  errorMapper(error: any) {
    if (error instanceof PayloadErrorException) {
      return new BadRequestException(error.message);
    }

    return new InternalServerErrorException(error);
  }
  @ApiOperation({
    summary: 'Submit contact us to admin (client only)',
  })
  @BaseApiOkResponse(ContactUsEntity, 'object')
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_client')
  @Post('create')
  async create(
    @CurrentUser() currentUser: TenderCurrentUser,
    @Body() dto: ContactUsCreateDto,
  ) {
    try {
      const command = Builder<ContactUsCreateCommand>(ContactUsCreateCommand, {
        ...dto,
        submitter_user_id: currentUser.id,
        date_of_visit: dto.date_of_visit
          ? new Date(dto.date_of_visit)
          : undefined,
      }).build();

      const result = await this.commandBus.execute<
        ContactUsCreateCommand,
        ContactUsCreateCommandResult
      >(command);

      return baseResponseHelper(
        result.created_entity,
        HttpStatus.CREATED,
        'Authority Created Successfully!',
      );
    } catch (e) {
      throw this.errorMapper(e);
    }
  }

  @ApiOperation({
    summary: 'Find Contact Us (admin only)',
  })
  @BasePaginationApiOkResponse(ContactUsEntity)
  @UseGuards(TenderJwtGuard, TenderRolesGuard)
  @TenderRoles('tender_admin')
  @Get()
  async findMany(@Query() query: ContactUsFindmanyQueryDto) {
    try {
      const builder = Builder<ContactUsFindManyQuery>(ContactUsFindManyQuery, {
        ...query,
      });

      const { result, total } = await this.queryBus.execute<
        ContactUsFindManyQuery,
        ContactUsFindManyQueryResult
      >(builder.build());

      return manualPaginationHelper(
        result,
        total,
        query.page || 1,
        query.limit || 10,
        HttpStatus.OK,
        'Contact Us List Fetched Successfully!',
      );
    } catch (error) {
      throw this.errorMapper(error);
    }
  }

  // @Get(':id')
  // async findById(@Res() res: Response, @Param('id') id: string) {
  //   const responseBuilder =
  //     Builder<BaseHttpResponseDto<AuthoritiesEntity, any>>(
  //       BaseHttpResponseDto,
  //     );
  //   responseBuilder.statusCode(200);
  //   responseBuilder.message('Authority Fetched Successfully');

  //   const query = Builder<AuthoritiesFindByIdQuery>(
  //     AuthoritiesFindByIdQuery,
  //     {
  //       id,
  //     },
  //   ).build();

  //   const result = await this.queryBus.execute(query);

  //   responseBuilder.data(result);

  //   return baseHttpResponseHelper(res, responseBuilder.build());
  // }

  //   @UseGuards(TenderJwtGuard)
  //   @Post('update')
  //   async update(@Res() res: Response, @Body() dto: AuthoritiesUpdateDto) {
  //     try {
  //          const command = Builder<AuthoritiesCommand>(
  //              AuthoritiesUpdateCommand,
  //          {
  //               ...dto,
  //          },
  //          ).build();

  //      const result = await this.commandBus.execute<
  //          AuthoritiesUpdateCommand,
  //          AuthoritiesUpdateCommandResult
  //      >(command);

  //      return baseHttpResponseHelper(res, {
  //          data: result,
  //          message: 'Authority Updated Successfully!',
  //          statusCode: HttpStatus.OK,
  //      });
  //        } catch (e) {
  //          throw e;
  //        }
  //  }
}
