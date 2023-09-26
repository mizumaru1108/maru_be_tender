import { Injectable } from '@nestjs/common';
import {
  beneficiaries,
  payment,
  proposal,
  proposal_item_budget,
} from '@prisma/client';
import { Builder } from 'builder-pattern';
import { ProposalItemBudgetEntity } from '../../item-budget/entities/proposal.item.budget.entity';
import { ProposalEntity } from '../entities/proposal.entity';
import { BeneficiaryEntity } from '../../../beneficiary/entity/beneficiary.entity';

export type ProposalModel = proposal & {
  beneficiary_details?: beneficiaries | null;
  payments?: payment[];
  proposal_item_budgets?: proposal_item_budget[];
};

@Injectable()
export class ProposalMapper {
  async toDomain(type: ProposalModel): Promise<ProposalEntity> {
    const { payments, beneficiary_details, proposal_item_budgets, ...rest } =
      type;

    const proposalBuilder = Builder<ProposalEntity>(ProposalEntity, {
      ...rest,
      amount_required_fsupport:
        rest.amount_required_fsupport !== null
          ? parseFloat(rest.amount_required_fsupport.toString())
          : null,
      whole_budget:
        rest.whole_budget !== null
          ? parseFloat(rest.whole_budget.toString())
          : null,
      number_of_payments:
        rest.number_of_payments !== null
          ? parseFloat(rest.number_of_payments.toString())
          : null,
      partial_support_amount:
        rest.partial_support_amount !== null
          ? parseFloat(rest.partial_support_amount.toString())
          : null,
      fsupport_by_supervisor:
        rest.fsupport_by_supervisor !== null
          ? parseFloat(rest.fsupport_by_supervisor.toString())
          : null,
      number_of_payments_by_supervisor:
        rest.number_of_payments_by_supervisor !== null
          ? parseFloat(rest.number_of_payments_by_supervisor.toString())
          : null,
      execution_time:
        rest.execution_time !== null
          ? parseFloat(rest.execution_time.toString())
          : null,
    });

    if (beneficiary_details) {
      const beneficiary = Builder<BeneficiaryEntity>(
        BeneficiaryEntity,
        beneficiary_details,
      ).build();
      proposalBuilder.beneficiary_detail(beneficiary);
    }

    if (proposal_item_budgets && proposal_item_budgets.length > 0) {
      const itemBudgets: ProposalItemBudgetEntity[] = [];
      for (const rawItemBudget of proposal_item_budgets) {
        itemBudgets.push(
          Builder<ProposalItemBudgetEntity>(ProposalItemBudgetEntity, {
            ...rawItemBudget,
            amount: parseFloat(rawItemBudget.amount.toString()),
          }).build(),
        );
      }
      proposalBuilder.proposal_item_budgets(itemBudgets);
    }

    return proposalBuilder.build();
  }

  async toDomainList(model: ProposalModel[]): Promise<ProposalEntity[]> {
    const list = model.map(async (item) => {
      const entity = await this.toDomain(item);
      return entity;
    });

    return Promise.all(list);
  }
}
