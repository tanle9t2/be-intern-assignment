import { ActivityType } from '../entities/ActivityLog';
import { Post } from '../entities/Post';
import { User } from '../entities/User';

// Pagination interface for paginated responses
export interface Pagination {
  total: number;
  page: number;
  size: number;
  totalPages: number;
}
export interface ActivityLogResponse {
  id: number;
  activityType: ActivityType;
  target: Post | User | null;
  createdAt: Date;
}

// Standard response structure used across the application
export interface StandardResponse<T> {
  status: 'success' | 'error'; // Status can be 'success' or 'error'
  data: T | null; // Data returned by the API, or null in case of an error
  message: string; // Message about the response, could be error or success message
  pagination?: Pagination; // Optional pagination metadata
}
