import { Request, Response } from 'express';
import { LikeService } from '../services/like.service'; // Adjust path if needed
import { standardResponse } from '../helpers/response.helper'; // Ensure standardResponse helper is imported

export class LikeController {
  private likeService = new LikeService();

  // Create a like
  async createLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.body;
      const newLike = await this.likeService.createLike(userId, postId);
      const { post, ...rest } = newLike;

      const response = standardResponse('success', rest, 'Like created successfully');

      res.status(201).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error creating like');

      res.status(500).json(response);
    }
  }

  // Get all likes
  async getAllLikes(req: Request, res: Response) {
    try {
      const likes = await this.likeService.findAllLikes();

      const response = standardResponse('success', likes, 'Likes fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching likes');

      res.status(500).json(response);
    }
  }

  // Get likes by composite userId and postId
  async getLikesByCompositeId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const postId = parseInt(req.params.postId);
      const likes = await this.likeService.findLikesById(userId, postId);

      if (!likes) {
        const response = standardResponse('error', null, 'Like not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', likes, 'Like fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse(
        'error',
        null,
        error.message || 'Error fetching likes for user'
      );
      res.status(500).json(response);
    }
  }

  // Update a like
  async updateLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.params;
      const updates = req.body;

      const updatedLike = await this.likeService.updateLike(
        parseInt(userId),
        parseInt(postId),
        updates
      );

      if (!updatedLike) {
        const response = standardResponse('error', null, 'Like not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', updatedLike, 'Like updated successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error updating like');

      res.status(500).json(response);
    }
  }

  // Delete a like
  async deleteLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.params;
      await this.likeService.deleteLike(parseInt(userId), parseInt(postId));

      const response = standardResponse('success', null, 'Like deleted successfully');

      res.status(204).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error deleting like');

      res.status(500).json(response);
    }
  }
}
