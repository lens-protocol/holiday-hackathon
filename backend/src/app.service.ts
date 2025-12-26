import { HttpException, Injectable } from '@nestjs/common';

@Injectable()
export class AppService {
  getHealth(): object {
    return { timestamp: new Date() };
  }
}
