import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { QueueNames, QueueProvider, QueueProviderServices, QueueProvidersEnum } from './base';
import { BullQueueProvider } from './providers/bull-queue';

@Injectable()
export class QueuesService {
  constructor(private readonly bullQueueService: BullQueueProvider) {}

  private getProviderService(
    provider: QueueProvidersEnum = QueueProvidersEnum.Bull,
  ): QueueProvider {
    const providers = this.mapProviderServices(provider);
    return providers[provider];
  }

  private mapProviderServices(provider: QueueProvidersEnum): QueueProviderServices {
    const returnObj = {
      [QueueProvidersEnum.Bull]: this.bullQueueService,
    };

    if (!Object.keys(returnObj).includes(provider))
      throw new HttpException('Queue provider not found !', HttpStatus.BAD_REQUEST);

    return returnObj;
  }

  async pushMessage<T>(queueName: QueueNames, payload: T) {
    const provider = this.getProviderService();
    provider.pushMessage<T>(queueName, payload);
  }
}
