import express from 'express';
import { createLike, deleteLike } from '../controllers/LikeController';

const router = express.Router();

export { router as LikeRouter };

// POST /{postId}/likes: Add a like to a specific post.
router.post('/:postId/likes', async (req, res) => {
    const { postId, ownerId } = req.body;
    
    if (!postId || !ownerId) {
        res.sendStatus(400);
        return;
    }

    let newLike;
    try {
        newLike = await createLike({ postId, ownerId });
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    res.status(201).send(newLike);
});

// DELETE /{postId}/likes/{likeId}: Remove a like from a specific post.
router.delete('/:postId/likes/:likeId', async (req, res) => {
    const { likeId } = req.params;

    try {
        await deleteLike(likeId);
    } catch (e) {
        console.error(e);
        res.sendStatus(400);
        return;
    }

    res.send({ message: 'Like successfully deleted' });
});
