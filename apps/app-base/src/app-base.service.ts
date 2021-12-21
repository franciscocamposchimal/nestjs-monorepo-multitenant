import { Injectable } from '@nestjs/common';

@Injectable()
export class AppBaseService {
  getHello(): string {
    return 'Hello World!';
  }
}
