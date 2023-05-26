import { Injectable, OnModuleInit, INestApplication } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { Prisma, PrismaClient } from '@prisma/client';
//import LRUCache from 'lru-cache';
import { InjectPinoLogger, PinoLogger } from 'nestjs-pino';

/**
 * See: https://docs.nestjs.com/recipes/prisma
 */
@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit {
  // private readonly logger = ROOT_LOGGER.child({
  //   'log.logger': 'PrismaService',
  //   'event.category': 'database',
  //   'event.module': 'postgresql',
  // });

  constructor(
    private configService: ConfigService,
    @InjectPinoLogger()
    private readonly logger: PinoLogger,
  ) {
    //REF: https://www.npmjs.com/package/lru-cache
    // const cache = new LRUCache({
    //   max: 800000, // maximum number of items in the cache
    //   ttl: 1000 * 60 * 60 * 24 * 3, // time (in ms) until an item is considered stale, current value is 1 days
    // });

    super({
      // log is handled by listeners below which uses PinoLogger
      log: [
        { emit: 'event', level: 'query' },
        { emit: 'event', level: 'error' },
        { emit: 'event', level: 'warn' },
        { emit: 'event', level: 'info' },
      ],
    });
    this.$on('error' as any, async (e: Prisma.LogEvent) => {
      this.logger.error(
        { time: e.timestamp.getTime(), labels: { target: e.target } },
        e.message,
      );
    });
    this.$on('warn' as any, async (e: Prisma.LogEvent) => {
      this.logger.warn(
        { time: e.timestamp.getTime(), labels: { target: e.target } },
        e.message,
      );
    });
    this.$on('info' as any, async (e: Prisma.LogEvent) => {
      this.logger.info(
        { time: e.timestamp.getTime(), labels: { target: e.target } },
        e.message,
      );
    });
    this.$on('query' as any, async (e: Prisma.QueryEvent) => {
      this.logger.debug(
        {
          time: e.timestamp.getTime(),
          labels: { params: e.params },
          'event.duration': e.duration * 1000000,
        },
        e.query,
      );
    });

    // TURNS OUT IT MAKE THE UPDATE ERROR LOL, it get CACHED awokawokawokaw, have to findout other way to cacheing
    // // use cache for query engine
    // this.$use(async (params, next) => {
    //   // console.log('params', params);
    //   const cacheKey = JSON.stringify(params);
    //   const result = cache.get(cacheKey);
    //   if (result) {
    //     return result;
    //   }
    //   const promise = next(params);
    //   cache.set(cacheKey, promise);
    //   return promise;
    // });
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
