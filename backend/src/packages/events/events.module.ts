import { Module, forwardRef } from '@nestjs/common';
import { EventsService } from './events.service';
import { QueuesModule } from '../queues/queues.module';

@Module({
  providers: [EventsService],
  imports: [forwardRef(() => QueuesModule)],
  exports: [EventsService],
})
export class EventsModule {}
