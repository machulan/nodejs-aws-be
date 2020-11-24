import { SQSEvent, SQSHandler, SQSRecord } from 'aws-lambda';
import * as AWS from 'aws-sdk';
import 'source-map-support/register';
import { Book, BookDTO } from '../models';
import * as productService from '../services/products';

export const catalogBatchProcess: SQSHandler = async (event: SQSEvent) => {
  console.log('catalogBatchProcess', event);

  const sns = new AWS.SNS({
    region: 'eu-west-1',
  });
  const snsTopicArn = process.env.SNS_ARN;
  const books: BookDTO[] = event.Records.map((record: SQSRecord) => JSON.parse(record.body) as BookDTO);
  console.log('catalogBatchProcess books', JSON.stringify(books));
  const newBooks = await Promise.allSettled(
    books.map(async (book: Book) => await productService.createProduct(book))
  );
  const createdBooks = newBooks
    .filter((promise) => promise.status === 'fulfilled')
    .map((promise: PromiseFulfilledResult<Book>) => promise.value);
  console.log('catalogBatchProcess createdBooks', JSON.stringify(createdBooks));

  await sns.publish({
    Subject: `${createdBooks.length} of ${newBooks.length} books were saved in database`,
    Message: JSON.stringify(createdBooks),
    TopicArn: snsTopicArn,
  }).promise();
}
