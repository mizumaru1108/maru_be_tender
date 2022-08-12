import { Injectable } from '@nestjs/common';
import { CreateDonorInfoDto } from './dto/create-donor-info.dto';

@Injectable()
export class DonorInfoService {
  create(createDonorInfoDto: CreateDonorInfoDto) {
    return 'This action adds a new donorInfo';
  }

  findAll() {
    return `This action returns all donorInfo`;
  }

  findOne(id: number) {
    return `This action returns a #${id} donorInfo`;
  }

  update(id: number, updateDonorInfoDto: CreateDonorInfoDto) {
    return `This action updates a #${id} donorInfo`;
  }

  remove(id: number) {
    return `This action removes a #${id} donorInfo`;
  }
}
