import { DynamicModule, Module } from '@nestjs/common';
import { QueuesService } from './queues.service';
import { QueuesController } from './queues.controller';
import { BullQueueProvider } from './providers/bull-queue';
import { BullModule } from '@nestjs/bull';
import { QueueNames } from './base/queue-names';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { EventParserConsumer } from './consumers/eventParser';
import { RewardReleaseConsumer } from './consumers/rewardRelease';

const bullQueueRegistration: DynamicModule[] = Object.values(QueueNames).map((queue) => {
  return BullModule.registerQueue({
    name: queue,
  });
});

@Module({
  providers: [QueuesService, BullQueueProvider, EventParserConsumer, RewardReleaseConsumer],
  controllers: [QueuesController],
  imports: [
    ConfigModule,
    BullModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        redis: {
          host: configService.get<string>('REDIS_HOST') ?? 'localhost',
          port: configService.get<number>('REDIS_PORT') ?? 6379,
          // password: configService.get<string>('REDIS_PWD') ?? 'admin@12345', // Showing console warning in password as it is not required for redis config
        },
      }),
    }),
    ...bullQueueRegistration,
  ],
  exports: [QueuesService],
})
export class QueuesModule {}
