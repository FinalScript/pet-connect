import express from 'express';
import { createLike, deleteLike, getLikeById } from '../controllers/LikeController';
import { getPostById } from '../controllers/PostController';

const router = express.Router();

export { router as LikeRouter };

// POST /likes:/{postId} Add a like to a specific post.
router.post('/likes/:postId', async (req, res) => {
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
  let like, post;

  try {
    like = await getLikeById(likeId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  try {
    post = await getPostById(postId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  if (!like) {
    return res.status(404).send({ message: 'Like not found' });
  }

  if (!post) {
    return res.status(404).send({ message: 'Post not found' });
  }

  try {
    await deleteLike(likeId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send({ message: 'Like successfully deleted' });
});
