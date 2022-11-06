import { Test, TestingModule } from '@nestjs/testing';
import { TenderEmployeeService } from './tender-employee.service';

describe('TenderEmployeeService', () => {
  let service: TenderEmployeeService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [TenderEmployeeService],
    }).compile();

    service = module.get<TenderEmployeeService>(TenderEmployeeService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
