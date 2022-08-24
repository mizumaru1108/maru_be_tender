import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  HttpStatus,
  Query,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { BaseResponse } from '../commons/dtos/base-response';
import { PaginatedResponse } from '../commons/dtos/paginated-response.dto';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { paginationHelper } from '../commons/helpers/pagination-helper';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { CommentsService } from './comments.service';
import { AdminCommentFilterRequest } from './dto/admin-comment-filter-request.dto';
import { CommentFilterRequest } from './dto/comment-filter-request.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { Comment, CommentDocument } from './schema/comment.schema';

@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  /* can be filtered by campaign, project, item */
  @ApiOperation({ summary: 'Create Comment' })
  @ApiResponse({
    status: 201,
    description: 'Comment created successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Post('create-comment')
  async createComment(
    @CurrentUser() user: ICurrentUser,
    @Body() createCommentDto: CreateCommentDto,
  ): Promise<BaseResponse<Comment>> {
    const createdComment = await this.commentsService.createComment(
      user.id,
      createCommentDto,
    );
    return baseResponseHelper(
      createdComment,
      HttpStatus.CREATED,
      'Comment created successfully.',
    );
  }

  // !TODO: Secure it with CASL for admin only.
  /* can be filtered by campaign, project, item */
  @ApiOperation({ summary: 'Get ALL USER comment without paginated' })
  @ApiResponse({
    status: 200,
    description: 'All user comments fetched successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('all-comment')
  async getAllUserComment(
    @Query() filter: AdminCommentFilterRequest,
  ): Promise<BaseResponse<CommentDocument[]>> {
    const userCommentList = await this.commentsService.getAllUserComment(
      filter,
    );
    return baseResponseHelper(
      userCommentList,
      HttpStatus.OK,
      'All user comments fetched successfully.',
    );
  }

  // !TODO: Secure it with CASL for admin only.
  @ApiOperation({ summary: 'Get ALL USER Comment Paginated' })
  @ApiResponse({
    status: 200,
    description: 'All user comments fetched successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('all-comments-paginated')
  async getAllUserCommentPaginated(
    @Query() filter: AdminCommentFilterRequest,
  ): Promise<PaginatedResponse<CommentDocument[]>> {
    const allUserComment =
      await this.commentsService.getAllUserCommentPaginated(filter);
    return paginationHelper(
      allUserComment.docs,
      allUserComment.totalDocs,
      allUserComment.limit,
      allUserComment.page,
      allUserComment.totalPages,
      allUserComment.pagingCounter,
      allUserComment.hasPrevPage,
      allUserComment.hasNextPage,
      allUserComment.prevPage,
      allUserComment.nextPage,
      HttpStatus.OK,
      'All user comments fetched successfully.',
    );
  }

  @ApiOperation({ summary: 'Get CURRENT USER comment' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetch all of my comment.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('current-user-comment')
  async getMyComment(
    @CurrentUser() user: ICurrentUser,
    @Query() filter: CommentFilterRequest,
  ): Promise<BaseResponse<CommentDocument[]>> {
    const userCommentList = await this.commentsService.getCurrentUserComment(
      user.id,
      filter,
    );
    return baseResponseHelper(
      userCommentList,
      HttpStatus.OK,
      'Successfully fetch all of my comment.',
    );
  }

  @ApiOperation({ summary: 'Get CURRENT USER comment PAGINATED' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetch all of my comment.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('current-user-comment-paginated')
  async getMyCommentPaginated(
    @CurrentUser() user: ICurrentUser,
    @Query() filter: CommentFilterRequest,
  ): Promise<PaginatedResponse<CommentDocument[]>> {
    const currentUserCommentList =
      await this.commentsService.getCurrentUserCommentPaginated(
        user.id,
        filter,
      );
    return paginationHelper(
      currentUserCommentList.docs,
      currentUserCommentList.totalDocs,
      currentUserCommentList.limit,
      currentUserCommentList.page,
      currentUserCommentList.totalPages,
      currentUserCommentList.pagingCounter,
      currentUserCommentList.hasPrevPage,
      currentUserCommentList.hasNextPage,
      currentUserCommentList.prevPage,
      currentUserCommentList.nextPage,
      HttpStatus.OK,
      'Successfully fetch all of my comment.',
    );
  }

  @ApiOperation({ summary: 'Get user comment with filter' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetch user comment.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('find-comment')
  async findOneComment(
    @Query() filter: CommentFilterRequest,
  ): Promise<BaseResponse<CommentDocument>> {
    const result = await this.commentsService.findOneComment(filter);
    return baseResponseHelper(
      result,
      HttpStatus.OK,
      'Successfully fetch user comment.',
    );
  }

  @ApiOperation({ summary: 'Get user comment by id' })
  @ApiResponse({
    status: 200,
    description: 'Successfully fetch user comment.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('user-comment/:id')
  async findCommentById(
    @Param('id') id: string,
  ): Promise<BaseResponse<CommentDocument>> {
    const result = await this.commentsService.findCommentById(id);
    return baseResponseHelper(
      result,
      HttpStatus.OK,
      'Successfully fetch user comment.',
    );
  }

  //!TODO: softdelete, softdelte batch, delete, delete batch
  // @Patch(':id')
  // async softDelete(
  //   @Param('id') id: string,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // ) {
  //   return this.commentsService.update(+id, updateCommentDto);
  // }

  // @Patch(':id')
  // async softDeleteBatch(
  //   @Param('id') id: string,
  //   @Body() updateCommentDto: UpdateCommentDto,
  // ) {
  //   return this.commentsService.update(+id, updateCommentDto);
  // }

  // @Delete(':id')
  // async delete(@Param('id') id: string) {
  //   return this.commentsService.remove(+id);
  // }

  // @Delete(':id')
  // async deleteBatch(@Param('id') id: string) {
  //   return this.commentsService.remove(+id);
  // }
}
