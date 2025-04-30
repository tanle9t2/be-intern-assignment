import { Request, Response } from 'express';
import { LikeService } from '../services/like.service'; // Adjust path if needed

export class LikeController {
  private likeService = new LikeService();

  async createLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.body;
      const newLike = await this.likeService.createLike(userId, postId);
      const { post, ...rest } = newLike;
      res.status(201).json(rest);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating like', error: error.message });
    }
  }
  async getAllLikes(req: Request, res: Response) {
    try {
      const likes = await this.likeService.findAllLikes();
      res.json(likes);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching likes for user', error: error.message });
    }
  }

  async getLikesByCompositeId(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const postId = parseInt(req.params.postId);
      const likes = await this.likeService.findLikesById(userId, postId);
      if (!likes) {
        return res.status(404).json({ message: 'Like not found' });
      }
      res.json(likes);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching likes for user', error: error.message });
    }
  }

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
        return res.status(404).json({ message: 'Like not found' });
      }
      res.json(updatedLike);
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating like', error: error.message });
    }
  }

  async deleteLike(req: Request, res: Response) {
    try {
      const { userId, postId } = req.params;
      await this.likeService.deleteLike(parseInt(userId), parseInt(postId));
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting like', error: error.message });
    }
  }
}
