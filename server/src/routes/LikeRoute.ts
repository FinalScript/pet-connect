import express from 'express';
import {  } from '../controllers/LikeController';
import { trimValuesInObject } from '../utils/trimValuesInObject';

const router = express.Router();

export { router as LikeRouter };

// Like Endpoints
// TODO: POST /posts/{postId}/likes: Add a like to a specific post.
// TODO: DELETE /posts/{postId}/likes/{likeId}: Remove a like from a specific post.
