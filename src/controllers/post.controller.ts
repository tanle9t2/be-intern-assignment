import { Request, Response } from 'express';
import { PostService } from '../services/post.service'; // adjust the path if needed
import { standardResponse } from '../helpers/response.helper';

export class PostController {
  private postService = new PostService();

  async getFeed(req: Request, res: Response) {
    try {
      const userId = req.user.id; // ✅ we can now access user.id safely

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, pagination } = await this.postService.findFeed(userId, page, limit);
      const response = standardResponse(
        'success',
        data,
        'Followers fetched successfully',
        pagination // Include pagination metadata
      );

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching followers' });
    }
  }

  async getPostByTag(req: Request, res: Response) {
    try {
      const tag = req.params.tag;
      console.log(tag);
      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;
      const { data, pagination } = await this.postService.findPostsByHashtag(tag, page, limit);
      const response = standardResponse(
        'success',
        data,
        'Posts fetched successfully',
        pagination // Include pagination metadata
      );

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching post' });
    }
  }

  // Create a new post
  async createPost(req: Request, res: Response) {
    try {
      const { userId, content } = req.body;
      const newPost = await this.postService.createPost(userId, content);
      res.status(201).json(newPost);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error creating post' });
    }
  }

  // Get all posts
  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await this.postService.findAllPosts();
      res.json(posts);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching posts' });
    }
  }

  // Get a single post by ID
  async getPostById(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const post = await this.postService.findPostById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(post);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error fetching post' });
    }
  }

  // Update a post
  async updatePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const updates = req.body;
      const updatedPost = await this.postService.updatePost(postId, updates);
      if (!updatedPost) {
        return res.status(404).json({ message: 'Post not found' });
      }
      res.json(updatedPost);
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error updating post' });
    }
  }

  // Delete a post
  async deletePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      await this.postService.deletePost(postId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: error.message || 'Error deleting post' });
    }
  }
}
