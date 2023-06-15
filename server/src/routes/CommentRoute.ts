import express from 'express';
import { createComment, deleteComment, getCommentsByPostId } from '../controllers/CommentController';
import { trimValuesInObject } from '../utils/trimValuesInObject';
import { getPostById } from '../controllers/PostController';
import { getOwner } from '../controllers/OwnerController';

const router = express.Router();

export { router as CommentRouter };

// POST /posts/{postId}/comments: Add a comment to a specific post.
router.post('/:postId/comments', async (req, res) => {
    const { text, ownerId } = req.body;
    const authId = req.auth.payload.sub;
    req.body = trimValuesInObject(req.body);
    const { postId } = req.params;

    let owner;
    try {
        owner = await getOwner(authId);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    if (!owner) {
        res.sendStatus(404);
        return;
    }

    let post;
    try {
        post = await getPostById(postId);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    if (!post) {
        res.sendStatus(404);
        return;
    }

    if (!text) {
        res.sendStatus(400);
        return;
    }

    let newComment;
    try {
        newComment = await createComment({ text, postId, ownerId });
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    res.status(201).send(newComment);
});

// GET /posts/{postId}/comments: Retrieve all comments for a specific post.
router.get('/:postId/comments', async (req, res) => {
    const { postId } = req.params;
    
    if (!postId) {
        res.sendStatus(400);
        return;
    }

    let post;
    try {
        post = await getPostById(postId);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    if (!post) {
        res.sendStatus(404);
        return;
    }

    let comments;
    try {
        comments = await getCommentsByPostId(postId);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    res.send(comments);
});

// DELETE /posts/{postId}/comments/{commentId}: Delete a specific comment.
router.delete('/:postId/comments/:commentId', async (req, res) => {
    const { commentId } = req.params;
    
    if (!commentId) {
        res.sendStatus(400);
        return;
    }

    let deleted;
    try {
        deleted = await deleteComment(commentId);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    if (!deleted) {
        res.sendStatus(404);
        return;
    }

    res.sendStatus(200);
});
