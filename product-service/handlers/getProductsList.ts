import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as productService from '../services/products';
import { makeErrorResponse, makeSuccessResponse } from '../utils/response';

export const getProductsList: APIGatewayProxyHandler = async (_, _context) => {
  console.log('getProductsList');

  try {
    const products = await productService.getProductsList();

    return makeSuccessResponse({
      body: products
    });
  } catch (e) {
    return makeErrorResponse({
      body: {
        message: e.message
      },
    });
  };
}
