require('dotenv').config();
const express = require('express');
const http = require('http');
const path = require('path');
const cors = require('cors');
const morgan = require('morgan');
const session = require('express-session');
const swaggerJSDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');
const {RedisStore} = require("connect-redis")
const passport = require('passport');
const initializePassport = require('./strategies/local-strategy');
const initializeGoogleStrategy = require('./strategies/google-strategy');
const redisClient = require('./redisClient');
const initWebSocket = require('./websocket');
const carsRouter = require('./routes/cars');
const savedRouter = require('./routes/saved');
const usersRouter = require('./routes/users');
const conversationsRouter = require('./routes/conversations');
const aiRouter = require('./routes/ai');

const port = process.env.PORT || 3000;

const app = express();

const swaggerOptions = {
  swaggerDefinition: {
    openapi: '3.1.0',
    info: {
      version: '1.0.0',
      title: 'AutoFlow API Documentation',
      description: 'Swagger Documentation Setup',
      servers: ["http://localhost:3000"],
    },
    schemes: ['http', 'https'],
  },
  apis: ['./routes/*.js'], 
};

const swaggerDocs =swaggerJSDoc(swaggerOptions);

const server = http.createServer(app);

async function startServer() {
  try {
    await redisClient.connect();
    console.log('Redis client connected successfully');

    const redisStore = new RedisStore({
      client: redisClient,
      prefix: 'autoflow:session:'
    });

    app.use(cors({
      origin: 'http://localhost:5173',
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE'],
      allowedHeaders: ['Content-Type', 'Authorization', 'Set-Cookie']
    }));

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    app.use(morgan('combined'));

    app.use(session({
      store: redisStore,
      secret: process.env.SESSION_SECRET || 'sdkjkskjaal',
      resave: false,
      saveUninitialized: false,
      cookie: {
        httpOnly: false,
        maxAge: 24 * 60 * 60 * 1000, // 24 hours
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'lax'
      }
    }));

    initializePassport();
    initializeGoogleStrategy();
    app.use(passport.initialize());
    app.use(passport.session());
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerDocs));
    app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
    app.use('/cars', carsRouter);
    app.use('/saved', savedRouter);
    app.use('/users', usersRouter);
    app.use('/conversations', conversationsRouter);
    app.use('/ai', aiRouter);

    initWebSocket(server);

    server.listen(port, () => {
      console.log(`Server running on port ${port}. WebSocket is enabled.`);
    });

  } catch (error) {
    console.error('Server initialization failed:', error);
    process.exit(1);
  }
}

startServer();