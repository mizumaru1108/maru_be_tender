import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { TenderProposalFlowsService } from './tender-proposal-flows.service';
import { CreateTenderProposalFlowDto } from './dto/create-tender-proposal-flow.dto';
import { UpdateTenderProposalFlowDto } from './dto/update-tender-proposal-flow.dto';

@Controller('tender-proposal-flows')
export class TenderProposalFlowsController {
  constructor(private readonly tenderProposalFlowsService: TenderProposalFlowsService) {}

  @Post()
  create(@Body() createTenderProposalFlowDto: CreateTenderProposalFlowDto) {
    return this.tenderProposalFlowsService.create(createTenderProposalFlowDto);
  }

  @Get()
  findAll() {
    return this.tenderProposalFlowsService.findAll();
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tenderProposalFlowsService.findOne(+id);
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() updateTenderProposalFlowDto: UpdateTenderProposalFlowDto) {
    return this.tenderProposalFlowsService.update(+id, updateTenderProposalFlowDto);
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tenderProposalFlowsService.remove(+id);
  }
}
