import { Media } from '../models/Media';
import { Pet } from '../models/Pet';
import { Post, PostCreationAttributes, PostAttributes } from '../models/Post';
import { ProfilePicture } from '../models/ProfilePicture';

export const createPost = async (data: PostCreationAttributes) => {
  const newPost = await Post.create(data, {
    include: [
      {
        model: Media,
        as: 'Media',
      },
    ],
  });
  return newPost;
};

export const getAllPosts = async () => {
  const posts = await Post.findAll({
    order: [['dateCreated', 'DESC']],
    include: [
      {
        model: Media,
        as: 'Media',
      },
      {
        model: Pet,
        as: 'author',
        include: [{ all: true }],
      },
    ],
  });

  return posts;
};

export const getPostById = async (id: string) => {
  const post = await Post.findByPk(id, {
    include: [
      {
        model: Media,
        as: 'Media',
      },
    ],
  });
  return post;
};

export const updatePost = async (id: string, data: Partial<PostAttributes>) => {
  const post = await getPostById(id);
  if (post) {
    const updatedPost = await post.update(data);
    return updatedPost;
  }
  return null;
};

export const deletePost = async (id: string) => {
  const post = await getPostById(id);
  if (post) {
    await post.destroy();
    return true;
  }
  return false;
};

export const getPostsByPetId = async (petId: string) => {
  const posts = await Post.findAll({
    where: { petId },
    include: [
      {
        model: Media,
        as: 'Media',
      },
    ],
  });
  return posts;
};
