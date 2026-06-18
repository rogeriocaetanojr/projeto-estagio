import { Injectable, OnModuleInit } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';
import { Pool } from 'pg';
import { PrismaPg } from '@prisma/adapter-pg';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  constructor() {
    const connectionString = process.env.DATABASE_URL;
    const pool = new Pool({ connectionString });

    let schema = 'public';
    try {
      const url = new URL(connectionString as string);
      schema = url.searchParams.get('schema') || 'public';
      pool.on('connect', (client) => {
        client.query(`SET search_path TO ${schema}`);
      });
    } catch (e) {
      // fallback
    }

    const adapter = new PrismaPg(pool, { schema });
    super({ adapter });
  }

  async onModuleInit() {
    await this.$connect();
  }
}
