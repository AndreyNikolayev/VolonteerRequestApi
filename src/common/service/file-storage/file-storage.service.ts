import { Inject, Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { v4 as uuid } from 'uuid';
import { FileUploadResult } from './dto/file-upload-result';

@Injectable()
export class FileStorageService {
  constructor(@Inject('AWS_BUCKET_NAME') private bucketName: string) {}

  async upload(
    dataBuffer: Buffer,
    filename: string,
  ): Promise<FileUploadResult> {
    const s3 = new S3();
    const uploadResult = await s3
      .upload({
        Bucket: this.bucketName,
        Body: dataBuffer,
        Key: `${uuid()}-${filename}`,
        ACL: 'public-read',
      })
      .promise();

    return new FileUploadResult(uploadResult.Key, uploadResult.Location);
  }

  async delete(fileKey: string) {
    const s3 = new S3();
    await s3
      .deleteObject({
        Bucket: this.bucketName,
        Key: fileKey,
      })
      .promise();
  }
}
