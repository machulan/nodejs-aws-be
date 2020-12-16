Node.js AWS backend for book shop

# requirements

Node.js 12.x

# installation
```
npm i -g serverless
cd product-service
npm i 
cd ../import-service
npm i
cd ../authorization-service
npm i
cd ../bff-service
npm i
```

# deployment

## authorization/import/product services
```
sls deploy
```

## BFF service (created with no Serverless)

### AWS Elastic Beanstalk app initialization
```
npm run eb-init
```
### AWS Elastic Beanstalk app creation
```
npm run eb-create
```
### AWS Elastic Beanstalk app deletion
```
npm run eb-terminate
```

# create a service

```
serverless create --template aws-nodejs-typescript --path <service-name>
```
