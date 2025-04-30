import { Request, Response } from 'express';
import { HashtagService } from '../services/hashtag.service'; // Adjust the path if needed
import { standardResponse } from '../helpers/response.helper'; // Ensure standardResponse helper is imported

export class HashtagController {
  private hashtagService = new HashtagService();

  // Get all hashtags
  async getAllHashtags(req: Request, res: Response) {
    try {
      const hashtags = await this.hashtagService.findAllHashtags();

      const response = standardResponse('success', hashtags, 'Hashtags fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching hashtags');

      res.status(500).json(response);
    }
  }

  // Get hashtag by ID
  async getHashtagById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const hashtag = await this.hashtagService.findHashtagById(id);

      if (!hashtag) {
        const response = standardResponse('error', null, 'Hashtag not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', hashtag, 'Hashtag fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching hashtag');
      res.status(500).json(response);
    }
  }

  // Create a new hashtag
  async createHashtag(req: Request, res: Response) {
    try {
      const { tagName } = req.body;
      const newHashtag = await this.hashtagService.createHashtag(tagName);

      const response = standardResponse('success', newHashtag, 'Hashtag created successfully');

      res.status(201).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error creating hashtag');

      res.status(500).json(response);
    }
  }

  // Update a hashtag
  async updateHashtag(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedHashtag = await this.hashtagService.updateHashtag(id, updates);

      if (!updatedHashtag) {
        const response = standardResponse('error', null, 'Hashtag not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', updatedHashtag, 'Hashtag updated successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error updating hashtag');

      res.status(500).json(response);
    }
  }

  // Delete a hashtag
  async deleteHashtag(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.hashtagService.deleteHashtag(id);

      const response = standardResponse('success', null, 'Hashtag deleted successfully');

      res.status(204).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error deleting hashtag');

      res.status(500).json(response);
    }
  }
}
