import { Test, TestingModule } from '@nestjs/testing';
import { TenderEmployeeService } from '../services/tender-employee.service';
import { TenderEmployeeController } from './tender-employee.controller';

describe('TenderEmployeeController', () => {
  let controller: TenderEmployeeController;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [TenderEmployeeController],
      providers: [TenderEmployeeService],
    }).compile();

    controller = module.get<TenderEmployeeController>(TenderEmployeeController);
  });

  it('should be defined', () => {
    expect(controller).toBeDefined();
  });
});
