import app from './app';
import { config } from './config/environment';
import { connectDB } from './config/database';

const startServer = async (): Promise<void> => {
  try {
    // Connect to database
    await connectDB();

    // Start server
    const server = app.listen(config.PORT, () => {
      console.log(`🚀 Server running on port ${config.PORT} in ${config.NODE_ENV} mode`);
      console.log(`📋 Health check: http://localhost:${config.PORT}/health`);
    });

    // Graceful shutdown
    const gracefulShutdown = (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      server.close(() => {
        console.log('HTTP server closed');
        process.exit(0);
      });
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));

  } catch (error) {
    console.error('Error starting server:', error);
    process.exit(1);
  }
};

startServer();