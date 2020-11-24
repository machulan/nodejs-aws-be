import type { Serverless } from 'serverless/aws';
import { BUCKET_PARAMS } from './utils/constants';

const serverlessConfiguration: Serverless = {
  service: {
    name: 'import-service',
    // app and org for use with dashboard.serverless.com
    // app: your-app-name,
    // org: your-org-name,
  },
  frameworkVersion: '2',
  custom: {
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true
    }
  },
  // Add the serverless-webpack plugin
  plugins: ['serverless-webpack'],
  provider: {
    name: 'aws',
    runtime: 'nodejs12.x',
    stage: 'dev',
    region: 'eu-west-1',
    iamRoleStatements: [
      {
        Effect: 'Allow',
        Action: 's3:ListBucket',
        Resource: `arn:aws:s3:::${BUCKET_PARAMS.name}`,
      },
      {
        Effect: 'Allow',
        Action: 's3:*',
        Resource: `arn:aws:s3:::${BUCKET_PARAMS.name}/*`,
      },
      {
        Effect: 'Allow',
        Action: 'sqs:*',
        // Resource: '${cf:product-service-${self:provider.stage}.SQSArn}',
        Resource: {
          'Fn::ImportValue': 'SQSArn',
        },
      },
    ],
    apiGateway: {
      minimumCompressionSize: 1024,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
      SQS_URL: {
        'Fn::ImportValue': 'SQSUrl',
      },
    },
  },
  functions: {
    importProductsFile: {
      handler: 'handler.importProductsFile',
      events: [
        {
          http: {
            method: 'get',
            path: 'import',
            cors: true,
            request: {
              parameters: {
                querystrings: {
                  name: true
                }
              }
            }
          }
        }
      ]
    },
    importFileParser: {
      handler: 'handler.importFileParser',
      events: [
        {
          s3: {
            bucket: BUCKET_PARAMS.name,
            event: 's3:ObjectCreated:*',
            rules: [
              {
                prefix: BUCKET_PARAMS.prefix,
                suffix: '',
              }
            ],
            existing: true,
          }
        }
      ]
    }
  }
}

module.exports = serverlessConfiguration;
