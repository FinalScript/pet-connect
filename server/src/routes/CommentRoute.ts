import express from 'express';
import { createComment, deleteComment, getCommentById, getCommentsByPostId } from '../controllers/CommentController';
import { trimValuesInObject } from '../utils/trimValuesInObject';
import { getPostById } from '../controllers/PostController';
import { getOwner } from '../controllers/OwnerController';

const router = express.Router();

export { router as CommentRouter };

// POST /posts/{postId}/comments: Add a comment to a specific post.
router.post('/:postId/comments', async (req, res) => {
  const { text, ownerId } = req.body;
  const { postId } = req.params;
  const authId = req.auth.payload.sub;
  req.body = trimValuesInObject(req.body);

  if (!postId) {
    res.status(400).send({ message: 'Please provide postId' });
    return;
  }

  if (!ownerId) {
    res.status(400).send({ message: 'Please provide ownerId' });
    return;
  }

  let owner;

  try {
    owner = await getOwner(authId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  if (!owner) {
    res.status(404).send({ message: 'Owner does not exist' });
    return;
  }

  let post;

  try {
    post = await getPostById(postId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  if (!post) {
    res.status(404).send({ message: 'Post does not exist' });
    return;
  }

  if (!text) {
    res.status(400).send({ message: 'Text missing' });
    return;
  }

  try {
    const newComment = await createComment({ text, postId, ownerId });
    res.status(201).send(newComment);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }
});

// GET /posts/{postId}/comments: Retrieve all comments for a specific post.
router.get('/:postId/comments', async (req, res) => {
  const { postId } = req.params;

  if (!postId) {
    res.status(400).send({ message: 'Please provide postId' });
    return;
  }

  let post;
  try {
    post = await getPostById(postId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  if (!post) {
    res.status(400).send({ message: 'Post does not exist' });
    return;
  }

  try {
    const comments = await getCommentsByPostId(postId);
    res.status(201).send(comments);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }
});

// DELETE /posts/{postId}/comments/{commentId}: Delete a specific comment.
router.delete('/:postId/comments/:commentId', async (req, res) => {
  const { postId, commentId } = req.params;

  const comment = await getCommentById(commentId);
  const post = await getPostById(postId);

  if (!comment) {
    return res.status(404).send({ message: 'Comment not found' });
  }

  if (!post) {
    return res.status(404).send({ message: 'Post not found' });
  }

  try {
    const deleted = await deleteComment(commentId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send({ message: 'Comment successfully deleted' });
});
