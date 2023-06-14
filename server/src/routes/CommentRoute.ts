import express from 'express';
import { createComment, deleteComment, getCommentsByPostId } from '../controllers/CommentController';
import { trimValuesInObject } from '../utils/trimValuesInObject';
import { getPostById } from '../controllers/PostController';
import { getOwner } from '../controllers/OwnerController';

const router = express.Router();

export { router as CommentRouter };

// Comment Endpoints
// TODO: POST /posts/{postId}/comments: Add a comment to a specific post. // body of the end point

router.post('/posts/:postId/comments', async (req, res) => {
  const postId = req.params.postId;
  const authId = req.auth.payload.sub;
  req.body = trimValuesInObject(req.body);
  const post = await getPostById(postId);
  const owner = await getOwner(authId);

  if (!owner) {
    res.status(404).send({ message: 'Owner does not exist' });
    return;
  }

  if (!post) {
    res.status(404).send({ message: 'Post does not exist' });
    return;
  }

  const { text } = req.body;

  if (!text) {
    res.status(400).send({ message: 'Text missing' });
    return;
  }

  try {
    const { postId, ownerId } = req.body;
    const newComment = await createComment({ text, postId, ownerId });
    res.status(201).send(newComment);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }
  res.send(post);
});

// TODO: GET /posts/{postId}/comments: Retrieve all comments for a specific post.

router.get('/posts/:postId/comments', async (req, res) => {
  const postId = req.params.postId;
  const post = await getPostById(postId);
  let comments;

  if (!postId) {
    res.status(400).send({ message: 'Post Id missing' });
    return;
  }

  if (!post) {
    res.status(404).send({ message: 'Post does not exist' });
    return;
  }

  try {
    comments = await getCommentsByPostId(postId);
    res.send(comments);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }
});

// TODO: DELETE /posts/{postId}/comments/{commentId}: Delete a specific comment. //aka your comment

router.delete('/posts/:postId/comments/:commentId', async (req, res) => {
  let deletedComment;

  try {
    const { commentId } = req.params;
    deletedComment = await deleteComment(commentId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send({ message: 'Post successfully deleted' });
});
