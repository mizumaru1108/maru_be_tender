import {
  BadRequestException,
  ForbiddenException,
  HttpException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectConnection, InjectModel } from '@nestjs/mongoose';
import {
  AggregatePaginateModel,
  AggregatePaginateResult,
  Connection,
  FilterQuery,
  Model,
  PaginateModel,
  PaginateResult,
  PipelineStage,
  Types,
} from 'mongoose';
import { BaseBooleanString } from '../commons/enums/base-boolean-string.enum';
import { SortMethod } from '../commons/enums/sortby-method';
import { CommentFilterRequest } from './dto/comment-filter-request.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { DeleteCommentsDto } from './dto/delete-comments.dto';
import { Comment, CommentDocument } from './schema/comment.schema';

const lookupUser: PipelineStage[] = [
  {
    $lookup: {
      from: 'user',
      localField: 'commentOwnerId',
      foreignField: '_id',
      as: 'commentOwnerDetails',
    },
  },
];

const lookupCampaign: PipelineStage[] = [
  {
    $lookup: {
      from: 'campaign',
      localField: 'campaignId',
      foreignField: '_id',
      as: 'campaignDetails',
    },
  },
];

const lookupProject: PipelineStage[] = [
  {
    $lookup: {
      from: 'project',
      localField: 'projectId',
      foreignField: '_id',
      as: 'projectDetails',
    },
  },
];

const lookupItem: PipelineStage[] = [
  {
    $lookup: {
      from: 'item',
      localField: 'itemId',
      foreignField: '_id',
      as: 'itemDetails',
    },
  },
];

const lookupParrentComment: PipelineStage[] = [
  {
    $lookup: {
      from: 'comments',
      localField: 'parentCommentId',
      foreignField: '_id',
      as: 'parentCommentDetails',
    },
  },
];

@Injectable()
export class CommentsService {
  constructor(
    @InjectConnection() private readonly connection: Connection, // mongodb DB transaction
    @InjectModel(Comment.name)
    private commentModel: Model<CommentDocument>,
    @InjectModel(Comment.name)
    private commentPaginateModel: PaginateModel<CommentDocument>,
    @InjectModel(Comment.name)
    private commentAggregatePaginateModel: AggregatePaginateModel<CommentDocument>,
  ) {}

  validateAmbiguousRequest(request: CreateCommentDto) {
    if (!request.campaignId && !request.projectId && !request.itemId) {
      throw new BadRequestException(
        'User must create comment in campaign, project or item',
      );
    }

    if (request.campaignId || request.projectId || request.itemId) {
      let badRequest = () => {
        throw new BadRequestException(
          'User can only create comment in one place at a time',
        );
      };
      if (request.campaignId && request.projectId && request.projectId) {
        return badRequest();
      }
      if (request.campaignId && request.itemId) return badRequest();
      if (request.campaignId && request.projectId) return badRequest();
      if (request.projectId && request.itemId) return badRequest();
    }
  }

  async applyCommentFilter(
    filter: CommentFilterRequest,
  ): Promise<FilterQuery<CommentDocument>> {
    const filterQuery: FilterQuery<CommentDocument> = {};
    const { campaignId, projectId, itemId, parentCommentId, commentOwnerId } =
      filter;

    if (campaignId) {
      filterQuery.campaignId = new Types.ObjectId(campaignId);
    }
    if (projectId) {
      filterQuery.projectId = new Types.ObjectId(projectId);
    }
    if (itemId) {
      filterQuery.itemId = new Types.ObjectId(itemId);
    }
    if (parentCommentId) {
      filterQuery.parentCommentId = new Types.ObjectId(parentCommentId);
    }
    if (commentOwnerId) {
      filterQuery.commentOwnerId = commentOwnerId;
    }

    return filterQuery;
  }

  async applySorting(filter: CommentFilterRequest) {
    const { sortBy, sortMethod } = filter;
    const method: 1 | -1 = sortMethod === SortMethod.ASC ? 1 : -1;
    let sortByQuery: Record<string, 1 | -1> = {};

    if (sortBy) {
      if (sortBy == 'createdAt') {
        sortByQuery = { createdAt: method };
      }
      if (sortBy == 'updatedAt') {
        sortByQuery = { updatedAt: method };
      }
    } else {
      sortByQuery = { updatedAt: method };
    }
    return sortByQuery;
  }

  async createComment(
    currentUserId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    this.validateAmbiguousRequest(createCommentDto);
    const commentPayload = Comment.mapFromCreateRequest(createCommentDto);
    commentPayload.commentOwnerId = currentUserId;
    const createdComment = new this.commentModel(commentPayload);
    return await createdComment.save();
  }

  async getAllComment(
    filter: CommentFilterRequest,
  ): Promise<CommentDocument[]> {
    const filterQuery = await this.applyCommentFilter(filter);
    const sortByQuery = await this.applySorting(filter);
    return await this.commentModel.aggregate([
      { $match: filterQuery },
      { $sort: sortByQuery },
      ...lookupUser,
      ...lookupParrentComment,
      ...lookupCampaign,
      ...lookupProject,
      ...lookupItem,
    ]);
  }

