import { Module } from '@nestjs/common';
import { Web3Service } from './web3.service';
import { QueuesService } from 'src/packages/queues/queues.service';

@Module({
  providers: [Web3Service, QueuesService],
})
export class Web3Module { }
