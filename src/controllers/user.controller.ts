import { Request, Response } from 'express';
import { User } from '../entities/User';
import { AppDataSource } from '../data-source';
import { UserFollowService } from '../services/userFollow.service'; // adjust path if needed
import { standardResponse } from '../helpers/response.helper';
import { ActivityLogService } from '../services/activityLog.service';
import { ActivityType } from '../entities/ActivityLog';

export class UserController {
  private userRepository = AppDataSource.getRepository(User);
  private activityLogService = new ActivityLogService();
  private followService = new UserFollowService();

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
      // Construct the response with the paginated data
      const response = standardResponse(
        'success',
        data,
        'Followers fetched successfully',
        pagination // Include pagination metadata
      );

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching followers', error: error.message });
    }
  }

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
      // Construct the response with the paginated data
      const response = standardResponse(
        'success',
        data,
        'Followers fetched successfully',
        pagination // Include pagination metadata
      );

      res.json(response);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching followers', error: error.message });
    }
  }

  async getAllUsers(req: Request, res: Response) {
    try {
      const users = await this.userRepository.find();
      res.json(users);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
  }

  async getUserById(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      res.json(user);
    } catch (error: any) {
      res.status(500).json({ message: 'Error fetching user', error: error.message });
    }
  }

  async createUser(req: Request, res: Response) {
    try {
      const user = this.userRepository.create(req.body);
      const result = await this.userRepository.save(user);
      res.status(201).json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Error creating user', error: error.message });
    }
  }

  async updateUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOneBy({
        id: parseInt(req.params.id),
      });
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }
      this.userRepository.merge(user, req.body);
      const result = await this.userRepository.save(user);
      res.json(result);
    } catch (error: any) {
      res.status(500).json({ message: 'Error updating user', error: error.message });
    }
  }

  async deleteUser(req: Request, res: Response) {
    try {
      const user = await this.userRepository.findOne({
        where: { id: parseInt(req.params.id) },
        relations: ['following', 'followers', 'posts'],
      });

      console.log(user);
      if (!user) {
        return res.status(404).json({ message: 'User not found' });
      }

      // Using the remove method
      await this.userRepository.remove(user);
      res.status(204).send(); // Successful deletion
    } catch (error: any) {
      // Send the error message to the client
      res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
  }
}
