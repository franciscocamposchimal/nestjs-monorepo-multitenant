import { Controller, Get } from '@nestjs/common';
import { AppBaseService } from './app-base.service';

@Controller()
export class AppBaseController {
  constructor(private readonly appBaseService: AppBaseService) {}

  @Get()
  getHello(): string {
    return this.appBaseService.getHello();
  }
}
