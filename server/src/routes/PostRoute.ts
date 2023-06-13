import express from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByPetId } from '../controllers/PostController';
import { trimValuesInObject } from '../utils/trimValuesInObject';
import { getPetById } from '../controllers/PetController';

const router = express.Router();

export { router as PostRouter };

// POST /posts: Create a new post with media and initial description. 
router.post('/create', async (req, res) => {
    let pet;
    try {
        pet = await getPetById(req.body.petId);
    } catch (e) {
        console.error(e);
        res.status(e.status || 400).send(e.message);
        return;
    }

    if (!pet) {
        res.status(404).send({ message: 'Pet does not exist' });
        return;
    }

    if (!req.body.media) {
        res.status(400).send({ message: 'Media missing' });
        return;
    }

    try {
        const { petId, description, media } = req.body;
        const newPost = await createPost({ petId, description, media });
        res.status(201).send(newPost);
    } catch (e) {
        console.error(e);
        res.status(e.status || 400).send(e.message);
        return;
    }
});

// GET /posts: Retrieve all posts. 
router.get('/', async (req, res) => {
  const posts = await getAllPosts();
  res.send(posts);
});

// GET /posts/{postId}: Retrieve a specific post by its ID.
router.get('/:postId', async (req, res) => {
    let post;
    try {
        const { postId } = req.params;
        post = await getPostById(postId);
    } catch (e) {
        console.error(e);
        res.status(e.status || 400).send(e.message);
        return;
    }

    if (!post) {
        res.status(404).send({ message: 'Post not found' });
        return;
    }
    res.send(post);
});

// PATCH /posts/{postId}: Update a specific post, such as editing the description.
router.patch('/:postId', async (req, res) => {
    let updatedPost;
    try {
        const { postId } = req.params;
        req.body = trimValuesInObject(req.body);
        const { description } = req.body;
        updatedPost = await updatePost(postId, { description });
    } catch (e) {
        console.error(e);
        res.status(e.status || 400).send(e.message);
        return;
    }

    if (!updatedPost) {
        res.status(404).send({ message: 'Post not found' });
        return;
    }
    res.send(updatedPost);
});

// DELETE /posts/{postId}: Delete a specific post.
router.delete('/:postId', async (req, res) => {
    let deleted;
    try {
        const { postId } = req.params;
        deleted = await deletePost(postId);
    } catch (e) {
        console.error(e);
        res.status(e.status || 400).send(e.message);
        return;
    }

    if (!deleted) {
        res.status(404).send({ message: 'Post not found' });
        return;
    }
    res.send({ message: 'Post successfully deleted' });
});
  

// GET /posts/pet/{petId}: Retrieve all posts from a specific pet by its ID.
router.get('/pet/:petId', async (req, res) => {
    let posts;
    try {
        const { petId } = req.params;
        posts = await getPostsByPetId(petId);
    } catch (e) {
        console.error(e);
        res.status(e.status || 400).send(e.message);
        return;
    }
    res.send(posts);
});
