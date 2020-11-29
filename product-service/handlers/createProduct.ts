import * as Joi from '@hapi/joi';
import { APIGatewayProxyHandler } from 'aws-lambda';
import 'source-map-support/register';
import { Book, BookDTO } from '../models';
import * as productService from '../services/products';
import { makeErrorResponse, makeSuccessResponse, makeBadRequestResponse } from '../utils/response';

const bookDTOSchema = Joi.object().keys({
  title: Joi.string().required(),
  description: Joi.string().required(),
  price: Joi.number().integer().required(),
  count: Joi.number().integer().required(),
  author: Joi.string(),
  language: Joi.string(),
  publishYear: Joi.number().integer(),
});

const validate = (schema: Joi.Schema, value: any): Joi.ValidationResult => {
  return schema.validate(value);
}

export const createProduct: APIGatewayProxyHandler = async (event, _context) => {
  console.log('createProduct', event);

  try {
    const data: any = JSON.parse(event.body);
    const { error } = validate(bookDTOSchema, data);

    if (error && error.isJoi) {
      return makeBadRequestResponse({
        body: {
          message: 'Book data is invalid',
          errorDetails: error.details,
        },
      });
    }

    const newBookDTO = data as BookDTO;
    const newBook: Book = await productService.createProduct(newBookDTO);

    return makeSuccessResponse({
      body: {
        message: 'New book was added',
        book: {
          ...newBook,
        },
      },
    });
  } catch (e) {
    return makeErrorResponse({
      body: {
        message: e.message
      },
    })
  };
}
