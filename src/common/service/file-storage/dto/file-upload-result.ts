export class FileUploadResult {
  key: string;
  url: string;

  constructor(key: string, url: string) {
    this.key = key;
    this.url = url;
  }
}
