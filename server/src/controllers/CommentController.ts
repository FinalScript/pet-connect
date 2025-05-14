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
    order: [['dateCreated', 'DESC']],
  });
  return comments;
};

export const getCommentById = async (id: string) => {
  const comment = await Comment.findOne({
    where: {
      id,
    },
  });
  return comment;
};

export const deleteComment = async (id: string) => {
  await Comment.destroy({
    where: {
      id,
    },
    force: true,
  });

  return false;
};
