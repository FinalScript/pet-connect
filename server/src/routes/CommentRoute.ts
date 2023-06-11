import express from 'express';
import {  } from '../controllers/CommentController';
import { trimValuesInObject } from '../utils/trimValuesInObject';

const router = express.Router();

export { router as CommentRouter };

// Comment Endpoints
// TODO: POST /posts/{postId}/comments: Add a comment to a specific post. // body of the end point
// TODO: GET /posts/{postId}/comments: Retrieve all comments for a specific post.
// TODO: DELETE /posts/{postId}/comments/{commentId}: Delete a specific comment. //aka your comment 
