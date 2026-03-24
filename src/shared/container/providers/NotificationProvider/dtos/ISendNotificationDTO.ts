export interface ISendNotificationDTO {
  deviceIds: Array<string>;
  header: string;
  content: string;
  variables?: Record<string, string>;
}
