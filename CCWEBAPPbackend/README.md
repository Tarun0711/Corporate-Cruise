# Node.js Production Backend

A production-ready Node.js backend with proper logging, error handling, service architecture, and Redis caching.

## Features

- 🚀 Express.js server with security middleware
- 📝 Winston logger with daily rotation
- 🔒 Error handling middleware
- 🏗️ Service-based architecture
- ✅ Input validation
- 📦 Environment configuration
- 🔄 Compression and performance optimizations
- 🔥 Redis caching with automatic and manual options

## Project Structure

```
src/
├── app.js              # Main application file
├── middleware/         # Custom middleware
│   ├── errorHandler.js # Error handling middleware
│   └── cacheMiddleware.js # Redis cache middleware
├── routes/            # API routes
│   ├── index.js       # Main routes
│   └── cacheExampleRoutes.js # Example cache routes
├── services/          # Business logic
│   └── redisService.js # Redis service
└── utils/             # Utility functions
    └── logger.js      # Winston logger
```

## Setup

1. Clone the repository
2. Install dependencies:
   ```bash
   npm install
   ```
3. Copy `.env.example` to `.env` and configure your environment variables:
   ```bash
   cp .env.example .env
   ```
4. Make sure Redis is installed and running on your system
5. Start the development server:
   ```bash
   npm run dev
   ```

## Production Deployment

1. Set environment variables for production
2. Ensure Redis is properly configured
3. Build and start the server:
   ```bash
   npm start
   ```

## API Endpoints

- `GET /api/health` - Health check endpoint
- `GET /api/cache/cached-data` - Example of automatic caching (5 minutes)
- `POST /api/cache/cache-manual` - Manually cache data
- `GET /api/cache/cache-manual/:key` - Retrieve cached data
- `DELETE /api/cache/cache-manual/:key` - Delete cached data

## Redis Caching

The application includes two types of Redis caching:

1. **Automatic Caching** - Using middleware for route responses
   ```javascript
   // Example: Cache a route for 5 minutes
   router.get('/data', cacheMiddleware(300, 'prefix'), async (req, res) => {
     // Your route handler
   });
   ```

2. **Manual Caching** - Direct access to Redis service
   ```javascript
   // Set cache
   await redisService.set('key', value, 3600); // 1 hour expiration
   
   // Get cache
   const value = await redisService.get('key');
   
   // Delete cache
   await redisService.delete('key');
   ```

## Logging

Logs are stored in the `logs` directory with daily rotation:
- `application-YYYY-MM-DD.log` - Application logs
- `exceptions-YYYY-MM-DD.log` - Uncaught exceptions

## Error Handling

The application includes a centralized error handling system that:
- Logs errors with context
- Returns appropriate error responses
- Handles operational vs programming errors differently
- Provides detailed errors in development mode

## Security

- Helmet.js for security headers
- CORS configuration
- Request validation
- Rate limiting (configurable)
- Compression for responses #   C C W E B A P P  
 #   C C W E B A P P  
 