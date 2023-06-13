import express from 'express';
import { createPost, getAllPosts, getPostById, updatePost, deletePost, getPostsByPetId } from '../controllers/PostController';
import { trimValuesInObject } from '../utils/trimValuesInObject';
import { getPetById } from '../controllers/PetController';

const router = express.Router();

export { router as PostRouter };

// POST /posts: Create a new post with media and initial description. 
router.post('/create', async (req, res) => {
    const pet = await getPetById(req.body.petId);

    if (!pet) {
        res.status(404).send({ message: 'Pet does not exist' });
        return;
    }
    
    if (!req.body.media) {
        res.status(400).send({ message: 'Media missing' });
        return;
    }

  const { petId, description, media } = req.body;
  const newPost = await createPost({ petId, description, media });
  res.status(201).send(newPost);
});

// GET /posts: Retrieve all posts. 
router.get('/', async (req, res) => {
  const posts = await getAllPosts();
  res.send(posts);
});

// GET /posts/{postId}: Retrieve a specific post by its ID.
router.get('/:postId', async (req, res) => {
  const { postId } = req.params;
  const post = await getPostById(postId);
  if (!post) {
    res.status(404).send({ message: 'Post not found' });
    return;
  }
  res.send(post);
});

// PATCH /posts/{postId}: Update a specific post, such as editing the description.
router.patch('/:postId', async (req, res) => {
  const { postId } = req.params;
  req.body = trimValuesInObject(req.body);
  const { description } = req.body;
  const updatedPost = await updatePost(postId, { description });
  if (!updatedPost) {
    res.status(404).send({ message: 'Post not found' });
    return;
  }
  res.send(updatedPost);
});

// DELETE /posts/{postId}: Delete a specific post.
router.delete('/:postId', async (req, res) => {
    const { postId } = req.params;
    const deleted = await deletePost(postId);
    if (!deleted) {
      res.status(404).send({ message: 'Post not found' });
      return;
    }
    res.send({ message: 'Post successfully deleted' });
  });
  

// GET /posts/pet/{petId}: Retrieve all posts from a specific pet by its ID.
router.get('/pet/:petId', async (req, res) => {
  const { petId } = req.params;
  const posts = await getPostsByPetId(petId);
  res.send(posts);
});
