import { StandardResponse, Pagination } from '../interface/response.interface';

/**
 * Helper function to generate standard response
 * @param status - 'success' or 'error'
 * @param data - The data returned by the API (could be null if error)
 * @param message - The message to be returned (could be error or success message)
 * @param pagination - Optional pagination metadata (if applicable)
 */
export const standardResponse = <T>(
  status: 'success' | 'error',
  data: T | null,
  message: string,
  pagination?: Pagination
): StandardResponse<T> => {
  return {
    status,
    data,
    message,
    pagination,
  };
};
