const { createClient } = require('redis');

const redisURL = process.env.REDIS_URL || 'redis://localhost:6379';

const redisClient = createClient({ url: redisURL });

redisClient.on('error', (err) => {
  console.error('Redis Client Error:', err);
});

module.exports = redisClient;
