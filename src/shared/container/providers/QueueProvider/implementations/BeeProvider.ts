import type { Job } from 'bee-queue';
import Bee from 'bee-queue';
import { queueConfig } from '@config/queue';
import type { IIntervalDTO } from '@dtos/IIntervalDTO';
import { convertToMilliseconds } from '@utils/convertToMilliseconds';
import type { IHandleDataDTO } from '../dtos/IHandleDataDTO';
import type { IHandleDTO } from '../dtos/IHandleDTO';
import type { IQueueDTO } from '../dtos/IQueueDTO';
import type { IQueueProvider } from '../models/IQueueProvider';
import { jobs } from '../public/jobs';

export class BeeProvider implements IQueueProvider {
  private readonly queues: IQueueDTO<Bee> = {};

  public constructor() {
    this.init();
    this.processQueue();
  }

  private init(): void {
    return jobs.forEach(Job => {
      const instance = new Job();
      this.queues[Job.key] = {
        queue: new Bee(Job.key, {
          prefix: queueConfig.config.redis.prefix,
          redis: queueConfig.config.redis,
          activateDelayedJobs: true,
          removeOnSuccess: true,
        }),
        handle: instance.handle.bind(instance),
      };
    });
  }

  public async execute<T extends IHandleDTO>({
    attempts = 1,
    data,
    job,
  }: {
    data: IHandleDataDTO<T>;
    attempts: number;
    job: T;
  }): Promise<Job<IHandleDataDTO<T>>> {
    return this.queues[job.key].queue.createJob(data).retries(attempts).save();
  }

  public async schedule<T extends IHandleDTO>({
    attempts = 1,
    delay,
    data,
    job,
  }: {
    data: IHandleDataDTO<T>;
    delay: IIntervalDTO;
    attempts: number;
    job: T;
  }): Promise<Job<IHandleDataDTO<T>>> {
    const parsedDelay = convertToMilliseconds(delay);
    return this.queues[job.key].queue
      .createJob(data)
      .retries(attempts)
      .delayUntil(Date.now() + parsedDelay)
      .save();
  }

  private processQueue(): void {
    return jobs.forEach(job => {
      const { queue, handle } = this.queues[job.key];

      queue.process(handle);
      queue.on('error', error => {
        throw error;
      });
    });
  }
}
