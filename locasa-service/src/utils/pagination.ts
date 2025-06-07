import { Request } from "express";

export interface PaginationResult<T> {
  items: T[];
  totalItems: number;
  currentPage: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

export interface PaginationOptions {
  page?: number;
  limit?: number;
}

export const getPaginationOptions = (req: Request): PaginationOptions => {
  const page = Math.max(1, parseInt(req.query.page as string) || 1);
  const limit = Math.min(
    100,
    Math.max(1, parseInt(req.query.limit as string) || 10)
  );
  return { page, limit };
};

// Original function for Mongoose queries
export const paginateQuery = async <T>(
  query: any,
  options: PaginationOptions
): Promise<PaginationResult<T>> => {
  const { page = 1, limit = 10 } = options;
  const skip = (page - 1) * limit;

  const [items, totalItems] = await Promise.all([
    query.skip(skip).limit(limit),
    query.model.countDocuments(query.getQuery()),
  ]);

  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    totalItems,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};

// New function for arrays
export const paginateArray = <T>(
  array: T[],
  options: PaginationOptions
): PaginationResult<T> => {
  const { page = 1, limit = 10 } = options;
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;

  const items = array.slice(startIndex, endIndex);
  const totalItems = array.length;
  const totalPages = Math.ceil(totalItems / limit);

  return {
    items,
    totalItems,
    currentPage: page,
    totalPages,
    hasNextPage: page < totalPages,
    hasPreviousPage: page > 1,
  };
};
