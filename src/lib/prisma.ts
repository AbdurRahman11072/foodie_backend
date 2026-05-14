import { PrismaPg } from '@prisma/adapter-pg';
import pg from 'pg';
import 'dotenv/config';
import { PrismaClient } from '../generated/prisma/client';

const connectionString = `${process.env.DATABASE_URL}`;

const pool = new pg.Pool({ connectionString });
const adapter = new PrismaPg(pool as any);
const prisma = new PrismaClient({ adapter });

export { prisma };
