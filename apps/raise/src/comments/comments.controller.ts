import {
  Body,
  Controller,
  Get,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from '@nestjs/common';
import { ApiOperation, ApiResponse } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/jwt.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';
import { CurrentUser } from '../commons/decorators/current-user.decorator';
import { BaseResponse } from '../commons/dtos/base-response';
import { PaginatedResponse } from '../commons/dtos/paginated-response.dto';
import { baseResponseHelper } from '../commons/helpers/base-response-helper';
import { paginationHelper } from '../commons/helpers/pagination-helper';
import { validateObjectId } from '../commons/utils/validateObjectId';
import { Permission } from '../libs/authzed/enums/permission.enum';
import { ICurrentUser } from '../user/interfaces/current-user.interface';
import { CommentsService } from './comments.service';
import { CommentFilterRequest } from './dto/comment-filter-request.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentsDto } from './dto/delete-comments.dto';
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
  @Post('createComment')
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

  @ApiOperation({ summary: 'Get ALL USER comment without paginated' })
  @ApiResponse({
    status: 200,
    description: 'All user comments fetched successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('allComment')
  async getAllComment(
    @Query() filter: CommentFilterRequest,
  ): Promise<BaseResponse<CommentDocument[]>> {
    const userCommentList = await this.commentsService.getAllComment(filter);
    return baseResponseHelper(
      userCommentList,
      HttpStatus.OK,
      'All user comments fetched successfully.',
    );
  }

  @ApiOperation({ summary: 'Get ALL USER Comment Paginated' })
  @ApiResponse({
    status: 200,
    description: 'All user comments fetched successfully.',
  })
  @UseGuards(JwtAuthGuard)
  @Get('allCommentsPaginated')
  async getAllCommentPaginated(
    @Query() filter: CommentFilterRequest,
  ): Promise<PaginatedResponse<CommentDocument[]>> {
    const allUserComment = await this.commentsService.getAllCommentPaginated(
      filter,
    );
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
  @Get('currentUserComment')
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
  @Get('currentUserCommentPaginated')
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
  @Get('findComment')
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
  @Get('userComment/:id')
  async findCommentById(
    @Param('id') id: string,
  ): Promise<BaseResponse<CommentDocument>> {
    validateObjectId(id);
    const result = await this.commentsService.findCommentById(id);
    return baseResponseHelper(
      result,
      HttpStatus.OK,
      'Successfully fetch user comment.',
    );
  }

  @ApiOperation({ summary: 'Soft delete comment' })
  @ApiResponse({
    status: 200,
    description: 'Soft delete comment performed successfully!',
  })
  @Permissions(Permission.MO)
  @UseGuards(JwtAuthGuard, PermissionsGuard)
  @Patch('softDeleteComments')
  async softDeleteComment(
    @CurrentUser() user: ICurrentUser,
    @Body() request: DeleteCommentsDto,
  ): Promise<BaseResponse<Comment[] | undefined>> {
    const response = await this.commentsService.softDeleteComment(
      user.id,
      request,
    );
    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Soft delele comment performed successfully!',
    );
  }

  @ApiOperation({ summary: 'Soft delete current user comment' })
  @ApiResponse({
    status: 200,
    description: 'Soft delete comment performed successfully!',
  })
  @UseGuards(JwtAuthGuard)
  @Patch('softDeleteMyComments')
  async softDeleteMyComments(
    @CurrentUser() user: ICurrentUser,
    @Body() request: DeleteCommentsDto,
  ): Promise<BaseResponse<any>> {
    const response = await this.commentsService.softDeleteMyComments(
      user.id,
      request,
    );
    return baseResponseHelper(
      response,
      HttpStatus.OK,
      'Soft delete comment performed successfully!',
    );
  }
}
