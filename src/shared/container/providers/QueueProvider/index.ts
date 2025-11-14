import { container } from 'tsyringe';
import { queueConfig } from '@config/queue';
import { BeeProvider } from './implementations/BeeProvider';
import { BullProvider } from './implementations/BullProvider';
import { KueProvider } from './implementations/KueProvider';
import type { IQueueProvider } from './models/IQueueProvider';

const providers: Record<typeof queueConfig.driver, () => IQueueProvider> = {
  kue: () => container.resolve(KueProvider),
  bull: () => container.resolve(BullProvider),
  bee: () => container.resolve(BeeProvider),
};

container.registerInstance<IQueueProvider>(
  'QueueProvider',
  providers[queueConfig.driver](),
);
