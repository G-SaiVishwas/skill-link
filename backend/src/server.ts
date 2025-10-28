import Fastify from 'fastify';
import cors from '@fastify/cors';
import multipart from '@fastify/multipart';
import { config, validateConfig } from './config';
import { errorHandler } from './middleware/auth.middleware';

// Import routes
import { authRoutes } from './routes/auth.routes';
import { workerRoutes } from './routes/worker.routes';
import { employerRoutes } from './routes/employer.routes';
import { jobRoutes } from './routes/job.routes';
import { matchRoutes } from './routes/match.routes';
import { chatRoutes } from './routes/chat.routes';
import { uploadRoutes } from './routes/upload.routes';

// Validate environment config
validateConfig();

// Create Fastify instance
const fastify = Fastify({
  logger: {
    level: config.nodeEnv === 'production' ? 'info' : 'debug',
    transport: config.nodeEnv === 'development' ? {
      target: 'pino-pretty',
      options: {
        translateTime: 'HH:MM:ss Z',
        ignore: 'pid,hostname',
      },
    } : undefined,
  },
});

// Register plugins
async function registerPlugins() {
  // CORS
  await fastify.register(cors, {
    origin: [config.frontendUrl, 'http://localhost:3000'],
    credentials: true,
  });

  // Multipart (file uploads)
  await fastify.register(multipart, {
    limits: {
      fileSize: 10 * 1024 * 1024, // 10MB
    },
  });
}

// Register routes
async function registerRoutes() {
  // Health check
  fastify.get('/', async () => ({
    service: 'SkillLink API',
    status: 'running',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
  }));

  fastify.get('/health', async () => ({
    status: 'healthy',
    uptime: process.uptime(),
  }));

  // API routes
  await fastify.register(authRoutes, { prefix: '/api/auth' });
  await fastify.register(workerRoutes, { prefix: '/api' });
  await fastify.register(employerRoutes, { prefix: '/api' });
  await fastify.register(jobRoutes, { prefix: '/api' });
  await fastify.register(matchRoutes, { prefix: '/api' });
  await fastify.register(chatRoutes, { prefix: '/api' });
  await fastify.register(uploadRoutes, { prefix: '/api' });
}

// Error handler
fastify.setErrorHandler(errorHandler);

// Start server
async function start() {
  try {
    await registerPlugins();
    await registerRoutes();

    await fastify.listen({
      port: config.port,
      host: '0.0.0.0',
    });

    console.log(`
╔═══════════════════════════════════════════════╗
║                                               ║
║   🚀 SkillLink Backend API Started           ║
║                                               ║
║   Port: ${config.port}                              ║
║   Environment: ${config.nodeEnv}                    ║
║   Frontend: ${config.frontendUrl}    ║
║                                               ║
╚═══════════════════════════════════════════════╝
    `);

    console.log('\n📋 Available Routes:');
    console.log('  POST   /api/auth/login');
    console.log('  POST   /api/auth/verify');
    console.log('  POST   /api/auth/refresh');
    console.log('  POST   /api/onboard/worker');
    console.log('  GET    /api/worker/me');
    console.log('  GET    /api/worker/:id/skillcard');
    console.log('  PATCH  /api/worker/:id');
    console.log('  POST   /api/onboard/employer');
    console.log('  GET    /api/employer/me');
    console.log('  GET    /api/employer/jobs');
    console.log('  PATCH  /api/employer/:id');
    console.log('  POST   /api/job/create');
    console.log('  GET    /api/job/:id');
    console.log('  GET    /api/job/:id/matches');
    console.log('  GET    /api/workers/search');
    console.log('  POST   /api/match/:id/contact');
    console.log('  PATCH  /api/match/:id/status');
    console.log('  GET    /api/matches');
    console.log('  GET    /api/messages/:match_id');
    console.log('  POST   /api/message');
    console.log('  POST   /api/upload/photo');
    console.log('  POST   /api/upload/voice');
    console.log('\n✅ Server ready for requests!\n');
  } catch (err) {
    fastify.log.error(err);
    process.exit(1);
  }
}

// Graceful shutdown
const gracefulShutdown = async () => {
  console.log('\n⏳ Shutting down gracefully...');
  await fastify.close();
  console.log('✅ Server closed');
  process.exit(0);
};

process.on('SIGTERM', gracefulShutdown);
process.on('SIGINT', gracefulShutdown);

// Start the server
start();
