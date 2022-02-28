import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';
import { isEmail } from 'class-validator';

@Injectable()
export class ParseEmailPipe implements PipeTransform {
  transform(value: string) {
    if (!isEmail(value)) {
      throw new BadRequestException(
        'Validation failed (email string is expected)',
      );
    }

    return value;
  }
}
