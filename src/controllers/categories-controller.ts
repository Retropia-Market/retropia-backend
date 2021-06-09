import { RequestHandler } from 'express';
import { categoriesRepository } from '../repositories';

export const getCategories: RequestHandler = async (req, res, next) => {
  try {
    const categories = await categoriesRepository.getCategories();
    res.send(categories);
  } catch (error) {
    next(error);
  }
};
