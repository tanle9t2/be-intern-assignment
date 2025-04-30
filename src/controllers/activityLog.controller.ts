import { Request, Response } from 'express';
import { ActivityLogService } from '../services/activityLog.service'; // Adjust the path if needed
import { ActivityType } from '../entities/ActivityLog';
import { standardResponse } from '../helpers/response.helper'; // Ensure standardResponse helper is imported

export class ActivityLogController {
  private activityLogService = new ActivityLogService();

  // Get all activities
  async getAllActivities(req: Request, res: Response) {
    try {
      const activities = await this.activityLogService.findAllActivities();

      const response = standardResponse('success', activities, 'Activities fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse(
        'error',
        null,
        error.message || 'Error fetching activities'
      );

      res.status(500).json(response);
    }
  }

  // Get activity by ID
  async getActivityById(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const activity = await this.activityLogService.findActivityById(id);

      if (!activity) {
        const response = standardResponse('error', null, 'Activity not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', activity, 'Activity fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching activity');
      res.status(500).json(response);
    }
  }

  // Get activities by user ID
  async getActivitiesByUser(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.userId);
      const activities = await this.activityLogService.findActivitiesByUser(userId);

      const response = standardResponse(
        'success',
        activities,
        'Activities for user fetched successfully'
      );

      res.json(response);
    } catch (error: any) {
      const response = standardResponse(
        'error',
        null,
        error.message || 'Error fetching activities for user'
      );

      res.status(500).json(response);
    }
  }

  // Create a new activity log
  async createActivity(req: Request, res: Response) {
    try {
      const { userId, activityType, targetId } = req.body;
      const activity = await this.activityLogService.createActivityLog(
        userId,
        activityType as ActivityType,
        targetId
      );

      const response = standardResponse('success', activity, 'Activity created successfully');

      res.status(201).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error creating activity');

      res.status(500).json(response);
    }
  }

  // Update an existing activity log
  async updateActivity(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      const updates = req.body;
      const updatedActivity = await this.activityLogService.updateActivity(id, updates);

      if (!updatedActivity) {
        const response = standardResponse('error', null, 'Activity not found');
        return res.status(404).json(response);
      }

      const response = standardResponse(
        'success',
        updatedActivity,
        'Activity updated successfully'
      );

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error updating activity');

      res.status(500).json(response);
    }
  }

  // Delete an activity log
  async deleteActivity(req: Request, res: Response) {
    try {
      const id = parseInt(req.params.id);
      await this.activityLogService.deleteActivity(id);

      const response = standardResponse('success', null, 'Activity deleted successfully');

      res.status(204).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error deleting activity');

      res.status(500).json(response);
    }
  }
}
