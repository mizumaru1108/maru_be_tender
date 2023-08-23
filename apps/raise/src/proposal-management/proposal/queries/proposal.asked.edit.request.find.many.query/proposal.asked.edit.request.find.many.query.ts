import { IQueryHandler, QueryHandler } from '@nestjs/cqrs';
import { ApiProperty } from '@nestjs/swagger';
import { ProposalAskedEditRequestEntity } from '../../../asked-edit-request/entities/proposal.asked.edit.request.entity';
import { ProposalAskedEditRequestRepository } from '../../../asked-edit-request/repositories/proposal.asked.edit.request.repository';

export class ProposalAskedEditRequestFindManyQuery {
  supervisor_id?: string;
  supervisor_track_id?: string;
  employee_name?: string;
  project_name?: string;
  status?: string[];
  limit?: number;
  page?: number;
  sort_by?: string;
  sort_direction?: string;
  include_relations?: string[];
}

export class ProposalAskedEditRequestFindManyQueryResult {
  @ApiProperty()
  result: ProposalAskedEditRequestEntity[];
  @ApiProperty()
  total: number;
}

@QueryHandler(ProposalAskedEditRequestFindManyQuery)
export class ProposalAskedEditRequestFindManyQueryHandler
  implements
    IQueryHandler<
      ProposalAskedEditRequestFindManyQuery,
      ProposalAskedEditRequestFindManyQueryResult
    >
{
  constructor(
    private readonly askedEditRequestRepo: ProposalAskedEditRequestRepository,
  ) {}

  async execute(
    query: ProposalAskedEditRequestFindManyQuery,
  ): Promise<ProposalAskedEditRequestFindManyQueryResult> {
    // console.log({ query });
    const result = await this.askedEditRequestRepo.findMany({
      ...query,
    });

    const total = await this.askedEditRequestRepo.countMany({ ...query });
    return {
      result,
      total,
    };
  }
}
