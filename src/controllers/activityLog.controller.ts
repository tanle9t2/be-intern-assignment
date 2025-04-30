import { Request, Response } from 'express';
import { ActivityLogService } from '../services/activityLog.service'; // Assuming you placed the service here
import { ActivityType } from '../entities/ActivityLog';

export class ActivityLogController {
  private activityLogService = new ActivityLogService();

  async getAllActivities(req: Request, res: Response) {
    try {
      const activities = await this.activityLogService.findAllActivities();
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching activities', error: error.message });
    }
  }

  async getActivityById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const activity = await this.activityLogService.findActivityById(id);
      if (!activity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.json(activity);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching activity', error: error.message });
    }
  }

  async getActivitiesByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const activities = await this.activityLogService.findActivitiesByUser(userId);
      res.json(activities);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching activities for user', error: error.message });
    }
  }

  async createActivity(req: Request, res: Response) {
    try {
      const { userId, activityType, targetId } = req.body;
      const activity = await this.activityLogService.createActivityLog(
        userId,
        activityType as ActivityType,
        targetId
      );
      res.status(201).json(activity);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating activity', error: error.message });
    }
  }

  async updateActivity(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedActivity = await this.activityLogService.updateActivity(id, updates);
      if (!updatedActivity) {
        return res.status(404).json({ message: 'Activity not found' });
      }
      res.json(updatedActivity);
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating activity', error: error.message });
    }
  }

  async deleteActivity(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.activityLogService.deleteActivity(id);
      res.status(204).send();
    } catch (error: any) {
      res.status(500).json({ message: 'Error deleting activity', error: error.message });
    }
  }
}
