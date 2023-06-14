import { Owner } from '../models/Owner';
import { Pet } from '../models/Pet';
import { Post } from '../models/Post';
import { Comment, CommentCreationAttributes } from '../models/Comment';

export const createComment = async (comment: CommentCreationAttributes) => {
  const newComment = await Comment.create(comment);
  return newComment;
};

export const getCommentsByPostId = async (postId: string) => {
  const comments = await Comment.findAll({
    where: {
      postId,
    },
  });
  return comments;
};

export const deleteComment = async (id: string): Promise<boolean> => {
  await Comment.destroy({
    where: {
      id,
    },
    force: true,
  });

  return false;
};
