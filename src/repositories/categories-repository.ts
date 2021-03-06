import { database } from '../infrastructure';

export const getCategories = async () => {
  const query =
    'select sub_categories.* , categories.name as categoria from sub_categories inner join categories on sub_categories.category_id = categories.id';
  const [categories] = await database.query(query);

  return categories;
};
