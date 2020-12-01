import { APIGatewayAuthorizerCallback, APIGatewayAuthorizerHandler, APIGatewayTokenAuthorizerEvent, APIGatewayAuthorizerResult } from 'aws-lambda';
import 'source-map-support/register';

const isValidUser = (username: string, password: string) => {
  const rightPassword: string = process.env[username];

  return rightPassword === password;
};

function generatePolicy(
  principalId: string,
  resource: string,
  effect: string,
): APIGatewayAuthorizerResult {
  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource,
        },
      ],
    },
  };
}

export const basicAuthorizer: APIGatewayAuthorizerHandler = async (event: APIGatewayTokenAuthorizerEvent, _context, callback: APIGatewayAuthorizerCallback) => {
  console.log('basicAuthorizer', JSON.stringify(event));

  const { type } = event;

  if (type !== 'TOKEN') {
    callback('Unauthorized');
    return;
  }

  try {
    const { authorizationToken, methodArn } = event;
    console.log(`basicAuthorizer authorizationToken: ${authorizationToken}`);

    const token = authorizationToken.split(' ')[1];
    const buffer = Buffer.from(token, 'base64');
    const [username, password] = buffer.toString('utf-8').split(':');
    console.log(`basicAuthorizer username: ${username} password: ${password}`);

    const effect = isValidUser(username, password) ? 'Allow' : 'Deny';
    console.log(`basicAuthorizer effect: ${effect}`);

    const policy = generatePolicy(token, methodArn, effect);
    callback(null, policy);
  } catch (error) {
    console.log('basicAuthorizer error', error);
    callback('basicAuthorizer error');
  }
}
