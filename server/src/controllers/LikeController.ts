import { Like, LikeCreationAttributes } from '../models/Like';

export const createLike = async (like: LikeCreationAttributes) => {
  const newLike = await Like.create(like);
  return newLike;
};

export const getLikeById = async (id: string) => {
  const like = await Like.findOne({
    where: {
      id,
    },
  });
  return like;
};

export const deleteLike = async (id: string) => {
  await Like.destroy({
    where: {
      id,
    },
    force: true,
  });

  return false;
};
