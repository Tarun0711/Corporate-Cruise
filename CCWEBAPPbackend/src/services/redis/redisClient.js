const redis = require('redis');
const logger = require('../../utils/logger');

class RedisClient {
  constructor() {
    this.client = null;
    this.isConnected = false;
    this.retryAttempts = 0;
    this.maxRetries = 5;
    this.retryDelay = 5000; // 5 seconds
  }

  async connect() {
    try {
      this.client = redis.createClient({
        socket: {
          host: process.env.REDIS_HOST,
          port: process.env.REDIS_PORT,
          reconnectStrategy: (retries) => {
            if (retries > this.maxRetries) {
              logger.error('Max retries reached for Redis connection');
              return new Error('Max retries reached');
            }
            return this.retryDelay;
          }
        },
        password: process.env.REDIS_PASSWORD || undefined
      });

      this.client.on('error', (err) => {
        logger.error('Redis Client Error:', err);
        this.isConnected = false;
      });

      this.client.on('connect', () => {
        logger.info('Redis Client Connected');
        this.isConnected = true;
        this.retryAttempts = 0;
      });

      this.client.on('reconnecting', () => {
        logger.info('Redis Client Reconnecting...');
        this.retryAttempts++;
      });

      await this.client.connect();
    } catch (error) {
      logger.error('Failed to connect to Redis:', error);
      throw error;
    }
  }

  async set(key, value, command = null, expirySeconds = null) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      // Handle different Redis SET commands
      if (command === 'EX' && expirySeconds) {
        // Ensure expirySeconds is a valid integer
        const expiry = Math.floor(Number(expirySeconds));
        if (isNaN(expiry) || expiry <= 0) {
          throw new Error('Invalid expiry time');
        }
        await this.client.setEx(key, expiry, JSON.stringify(value));
      } else {
        await this.client.set(key, JSON.stringify(value));
      }
    } catch (error) {
      logger.error(`Redis set error for key ${key}:`, error);
      throw error;
    }
  }

  async get(key) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      const value = await this.client.get(key);
      if (!value) return null;
      
      try {
        return JSON.parse(value);
      } catch (e) {
        // If the value is not JSON, return it as is
        return value;
      }
    } catch (error) {
      logger.error(`Redis get error for key ${key}:`, error);
      throw error;
    }
  }

  async del(key) {
    try {
      if (!this.isConnected) {
        await this.connect();
      }
      
      await this.client.del(key);
    } catch (error) {
      logger.error(`Redis delete error for key ${key}:`, error);
      throw error;
    }
  }

  async disconnect() {
    try {
      if (this.client) {
        await this.client.quit();
        this.isConnected = false;
      }
    } catch (error) {
      logger.error('Error disconnecting Redis:', error);
      throw error;
    }
  }
}

// Create a singleton instance
const redisClient = new RedisClient();

module.exports = redisClient; 