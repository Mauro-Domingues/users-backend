export interface IStorageProvider {
  saveFile(file: string): Promise<void>;
  deleteFile(file: string): Promise<void>;
}
