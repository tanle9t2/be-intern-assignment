import { Request, Response } from 'express';
import { PostService } from '../services/post.service'; // adjust the path if needed
import { standardResponse } from '../helpers/response.helper'; // Ensure standardResponse helper is imported

export class PostController {
  private postService = new PostService();

  // Get Feed
  async getFeed(req: Request, res: Response) {
    try {
      const userId = req.user.id; // ✅ we can now access user.id safely

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, pagination } = await this.postService.findFeed(userId, page, limit);

      const response = standardResponse(
        'success',
        data,
        'Feed fetched successfully',
        pagination // Include pagination metadata
      );

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching feed');
      res.status(500).json(response);
    }
  }

  // Get posts by tag
  async getPostByTag(req: Request, res: Response) {
    try {
      const tag = req.params.tag;
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
      const response = standardResponse(
        'error',
        null,
        error.message || 'Error fetching posts by tag'
      );
      res.status(500).json(response);
    }
  }

  // Create a new post
  async createPost(req: Request, res: Response) {
    try {
      const { userId, content } = req.body;
      const newPost = await this.postService.createPost(userId, content);

      const response = standardResponse('success', newPost, 'Post created successfully');

      res.status(201).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error creating post');
      res.status(500).json(response);
    }
  }

  // Get all posts
  async getAllPosts(req: Request, res: Response) {
    try {
      const posts = await this.postService.findAllPosts();

      const response = standardResponse('success', posts, 'Posts fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching posts');
      res.status(500).json(response);
    }
  }

  // Get a single post by ID
  async getPostById(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const post = await this.postService.findPostById(postId);

      if (!post) {
        const response = standardResponse('error', null, 'Post not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', post, 'Post fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching post');
      res.status(500).json(response);
    }
  }

  // Update a post
  async updatePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      const updates = req.body;
      const updatedPost = await this.postService.updatePost(postId, updates);

      if (!updatedPost) {
        const response = standardResponse('error', null, 'Post not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', updatedPost, 'Post updated successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error updating post');
      res.status(500).json(response);
    }
  }

  // Delete a post
  async deletePost(req: Request, res: Response) {
    try {
      const postId = parseInt(req.params.id);
      await this.postService.deletePost(postId);

      const response = standardResponse('success', null, 'Post deleted successfully');

      res.status(204).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error deleting post');
      res.status(500).json(response);
    }
  }
}
