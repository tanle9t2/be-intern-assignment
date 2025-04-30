import { Request, Response } from 'express';
import { UserFollowService } from '../services/userFollow.service'; // Adjust path if needed
import { standardResponse } from '../helpers/response.helper'; // Ensure standardResponse helper is imported

export class UserFollow {
  private followService = new UserFollowService();

  // Create a follow
  async createFollow(req: Request, res: Response) {
    try {
      const { followerId, followedId } = req.body;
      const newFollow = await this.followService.createFollow(followerId, followedId);

      const response = standardResponse('success', newFollow, 'Follow created successfully');

      res.status(201).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error creating follow');

      res.status(500).json(response);
    }
  }

  // Get followers of a user
  async getUserFollowById(req: Request, res: Response) {
    try {
      const followerId = parseInt(req.params.followerId);
      const followedId = parseInt(req.params.followedId);

      const followers = await this.followService.findUserFollowById(followerId, followedId);
      if (!followers) {
        const response = standardResponse('error', null, 'Followers not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', followers, 'Followers fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching followers');

      res.status(500).json(response);
    }
  }

  // Get all following users of a user
  async getAllUserFollow(req: Request, res: Response) {
    try {
      const following = await this.followService.findAllUserFollow();

      const response = standardResponse('success', following, 'Following fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching following');

      res.status(500).json(response);
    }
  }

  // Update follow relation
  async updateFollow(req: Request, res: Response) {
    try {
      const followerId = parseInt(req.params.followerId);
      const followedId = parseInt(req.params.followedId);
      const updates = req.body;

      const updatedFollow = await this.followService.updateFollow(followerId, followedId, updates);

      if (!updatedFollow) {
        const response = standardResponse('error', null, 'Follow relation not found');
        return res.status(404).json(response);
      }

      const response = standardResponse(
        'success',
        updatedFollow,
        'Follow relation updated successfully'
      );

      res.json(response);
    } catch (error: any) {
      const response = standardResponse(
        'error',
        null,
        error.message || 'Error updating follow relation'
      );

      res.status(500).json(response);
    }
  }

  // Delete follow relation
  async deleteFollow(req: Request, res: Response) {
    try {
      const followerId = Number(req.params.followerId);
      const followedId = Number(req.params.followedId);

      await this.followService.deleteFollow(followerId, followedId);

      const response = standardResponse('success', null, 'Follow relation deleted successfully');

      res.status(204).json(response);
    } catch (error: any) {
      const response = standardResponse(
        'error',
        null,
        error.message || 'Error deleting follow relation'
      );

      res.status(500).json(response);
    }
  }
}
