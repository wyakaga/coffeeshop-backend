const { createClient } = require('redis');

const client = createClient({
  url: `redis://${process.env.REDIS_USER}:${process.env.REDIS_PWD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}`
});

module.exports = client;
