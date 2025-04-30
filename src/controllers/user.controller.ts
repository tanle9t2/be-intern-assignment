import { Request, Response } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { UserFollowService } from '../services/userFollow.service'; // Adjust path if needed
import { standardResponse } from '../helpers/response.helper';
import { ActivityLogService } from '../services/activityLog.service';
import { ActivityType } from '../entities/ActivityLog';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private activityLogService = new ActivityLogService();
  private followService = new UserFollowService();

  // Get activities of a user
  async getActivities(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const startDate = req.query.startDate ? new Date(req.query.startDate as string) : undefined;
      const endDate = req.query.endDate ? new Date(req.query.endDate as string) : undefined;

      const activityType = req.query.activityType as ActivityType;

      const { data, pagination } = await this.activityLogService.findActivitiesByUser(
        userId,
        activityType,
        startDate,
        endDate,
        page,
        limit
      );

      const response = standardResponse(
        'success',
        data,
        'Activities fetched successfully',
        pagination // Include pagination metadata
      );

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

  // Get followers of a user
  async getFollowers(req: Request, res: Response) {
    try {
      const userId = parseInt(req.params.id);

      const page = parseInt(req.query.page as string) || 1;
      const limit = parseInt(req.query.limit as string) || 10;

      const { data, pagination } = await this.followService.findFollowersWithPagination(
        userId,
        page,
        limit
      );

      const response = standardResponse(
        'success',
        data,
        'Followers fetched successfully',
        pagination // Include pagination metadata
      );

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching followers');

      res.status(500).json(response);
    }
  }

  // Get all users
  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();

      const response = standardResponse('success', users, 'Users fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching users');

      res.status(500).json(response);
    }
  }

  // Get user by ID
  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });

      if (!user) {
        const response = standardResponse('error', null, 'User not found');
        return res.status(404).json(response);
      }

      const response = standardResponse('success', user, 'User fetched successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error fetching user');

      res.status(500).json(response);
    }
  }

  // Create a user
  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);

      const response = standardResponse('success', result, 'User created successfully');

      res.status(201).json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error creating user');

      res.status(500).json(response);
    }
  }

  // Update user
  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });

      if (!user) {
        const response = standardResponse('error', null, 'User not found');
        return res.status(404).json(response);
      }

      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);

      const response = standardResponse('success', result, 'User updated successfully');

      res.json(response);
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error updating user');

      res.status(500).json(response);
    }
  }

  // Delete user
  async deleteUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['following', 'followers', 'posts'],
      });

      if (!user) {
        const response = standardResponse('error', null, 'User not found');
        return res.status(404).json(response);
      }

      // Using the remove method
      await this.userRepository.remove(user);

      const response = standardResponse('success', null, 'User deleted successfully');

      res.status(204).json(response); // Successful deletion
    } catch (error: any) {
      const response = standardResponse('error', null, error.message || 'Error deleting user');

      res.status(500).json(response);
    }
  }
}
