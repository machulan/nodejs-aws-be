import { APIGatewayProxyHandler } from 'aws-lambda';
import * as AWS from 'aws-sdk'
import 'source-map-support/register';
import { BUCKET_PARAMS } from '../utils/constants';
import { makeErrorResponse, makeSuccessResponse, makeBadRequestResponse } from '../utils/response';

export const importProductsFile: APIGatewayProxyHandler = async (event, _context) => {
  console.log('importProductsFile', JSON.stringify(event));

  try {
    const { queryStringParameters: { name } } = event;

    if (!name) {
      return makeBadRequestResponse({
        body: {
          message: 'Filename is invalid',
        }
      });
    }

    const s3 = new AWS.S3({ region: BUCKET_PARAMS.region });
    const signedUrl = await s3.getSignedUrlPromise('putObject', {
      Bucket: BUCKET_PARAMS.name,
      Key: `${BUCKET_PARAMS.prefix}/${name}`,
      Expires: 60,
      ContentType: 'text/csv',
    });

    return makeSuccessResponse({
      body: signedUrl
    });
  } catch (e) {
    console.log('importProductsFile error', e);
    return makeErrorResponse({
      body: {
        message: e.message
      },
    });
  }
}
