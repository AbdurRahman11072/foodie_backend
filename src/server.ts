import app from './app';
import { prisma } from './lib/prisma';

const PORT = process.env.PORT || 5000;

async function server() {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`server is running on : http://localhost:${PORT}/`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log('Failed to establish connection with database');
    process.exit(1);
  }
}

server();

export default app;
