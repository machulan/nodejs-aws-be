import 'source-map-support/register';
import { getProductsById } from './handlers/getProductsById';
import { getProductsList } from './handlers/getProductsList';
import { createProduct } from './handlers/createProduct';
import { catalogBatchProcess } from './handlers/catalogBatchProcess';

export {
  getProductsById,
  getProductsList,
  createProduct,
  catalogBatchProcess,
};
