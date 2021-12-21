import { Module, MiddlewareConsumer, BadRequestException, RequestMethod } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { NextFunction, Request, Response } from 'express';
import { Tenancy } from './tenancy.entity';
import { TenancyService } from './tenancy.service';
import { TenancyController } from './tenancy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([Tenancy])],
  providers: [TenancyService],
  controllers: [TenancyController],
})
export class TenancyModule {
  constructor(
    private readonly tenantService: TenancyService,
  ) { }

  configure(consumer: MiddlewareConsumer): void {
    consumer
      .apply(async (req: Request, res: Response, next: NextFunction) => {
        const enterprise: string = req.params['tenant'];
        const tenant: Tenancy = await this.tenantService.findOne(enterprise);

        if (!tenant) {
          throw new BadRequestException(
            "Database Connection Error",
            "This tenant doesn't exists",
          );
        }
        next();
      })
      .exclude({ path: '/api/tenancy', method: RequestMethod.ALL })
      .forRoutes('*');
  }
}
