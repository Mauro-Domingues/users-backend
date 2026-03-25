import type { DoneCallback, Job, Queue } from 'kue';
import { createQueue } from 'kue';
import type { InjectionToken } from 'tsyringe';
import { container } from 'tsyringe';
import { queueConfig } from '@config/queue';
import type { IIntervalDTO } from '@dtos/IIntervalDTO';
import { convertToMilliseconds } from '@utils/convertToMilliseconds';
import type { IHandleDataDTO } from '../dtos/IHandleDataDTO.js';
import type { IHandleDTO } from '../dtos/IHandleDTO.js';
import type { IQueueDTO } from '../dtos/IQueueDTO.js';
import type { IQueueProvider } from '../models/IQueueProvider';
import { jobs } from '../public/jobs';

export class KueProvider implements IQueueProvider {
  private readonly queues: IQueueDTO<Queue> = {};

  public constructor() {
    this.init();
    this.processQueue();
  }

  private init(): void {
    return jobs.forEach(Job => {
      this.queues[Job.key] = {
        queue: createQueue({
          redis: {
            ...queueConfig.config.redis,
            auth: queueConfig.config.redis.password,
          },
          prefix: queueConfig.config.redis.prefix,
        }),
        handle: async (data: unknown) => {
          const instance = container.resolve(
            Job as unknown as InjectionToken<unknown>,
          ) as {
            handle: (data: unknown) => Promise<void>;
          };
          return instance.handle(data);
        },
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
  }): Promise<Job> {
    return this.queues[job.key].queue
      .create(job.key, data as object)
      .attempts(attempts)
      .removeOnComplete(true)
      .save();
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
  }): Promise<Job> {
    const parsedDelay = convertToMilliseconds(delay);
    return this.queues[job.key].queue
      .create(job.key, data as object)
      .attempts(attempts)
      .delay(parsedDelay)
      .removeOnComplete(true)
      .save();
  }

  private processQueue(): void {
    return jobs.forEach(job => {
      const { queue, handle } = this.queues[job.key];

      queue.process(
        job.key,
        async (job: { data: object }, done: DoneCallback) => {
          try {
            await handle(job);
            done();
          } catch (error) {
            done(error);
          }
        },
      );
      queue.on('error', (error: Error) => {
        throw error;
      });
    });
  }
}
