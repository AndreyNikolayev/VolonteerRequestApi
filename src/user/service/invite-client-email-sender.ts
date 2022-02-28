import { ConfigService } from '@nestjs/config';
import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

@Injectable()
export class InviteClientEmailSender {
  constructor(private readonly configService: ConfigService) {}

  async send(email: string, password: string): Promise<void> {
    const domain = this.configService.get<string>('APP_URL');
    const body = `Тебе було запрошено до системи волонтерських запитів <a href="${domain}">Лінк</a>
    <br>Твій пароль: ${password}`;
    const senderEmail = this.configService.get<string>('SENDER_EMAIL');
    const senderPassword = this.configService.get<string>('SENDER_PASSWORD');
    const subject = 'Система волонтерських запитів';

    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: senderEmail,
        pass: senderPassword,
      },
    });

    await transporter.sendMail({
      from: senderEmail, // sender address
      to: email, // list of receivers
      subject: subject, // Subject line
      html: body,
    });
  }
}
