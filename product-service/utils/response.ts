interface Response {
  statusCode: number;
  headers: object;
  body: string;
}

const headers = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET',
  'Access-Control-Allow-Headers': 'Origin, X-Requested-With, Content-Type, Accept'
};

const makeResponse = (statusCode: number, body: any): Response => ({
  statusCode,
  headers,
  body: JSON.stringify(body),
});

const makeSuccessResponse = ({ body }: { body: any; }): Response => makeResponse(200, body);
const makeBadRequestResponse = ({ body }: { body: any; }): Response => makeResponse(400, body);
const makeNotFoundResponse = ({ body }: { body: any; }): Response => makeResponse(404, body);
const makeErrorResponse = ({ body }: { body: any; }): Response => makeResponse(500, body);

export {
  makeSuccessResponse,
  makeBadRequestResponse,
  makeNotFoundResponse,
  makeErrorResponse
};
