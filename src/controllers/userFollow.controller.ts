import { Request, Response } from 'express';
import { UserFollowService } from '../services/userFollow.service'; // adjust path if needed

export class UserFollow {
  private followService = new UserFollowService();

  // Create a follow
  async createFollow(req: Request, res: Response) {
    try {
      const { followerId, followedId } = req.body;
      const newFollow = await this.followService.createFollow(followerId, followedId);
      res.status(201).json(newFollow);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating follow', error: error.message });
    }
  }

  // Get followers of a user
  async getUserFollowById(req: Request, res: Response) {
    try {
      const followerId = parseInt(req.params.followerId);
      const followeredId = parseInt(req.params.followeredId);

      const followers = await this.followService.findUserFollowById(followerId, followeredId);
      if (!followers) {
        return res.status(404).json({ message: 'followers not found' });
      }
      res.json(followers);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching followers', error: error.message });
    }
  }

  // Get following users of a user
  async getAllUserFollow(req: Request, res: Response) {
    try {
      const following = await this.followService.findAllUserFollow();
      res.json(following);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching following', error: error.message });
    }
  }

  // Update follow relation
  async updateFollow(req: Request, res: Response) {
    try {
      const followerId = parseInt(req.params.followerId);
      const followeredId = parseInt(req.params.followeredId);
      const updates = req.body;

      const updatedFollow = await this.followService.updateFollow(
        followerId,
        followeredId,
        updates
      );

      if (!updatedFollow) {
        return res.status(404).json({ message: 'Follow relation not found' });
      }
      res.json(updatedFollow);
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating follow relation', error: error.message });
    }
  }

  // Delete follow relation
  async deleteFollow(req: Request, res: Response) {
    try {
      const followerId = Number(req.params.followerId);
      const followeredId = Number(req.params.followeredId);

      await this.followService.deleteFollow(followerId, followeredId);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting follow relation', error: error.message });
    }
  }
}
