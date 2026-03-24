import type { AxiosInstance } from 'axios';
import axios, { AxiosError } from 'axios';
import { GoogleAuth } from 'google-auth-library';
import { readFileSync } from 'node:fs';
import { notificationConfig } from '@config/notification';
import { AppError } from '@shared/errors/AppError';
import type { ISendNotificationDTO } from '../dtos/ISendNotificationDTO';
import type { INotificationProvider } from '../models/INotificationProvider';

export class FirebaseProvider implements INotificationProvider {
  private readonly http: AxiosInstance;

  private readonly client: GoogleAuth;

  public constructor() {
    this.http = axios.create({
      baseURL: notificationConfig.config.firebase.apiUrl,
      headers: {
        'Content-Type': 'application/json',
      },
    });
    this.client = new GoogleAuth({
      credentials: {
        client_email: notificationConfig.config.firebase.clientEmail,
        private_key: readFileSync(
          notificationConfig.config.firebase.certPath,
          'utf-8',
        ),
      },
      projectId: notificationConfig.config.firebase.projectId,
      scopes: notificationConfig.config.firebase.scopes,
    });
  }

  private async getSession(): Promise<void> {
    try {
      const token = await this.client.getAccessToken();

      this.http.interceptors.request.use(config => {
        config.headers.Authorization = `Bearer ${token}`;
        return config;
      });
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        throw new AppError(
          'FAILED_TO_GET_SESSION',
          error.response.statusText,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }

  public async sendNotification(data: ISendNotificationDTO): Promise<void> {
    try {
      await this.getSession();

      const promises = await Promise.allSettled(
        data.deviceIds.map(deviceId => {
          const body = {
            message: {
              token: deviceId,
              notification: {
                title: data.header,
                body: data.content,
              },
              data: data.variables,
            },
          };

          return this.http.post(
            `projects/${notificationConfig.config.firebase.projectId}/messages:send`,
            body,
          );
        }),
      );

      if (promises.some(p => p.status === 'rejected')) {
        throw new AppError(
          'FAILED_TO_CREATE_NOTIFICATION',
          'Failed to send one or more notifications',
        );
      }
    } catch (error: unknown) {
      if (error instanceof AxiosError && error.response) {
        throw new AppError(
          'FAILED_TO_CREATE_NOTIFICATION',
          error.response.statusText,
          error.response.status,
        );
      } else {
        throw error;
      }
    }
  }
}
