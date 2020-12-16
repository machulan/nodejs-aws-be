const express = require('express');
const axios = require('axios').default;
const NodeCache = require('node-cache');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const cache = new NodeCache({ checkperiod: 60 });
const PORT = process.env.PORT || 3001;
const cachedResponse = {
  url: `${process.env['products']}/products`,
  method: 'GET',
};
const CACHE_TTL = 120; // in seconds
const log = (message) => {
  console.log('[BFF Service]', message);
};

app.use(express.json());

app.all('/*', (req, res) => {
  log(`original URL - ${req.originalUrl}`);
  log(`method - ${req.method}`);
  log(`body - ${JSON.stringify(req.body)}`);

  const recipient = req.originalUrl.split('/')[1];
  log(`recipient - ${recipient}`);

  const recipientURL = process.env[recipient];
  log(`recipient URL - ${recipientURL}`);

  if (recipientURL) {
    const axiosConfig = {
      method: req.method,
      url: `${recipientURL}${req.originalUrl}`,
      ...(Object.keys(req.body || {}).length > 0 && { data: req.body })
    };
    log(`axios config - ${JSON.stringify(axiosConfig)}`);

    const cacheKey = `${axiosConfig.method}:${axiosConfig.url}`;
    const cacheValue = cache.get(cacheKey);

    if (cacheValue) {
      log(`response data is received from cache`);
      res.json(cacheValue);
      return;
    }

    axios(axiosConfig)
      .then((response) => {
        if (axiosConfig.url === cachedResponse.url && axiosConfig.method === cachedResponse.method) {
          cache.set(cacheKey, response.data, CACHE_TTL);
          log(`response data is added to cache`);
        }

        res.json(response.data);
      })
      .catch((error) => {
        log(`recipient error - ${JSON.stringify(error)}`);

        if (error.response) {
          const { status, data } = error.response;

          res.status(status).json(data);
        } else {
          res.status(500).json({ error: error.message });
        }
      });
  } else {
    res.status(502).json({ error: 'Cannot process request' });
  }
});

app.listen(PORT, () => {
  log(`listening at ${PORT}`);
});
