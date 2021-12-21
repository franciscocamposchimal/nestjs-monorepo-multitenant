import { Module } from '@nestjs/common';
import { AppBaseController } from './app-base.controller';
import { AppBaseService } from './app-base.service';

@Module({
  imports: [],
  controllers: [AppBaseController],
  providers: [AppBaseService],
})
export class AppBaseModule {}
