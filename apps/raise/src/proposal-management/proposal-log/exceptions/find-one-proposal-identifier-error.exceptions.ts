export class FindOneProposalIdentifierError extends Error {
  constructor() {
    super(
      'You must define at least one identifier either log id or proposal id',
    );
  }
}
