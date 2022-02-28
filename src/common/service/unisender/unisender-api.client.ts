import { HttpService } from '@nestjs/axios';
import { lastValueFrom, map } from 'rxjs';
import { Inject, Injectable } from '@nestjs/common';
import { SendSingleEmailDto } from './dto/send-single-email.dto';

@Injectable()
export class UniSenderApiClient {
  constructor(
    private httpClient: HttpService,
    @Inject('UNISENDER_API_TOKEN') private apiKey: string,
  ) {}

  async sendSingleEmail(requestDto: SendSingleEmailDto): Promise<any> {
    const { email, sender, senderName, subject, body } = requestDto;

    const params = new URLSearchParams({
      format: 'json',
      api_key: this.apiKey,
      sender_name: senderName,
      sender_email: sender,
      list_id: '1',
      email,
      subject,
      body,
    });

    const request = `https://api.unisender.com/ru/api/sendEmail?${params.toString()}`;

    const response$ = this.httpClient
      .post(request)
      .pipe(map((response) => response.data));

    const result = await lastValueFrom(response$);

    if (result.error) {
      throw new Error('Cannot process request');
    }

    return result;
  }
}
