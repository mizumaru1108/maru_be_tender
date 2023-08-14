import { Body, Controller, HttpStatus, Post, UseGuards } from '@nestjs/common';
import { CommandBus } from '@nestjs/cqrs';
import { ApiOperation } from '@nestjs/swagger';
import { Builder } from 'builder-pattern';
import {
  ContactUsCreateCommand,
  ContactUsCreateCommandResult,
} from '../commands/contact.us.create.command/contact.us.create.command';
import { ContactUsCreateDto } from '../dtos/requests/contact.us.create.dto';
import { ContactUsEntity } from '../entities/contact.us.entity';
import { BaseApiOkResponse } from '../../commons/decorators/base.api.ok.response.decorator';
import { baseResponseHelper } from '../../commons/helpers/base-response-helper';
import { TenderRoles } from '../../tender-auth/decorators/tender-roles.decorator';
import { TenderJwtGuard } from '../../tender-auth/guards/tender-jwt.guard';
import { TenderRolesGuard } from '../../tender-auth/guards/tender-roles.guard';
import { CurrentUser } from '../../commons/decorators/current-user.decorator';
import { TenderCurrentUser } from '../../tender-user/user/interfaces/current-user.interface';

@Controller('contact-us')
export class ContactUsHttpController {
  constructor(private readonly commandBus: CommandBus) {}

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
      throw e;
    }
  }

  // @Get()
  // async findMany(
  //   @Res() res: Response,
  //   @Query() dto: AuthoritiesFindManyQueryDto,
  // ) {
  //   const { page, limit } = dto;

  //   const responseBuilder = Builder<
  //     BaseHttpPaginatedResponseDto<AuthoritiesEntity[], any>
  //   >(BaseHttpPaginatedResponseDto);
  //   responseBuilder.statusCode(200);
  //   responseBuilder.message('Authority List Fetched Successfully!');

  //   const builder = Builder<AuthoritiesFindManyQuery>(
  //     AuthoritiesFindManyQuery,
  //     {
  //       ...dto,
  //     },
  //   );

  //   const { result, total } = await this.queryBus.execute<
  //     AuthoritiesFindManyQuery,
  //     AuthoritiesFindManyQueryResult
  //   >(builder.build());

  //   responseBuilder.data(result);
  //   responseBuilder.page(page);
  //   responseBuilder.per_page(limit);
  //   responseBuilder.total(total);

  //   return basePaginatedResponseHelper(res, responseBuilder.build());
  // }

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
