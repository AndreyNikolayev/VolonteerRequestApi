import { Module } from '@nestjs/common';
import { UniSenderApiClient } from './service/unisender/unisender-api.client';
import { HttpModule } from '@nestjs/axios';
import { ConfigService } from '@nestjs/config';
import { FileStorageService } from './service/file-storage/file-storage.service';

const services = [UniSenderApiClient, FileStorageService];

@Module({
  imports: [HttpModule],
  providers: [
    {
      provide: 'UNISENDER_API_TOKEN',
      useFactory: (configService: ConfigService) => {
        return configService.get<string>('UNISENDER_API_TOKEN');
      },
      inject: [ConfigService],
    },
    {
      provide: 'AWS_BUCKET_NAME',
      useFactory: (configService: ConfigService) => {
        return configService.get<string>('AWS_BUCKET_NAME');
      },
      inject: [ConfigService],
    },
    ...services,
  ],
  exports: [...services],
})
export class CommonModule {}
