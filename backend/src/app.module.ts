import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { envValidate } from './env.validation';
import { UsersModule } from './packages/users/users.module';
import { PrismaModule } from 'nestjs-prisma';
import { QueuesModule } from './packages/queues/queues.module';
import { EventEmitterModule } from '@nestjs/event-emitter';
import { EventsModule } from './packages/events/events.module';
import { ScheduleModule } from '@nestjs/schedule';
import { SchedulerModule } from './packages/scheduler/scheduler.module';
import { CacheModule } from '@nestjs/cache-manager';
import { IdentitiesModule } from './packages/identities/identities.module';
import { ClaudeAiModule } from './packages/claude-ai/claude-ai.module';
import * as redisStore from 'cache-manager-redis-store';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
      validate: envValidate,
    }),
    CacheModule.register({
      isGlobal: true,
      // store: redisStore,
      // host: process.env.REDIS_HOST,
      // port: process.env.REDIS_PORT,
    }),
    PrismaModule.forRoot({
      isGlobal: true,
      prismaServiceOptions: {
        // middlewares: [prismaLoggingMiddleware()],
        explicitConnect: true,
        prismaOptions: {
          transactionOptions: {
            maxWait: 15000, // default: 2000
            timeout: 300000, // default: 5000
          },
        },
      },
    }),
    EventEmitterModule.forRoot({
      maxListeners: 5,
      delimiter: '.',
      verboseMemoryLeak: true,
    }),
    ScheduleModule.forRoot(),
    UsersModule,
    QueuesModule,
    EventsModule,
    SchedulerModule,
    IdentitiesModule,
    ClaudeAiModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
