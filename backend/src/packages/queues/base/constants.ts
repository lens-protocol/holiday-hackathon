import { QueueProvider } from './queue-provider';

export enum QueueProvidersEnum {
  Bull = 'BullQueue',
}

export type QueueProviderServices = {
  [K in QueueProvidersEnum]: QueueProvider;
};
