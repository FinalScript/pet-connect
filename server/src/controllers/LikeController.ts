import { Owner } from '../models/Owner';
import { Pet } from '../models/Pet';
import { Post } from '../models/Post';
import { Like, LikeCreationAttributes } from '../models/Like';

export const createLike = async (like: LikeCreationAttributes) => {
  const newLike = await Like.create(like);
  return newLike;
};

export const deleteLike = async (id: string): Promise<boolean> => {
  await Like.destroy({
    where: {
      id,
    },
    force: true,
  });

  return false;
};
