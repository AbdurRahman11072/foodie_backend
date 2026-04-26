import app from './app';
import { prisma } from './lib/prisma';
const PORT = process.env.PORT || 5000;

export async function server() {
  try {
    await prisma.$connect();
    console.log('Database connection successful');

    const httpServer = app.listen(PORT, () => {
      console.log(`server is running on : http://localhost:${PORT}/`);
    });

    // Graceful shutdown for Render (sends SIGTERM before stopping)
    const gracefulShutdown = async (signal: string) => {
      console.log(`\n${signal} received. Shutting down gracefully...`);
      httpServer.close(async () => {
        await prisma.$disconnect();
        console.log('Database connection closed.');
        process.exit(0);
      });

      // Force shutdown after 10s if graceful close hangs
      setTimeout(() => {
        console.error('Forced shutdown after timeout');
        process.exit(1);
      }, 10000);
    };

    process.on('SIGTERM', () => gracefulShutdown('SIGTERM'));
    process.on('SIGINT', () => gracefulShutdown('SIGINT'));
  } catch (error) {
    await prisma.$disconnect();
    console.log('Failed to establish connection with database');
    process.exit(1);
  }
}

server();
