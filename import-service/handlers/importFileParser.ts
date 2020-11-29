import { APIGatewayProxyHandler, S3Event } from 'aws-lambda';
import * as AWS from 'aws-sdk'
import 'source-map-support/register';
import * as csvParser from 'csv-parser';
import { BUCKET_PARAMS, SQS_PARAMS } from '../utils/constants';
import { makeErrorResponse, makeCreatedResponse } from '../utils/response';

export const importFileParser: APIGatewayProxyHandler = async (event: S3Event, _context) => {
  console.log('importFileParser', JSON.stringify(event));

  try {
    const s3 = new AWS.S3({ region: BUCKET_PARAMS.region });
    const sqs = new AWS.SQS({ region: SQS_PARAMS.region });
    const SQS_URL = process.env.SQS_URL;

    for (const record of event.Records) {
      const s3ReadStream = s3.getObject({
        Bucket: BUCKET_PARAMS.name,
        Key: record.s3.object.key,
      }).createReadStream();

      await new Promise(((resolve, reject) => {
        s3ReadStream
          .pipe(csvParser())
          .on('data', async (data) => {
            console.log('importFileParser parsed data', data);

            await sqs
              .sendMessage({
                QueueUrl: SQS_URL,
                MessageBody: JSON.stringify(data),
              }, (error, result) => {
                if (error) {
                  console.log('importFileParser error', error);
                } else {
                  console.log('importFileParser message is sent', result);
                }
              })
              .promise();
          })
          .on('error', (error) => reject(error))
          .on('end', async () => {
            const key = record.s3.object.key;
            const resourcePath = `${BUCKET_PARAMS.name}/${key}`;
            const newKey = key.replace(BUCKET_PARAMS.prefix, BUCKET_PARAMS.parsedFilesPrefix);
            const newResourcePath = `${BUCKET_PARAMS.name}/${newKey}`
            console.log(`importFileParser copying file from ${resourcePath} to ${newResourcePath}`);

            await s3.copyObject({
              Bucket: BUCKET_PARAMS.name,
              CopySource: resourcePath,
              Key: newKey,
            }).promise();
            console.log(`importFileParser file is copied to ${newResourcePath}`);

            await s3.deleteObject({
              Bucket: BUCKET_PARAMS.name,
              Key: key,
            }).promise();
            console.log(`File ${resourcePath} is removed`);

            resolve();
          });
      }));
    }

    return makeCreatedResponse({
      body: {
        message: 'File is created',
      }
    });
  } catch (e) {
    return makeErrorResponse({
      body: {
        message: e.message
      },
    })
  }
}
