import app from './app';
import { prisma } from './app/lib/prisma';
const PORT = process.env.PORT || 5000;

export async function server() {
  try {
    await prisma.$connect();
    console.log('Database connection successful');
    app.listen(PORT, () => {
      console.log(`server is runnig on : https://localhost:${PORT}`);
    });
  } catch (error) {
    await prisma.$disconnect();
    console.log('Failed to estublished connection with database');
    process.exit(1);
  }
}

server();
