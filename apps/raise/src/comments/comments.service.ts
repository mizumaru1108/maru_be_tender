import {
  BadRequestException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import {
  AggregatePaginateModel,
  FilterQuery,
  Model,
  PaginateModel,
  PaginateResult,
  PipelineStage,
  SortOrder,
} from 'mongoose';
import { CommentFilterRequest } from './dto/comment-filter-request.dto';
import { CreateCommentDto } from './dto/create-comment.dto';
import { UpdateCommentDto } from './dto/update-comment.dto';
import { createCommentDtoMapper } from './mappers/create-comment.mapper';
import { Comment, CommentDocument } from './schema/comment.schema';
import { Types } from 'mongoose';
import { SortBy } from '../commons/enums/sortby-enum';
import { AdminCommentFilterRequest } from './dto/admin-comment-filter-request.dto';

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
  /**
   * tbh i wanna use repository design pattern T-T,
   * to split between business logic and store to database
   *
   * constructor(private readonly commentRepository: CommentRepository) {}
   */

  constructor(
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
    filter: AdminCommentFilterRequest,
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
    const { sortBy } = filter;
    // type of sort in mongoose = { [key: string]: SortOrder | { $meta: 'textScore' } } = {};
    let sortByQuery: { [key: string]: SortOrder | { $meta: 'textScore' } } = {};
    if (sortBy == SortBy.ASC) {
      sortByQuery = { createdAt: 1 };
    }
    if (sortBy == SortBy.DESC) {
      sortByQuery = { createdAt: -1 };
    }
    return sortByQuery;
  }

  async createComment(
    currentUserId: string,
    createCommentDto: CreateCommentDto,
  ): Promise<Comment> {
    this.validateAmbiguousRequest(createCommentDto);
    const commentPayload = createCommentDtoMapper(createCommentDto);
    commentPayload.commentOwnerId = currentUserId;
    const createdComment = new this.commentModel(commentPayload);
    return await createdComment.save();
  }

  async getAllUserComment(
    filter: CommentFilterRequest,
  ): Promise<CommentDocument[]> {
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

  async getAllUserCommentPaginated(
    filter: CommentFilterRequest,
  ): Promise<PaginateResult<CommentDocument>> {
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

  async getCurrentUserComment(
    userId: string,
    filter: AdminCommentFilterRequest,
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
    filter: AdminCommentFilterRequest,
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
    const result = await this.commentModel.findOne(filterQuery);
    if (!result) {
      throw new NotFoundException(`Comment not found`);
    }
    return result;
  }

  async findCommentById(id: string): Promise<CommentDocument> {
    const result = await this.commentModel.aggregate([
      {
        $match: { _id: new Types.ObjectId(id) },
      },
      ...lookupParrentComment,
      ...lookupUser,
      ...lookupCampaign,
      ...lookupProject,
      ...lookupItem,
    ]);
    if (!result) {
      throw new NotFoundException(`Comment with id ${id} not found`);
    }
    return result[0];
  }
}