  async getAllCommentPaginated(
    filter: CommentFilterRequest,
  ): Promise<AggregatePaginateResult<CommentDocument>> {
    const filterQuery = await this.applyCommentFilter(filter);
    const sortByQuery = await this.applySorting(filter);
    const aggregateQuerry = this.commentModel.aggregate([
      { $match: filterQuery },
      { $sort: sortByQuery },
      ...lookupUser,
      ...lookupParrentComment,
      ...lookupCampaign,
      ...lookupProject,
      ...lookupItem,
    ]);

    const result = await this.commentAggregatePaginateModel.aggregatePaginate(
      aggregateQuerry,
      {
        page: filter.page,
        limit: filter.limit,
      },
    );

    return result;
  }

  async getCurrentUserComment(
    userId: string,
    filter: CommentFilterRequest,
  ): Promise<CommentDocument[]> {
    filter.commentOwnerId = userId;
    const filterQuery = await this.applyCommentFilter(filter);
    const sortByQuery = await this.applySorting(filter);
    const { page = 1, limit = 0 } = filter;
    const offset = (page - 1) * limit;
    return await this.commentModel
      .find(filterQuery)
      .sort(sortByQuery)
      .skip(offset)
      .limit(limit);
  }

  async getCurrentUserCommentPaginated(
    userId: string,
    filter: CommentFilterRequest,
  ): Promise<PaginateResult<CommentDocument>> {
    filter.commentOwnerId = userId;
    const filterQuery = await this.applyCommentFilter(filter);
    const sortByQuery = await this.applySorting(filter);
    return await this.commentPaginateModel.paginate(
      {
        ...filterQuery,
      },
      {
        page: filter.page,
        limit: filter.limit,
        sort: sortByQuery,
      },
    );
  }

  async findOneComment(filter: CommentFilterRequest): Promise<CommentDocument> {
    const filterQuery = await this.applyCommentFilter(filter);
    const result = await this.commentModel.aggregate([
      { $match: filterQuery },
      ...lookupUser,
      ...lookupParrentComment,
      ...lookupCampaign,
      ...lookupProject,
      ...lookupItem,
    ]);
    if (result.length == 0) {
      throw new NotFoundException(`Comment not found`);
    }
    return result[0];
  }

  async findCommentById(id: string): Promise<CommentDocument> {
    const result = await this.commentModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      ...lookupUser,
      ...lookupParrentComment,
      ...lookupCampaign,
      ...lookupProject,
      ...lookupItem,
    ]);
    if (result.length == 0) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return result[0];
  }

  async softDeleteMyComments(
    userId: string,
    request: DeleteCommentsDto,
  ): Promise<Comment[] | undefined> {
    let deletedCommets: Comment[] = [];
    const session = await this.connection.startSession();

    try {
      session.startTransaction(); // start mongodb transaction

      const promises = request.commentIds.map(async (commentId, index) => {
        const comment = await this.commentModel
          .findOne({
            _id: new Types.ObjectId(commentId),
          })
          .session(session);

        if (!comment) {
          throw new NotFoundException(`Comment with id ${commentId} not found`);
        }

        if (comment.commentOwnerId !== userId) {
          throw new ForbiddenException(
            `You are not the owner of this comment! (comment at index ${index}, comment id ${commentId})`,
          );
        }

        comment.isDeleted = BaseBooleanString.Y;
        comment.deletedDate = new Date();
        comment.deletedBy = userId;

        // if break occured, this will not be executed
        const updateComment = await comment.save({ session });
        if (!updateComment) {
          throw new InternalServerErrorException(
            `Something went wrong when deleting comment at index ${index}, comment id ${commentId}`,
          );
        }
        // if break, no comment will be pushed to deletedCommets
        deletedCommets.push(updateComment);
      });

      await Promise.all(promises);
      await session.commitTransaction(); // apply changes to database if no error occured.
      return deletedCommets;
    } catch (error) {
      console.log('error', error);
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      await session.abortTransaction(); // rollback changes if error occured.
    } finally {
      session.endSession(); // close mongodb session
    }
  }

  async softDeleteComment(
    currentUserId: string,
    request: DeleteCommentsDto,
  ): Promise<Comment[] | undefined> {
    const session = await this.connection.startSession();
    try {
      session.startTransaction(); // start mongodb transaction
      let deletedCommets: Comment[] = [];

      const promises = request.commentIds.map(async (commentId, index) => {
        const comment = await this.commentModel.findOne({
          _id: new Types.ObjectId(commentId),
        });
        if (!comment) {
          throw new NotFoundException(`Comment with id ${commentId} not found`);
        }
        comment.isDeleted = BaseBooleanString.Y;
        comment.deletedDate = new Date();
        comment.deletedBy = currentUserId;
        const updateComment = await comment.save({ session });
        if (!updateComment) {
          throw new InternalServerErrorException(
            `Something went wrong when deleting comment at index ${index}, comment id ${commentId}`,
          );
        }
        deletedCommets.push(updateComment);
      });
      await Promise.all(promises);

      await session.commitTransaction(); // apply changes to database if no error occured.
      return deletedCommets;
    } catch (error) {
      console.log('error', error);
      if (error.response) {
        throw new HttpException(
          error.response.message,
          error.response.statusCode,
        );
      }
      await session.abortTransaction(); // rollback changes if error occured.
    } finally {
      session.endSession(); // close mongodb session
    }
  }
}
