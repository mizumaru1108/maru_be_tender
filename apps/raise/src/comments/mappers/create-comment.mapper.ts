import { CreateCommentDto } from '../dto/create-comment.dto';
import { Comment } from '../schema/comment.schema';
import { Types } from 'mongoose';

export const createCommentDtoMapper = (request: CreateCommentDto): Comment => {
  const comment = new Comment();
  if (request.campaignId) {
    comment.campaignId = new Types.ObjectId(request.campaignId);
  }
  if (request.projectId) {
    comment.projectId = new Types.ObjectId(request.projectId);
  }
  if (request.itemId) {
    comment.itemId = new Types.ObjectId(request.itemId);
  }
  if (request.parentCommentId) {
    comment.parentCommentId = new Types.ObjectId(request.parentCommentId);
  }
  comment.content = request.content ?? '';
  return comment;
};
