import { Post, PostCreationAttributes } from '../models/Post';

export const createPost = async (data: PostCreationAttributes) => {
  const newPost = await Post.create(data);

  return newPost;
};

export const getAllPosts = async () => {
  const posts = await Post.findAll({
    order: [['createdAt', 'DESC']],
  });

  return posts;
};

export const getPostById = async (id: string) => {
  const post = await Post.findByPk(id);

  return post;
};

export const getPostByIdWithLikers = async (id: string) => {
  const post = await Post.findByPk(id, {
    include: [{ association: 'Likes' }],
  });
  return post;
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
    order: [['createdAt', 'DESC']],
  });

  return posts;
};
