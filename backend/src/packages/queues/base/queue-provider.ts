import { QueueNames } from './queue-names';

export interface QueueProvider {
  pushMessage<T>(queueName: QueueNames, payload: T): Promise<void>;
}
