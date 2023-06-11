import express from 'express';
import {  } from '../controllers/PostController';
import { trimValuesInObject } from '../utils/trimValuesInObject';

const router = express.Router();

export { router as PostRouter };

// Post Endpoints
// TODO: POST /posts: Create a new post with media and initial description. 
// TODO: GET /posts: Retrieve all posts. 
// TODO: GET /posts/{postId}: Retrieve a specific post by its ID.
// TODO: PATCH /posts/{postId}: Update a specific post, such as editing the description. // change description!!!
// TODO: DELETE /posts/{postId}: Delete a specific post.
// TODO: GET /posts/{petId}: Retrieve all posts from a specific pet by its ID.