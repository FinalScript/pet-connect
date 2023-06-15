import express from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByPetId } from '../controllers/PostController';
import { trimValuesInObject } from '../utils/trimValuesInObject';
import { getPetById } from '../controllers/PetController';

const router = express.Router();

export { router as PostRouter };

// POST /posts: Create a new post with media and initial description.
router.post('/create', async (req, res) => {
  const { petId, description, media } = req.body;

  if (!petId) {
    res.status(400).send({ message: 'Please provide petId' });
    return;
  }

  let pet;

  try {
    pet = await getPetById(petId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  if (!pet) {
    res.status(404).send({ message: 'Pet does not exist' });
    return;
  }

  if (!media) {
    res.status(400).send({ message: 'Media missing' });
    return;
  }

  try {
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
  try {
    const posts = await getAllPosts();
    res.send(posts);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
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
router.patch('/update/:postId', async (req, res) => {
  let updatedPost;
  const { postId } = req.params;
  req.body = trimValuesInObject(req.body);
  const { description, media, petId } = req.body;

  if (petId) {
    res.status(400).send({ message: 'Changing petId is not allowed' });
    return;
  }

  if (!media) {
    res.status(400).send({ message: 'Media cannot be null' });
    return;
  }

  try {
    updatedPost = await updatePost(postId, { description, media });
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
router.delete('/delete/:postId', async (req, res) => {
  const { postId } = req.params;
  const postExists = await getPostById(postId);

  if (!postExists) {
    res.status(404).send({ message: 'Post not found' });
    return;
  }

  let deleted;
  try {
    deleted = await deletePost(postId);
  } catch (e) {
    console.error(e);
    res.status(e.status || 400).send(e.message);
    return;
  }

  res.send({ message: 'Post successfully deleted' });
});

// GET /posts/pet/{petId}: Retrieve all posts from a specific pet by its ID.
router.get('/pet/:petId', async (req, res) => {
  try {
    const posts = await getPostsByPetId(req.params.petId);
    res.send(posts);
  } catch (e) {
    console.error(e);
    res.sendStatus(400);
  }
});
