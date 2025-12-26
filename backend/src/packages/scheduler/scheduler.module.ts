import { Module } from '@nestjs/common';
import { SchedulerService } from './scheduler.service';
import { Web3Service } from 'src/web3/web3.service';
import { QueuesService } from '../queues/queues.service';
import { BullQueueProvider } from '../queues/providers/bull-queue';
import { QueuesModule } from '../queues/queues.module';

@Module({
  providers: [SchedulerService, Web3Service],
  imports: [QueuesModule]
})
export class SchedulerModule { }
