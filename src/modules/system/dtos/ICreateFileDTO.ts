export interface ICreateFileDTO {
  folderId: string;
  files: Array<{
    name: string;
    file: string;
  }>;
}
