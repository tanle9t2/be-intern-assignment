import { Request, Response } from 'express';
import { HashtagService } from '../services/hashtag.service'; // Adjust the path if needed

export class HashtagController {
  private hashtagService = new HashtagService();

  async getAllHashtags(req: Request, res: Response) {
    try {
      console.log('pl');
      const hashtags = await this.hashtagService.findAllHashtags();
      console.log(hashtags);
      res.json(hashtags);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching hashtags', error: error.message });
    }
  }

  async getHashtagById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const hashtag = await this.hashtagService.findHashtagById(id);
      if (!hashtag) {
        return res.status(404).json({ message: 'Hashtag not found' });
      }
      res.json(hashtag);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching hashtag', error: error.message });
    }
  }

  async createHashtag(req: Request, res: Response) {
    try {
      const { tagName } = req.body;
      const newHashtag = await this.hashtagService.createHashtag(tagName);
      res.status(201).json(newHashtag);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating hashtag', error: error.message });
    }
  }

  async updateHashtag(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedHashtag = await this.hashtagService.updateHashtag(id, updates);
      if (!updatedHashtag) {
        return res.status(404).json({ message: 'Hashtag not found' });
      }
      res.json(updatedHashtag);
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating hashtag', error: error.message });
    }
  }

  async deleteHashtag(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.hashtagService.deleteHashtag(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting hashtag', error: error.message });
    }
  }
}
