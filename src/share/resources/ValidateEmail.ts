import { PipeTransform, Injectable, BadRequestException } from '@nestjs/common';

@Injectable()
export class ValidateEmail implements PipeTransform<string, string> {
  transform(value: string): string {
    const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/;
    if (!value || !value.match(emailRegex)) {
      throw new BadRequestException('Invalid email address');
    }
    return value;
  }
}