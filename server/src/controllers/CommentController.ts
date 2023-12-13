import { Comment, CommentCreationAttributes } from '../models/Comment';
import { Owner } from '../models/Owner';
import { ProfilePicture } from '../models/ProfilePicture';

export const createComment = async (comment: CommentCreationAttributes) => {
  const newComment = await Comment.create(comment, {
    include: [{ model: Owner, as: 'author', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }],
  });

  return newComment;
};

export const getCommentsByPostId = async (postId: string) => {
  const comments = await Comment.findAll({
    where: {
      postId,
    },
    include: [{ model: Owner, as: 'author', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }],
    order: [['dateCreated', 'DESC']],
  });
  return comments;
};

export const getCommentById = async (id: string) => {
  const comment = await Comment.findOne({
    where: {
      id,
    },
    include: [{ model: Owner, as: 'author', include: [{ model: ProfilePicture, as: 'ProfilePicture' }] }],
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
