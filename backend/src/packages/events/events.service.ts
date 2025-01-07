import { Injectable } from '@nestjs/common';
import { EventEmitter2, OnEvent } from '@nestjs/event-emitter';
import { EventEmitterEnum } from './constants/events.enum';
import { QueuesService } from '../queues/queues.service';
// import { QueueNames } from '../queues/base';

@Injectable()
export class EventsService {
  constructor(
    private eventEmitter: EventEmitter2,
    private queueService: QueuesService,
  ) {}

  async emit<T>(event: EventEmitterEnum, payload: T) {
    this.eventEmitter.emit(event, payload);
  }

  @OnEvent(EventEmitterEnum.EmailAttachmentReceived)
  handleEmailAttachmentSync(payload) {
    console.log('New Email attachment received :::::', { payload });
  }
}
