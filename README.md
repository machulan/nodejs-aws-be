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

```
sls deploy
```

# create a service

```
serverless create --template aws-nodejs-typescript --path <service-name>
```
