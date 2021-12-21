import { Test, TestingModule } from '@nestjs/testing';
import { AppBaseController } from './app-base.controller';
import { AppBaseService } from './app-base.service';

describe('AppBaseController', () => {
  let appBaseController: AppBaseController;

  beforeEach(async () => {
    const app: TestingModule = await Test.createTestingModule({
      controllers: [AppBaseController],
      providers: [AppBaseService],
    }).compile();

    appBaseController = app.get<AppBaseController>(AppBaseController);
  });

  describe('root', () => {
    it('should return "Hello World!"', () => {
      expect(appBaseController.getHello()).toBe('Hello World!');
    });
  });
});
