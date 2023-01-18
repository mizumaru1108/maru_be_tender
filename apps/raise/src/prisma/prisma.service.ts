import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
import LRUCache from 'lru-cache';
import { ROOT_LOGGER } from 'src/libs/root-logger';

/**
 * See: https://docs.nestjs.com/recipes/prisma
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  private readonly logger = ROOT_LOGGER.child({
    'log.logger': 'PrismaService',
    'event.category': 'database',
    'event.module': 'postgresql',
  });

  constructor(private configService: ConfigService) {
    //REF: https://www.npmjs.com/package/lru-cache
    const cache = new LRUCache({
      max: 800000, // maximum number of items in the cache
      ttl: 1000 * 60 * 60 * 24 * 3, // time (in ms) until an item is considered stale, current value is 1 days
    });

    super({
      // log is handled by listeners below which uses Winston
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'info' },
      ],
      datasources: {
        db: {
          url: configService.get('POSTGRES_URL'),
        },
      },
    });

    // use cache for query engine
    this.$use(async (params, next) => {
      // console.log('params', params);
      const cacheKey = JSON.stringify(params);
      const result = cache.get(cacheKey);
      if (result) {
        return result;
      }
      const promise = next(params);
      cache.set(cacheKey, promise);
      return promise;
    });

    this.$on('error' as any, async (e: Prisma.LogEvent) => {
      this.logger.info('dsddsd', configService.get('POSTGRES_URL'));
      this.logger.error(e.message, {
        '@timestamp': e.timestamp,
        labels: { target: e.target },
      });
    });
    this.$on('warn' as any, async (e: Prisma.LogEvent) => {
      this.logger.warn(e.message, {
        '@timestamp': e.timestamp,
        labels: { target: e.target },
      });
    });
    this.$on('info' as any, async (e: Prisma.LogEvent) => {
      this.logger.info(e.message, {
        '@timestamp': e.timestamp,
        labels: { target: e.target },
      });
    });
    this.$on('query' as any, async (e: Prisma.QueryEvent) => {
      this.logger.debug(e.query, {
        '@timestamp': e.timestamp,
        labels: { params: JSON.stringify(e.params) },
        'event.duration': e.duration * 1000000,
      });
    });
  }

  async onModuleInit() {
    await this.$connect();
  }

  async enableShutdownHooks(app: INestApplication) {
    this.$on('beforeExit', async () => {
      await app.close();
    });
  }
}
