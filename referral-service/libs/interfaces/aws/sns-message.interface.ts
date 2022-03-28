export interface SnsMessage<T> {
  service: string;
  command: string;
  message: T;
}
