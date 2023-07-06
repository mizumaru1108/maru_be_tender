export class ProposalNotFoundException extends Error {
  constructor(id?: string) {
    super(
      id ? `Proposal with id of ${id} can't be found!` : 'Proposal Not Found!',
    );
  }
}
