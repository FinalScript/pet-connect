import express from 'express';
import { createLike, deleteLike } from '../controllers/LikeController';
import { trimValuesInObject } from '../utils/trimValuesInObject';

const router = express.Router();

export { router as LikeRouter };

// Like Endpoints
// TODO: POST /posts/{postId}/likes: Add a like to a specific post.
router.post('/posts/likes', async (req, res) => {
  const { postId, ownerId } = req.body;

  if (!postId) {
    res.status(400).send({ message: 'Post Id missing' });
    return;
  }

  if (!ownerId) {
    res.status(400).send({ message: 'Owner Id missing' });
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

  res.status(201).send({ message: 'Like created' });
});

// TODO: DELETE /posts/{postId}/likes/{likeId}: Remove a like from a specific post.
router.delete('/posts/:postId/likes/:likeId', async (req, res) => {
  let deletedComment;

  try {
    const likeId = req.params.likeId;
    console.log(likeId)
    deletedComment = await deleteLike(likeId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send({ message: 'Like successfully deleted' });
});
