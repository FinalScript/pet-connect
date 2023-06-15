import express from 'express';
import { createLike, deleteLike, getLikeById } from '../controllers/LikeController';
import { getPostById } from '../controllers/PostController';

const router = express.Router();

export { router as LikeRouter };

// POST /{postId}/likes: Add a like to a specific post.
router.post('/:postId/likes', async (req, res) => {
  const { ownerId } = req.body;
  const { postId } = req.params;

  if (!postId) {
    res.status(400).send({ message: 'Please provide postId' });
    return;
  }

  if (!ownerId) {
    res.status(400).send({ message: 'Please provide ownerId' });
    return;
  }

  try {
    const newLike = await createLike({ postId, ownerId });
    res.status(201).send(newLike);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }
});

// DELETE /{postId}/likes/{likeId}: Remove a like from a specific post.
router.delete('/:postId/likes/:likeId', async (req, res) => {
  const { likeId, postId } = req.params;

  const like = await getLikeById(likeId);
  const post = await getPostById(postId);

  if (!like) {
    return res.status(404).send({ message: 'Like not found' });
  }

  if (!post) {
    return res.status(404).send({ message: 'Post not found' });
  }

  try {
    const deleted = await deleteLike(likeId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send({ message: 'Like successfully deleted' });
});
