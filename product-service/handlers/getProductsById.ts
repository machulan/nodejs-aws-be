import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import * as productService from '../services/products';
import { makeNotFoundResponse, makeErrorResponse, makeSuccessResponse } from '../utils/response';

export const getProductsById: APIGatewayProxyHandler = async (event, _context) => {
  console.log('getProductsById', event);

  try {
    const { pathParameters: { id } } = event;
    const product = await productService.getProductsById(id);

    if (!product) {
      return makeNotFoundResponse({
        body: {
          id,
          message: 'Product not found',
        },
      });
    }

    return makeSuccessResponse({
      body: product
    });
  } catch (e) {
    return makeErrorResponse({
      body: {
        message: e.message
      },
    })
  };
}
