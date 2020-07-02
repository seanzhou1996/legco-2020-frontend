interface _CandidatePartial {
  id: string,
  type: string,
  constituencyId: string,
  politicalParty: string
}

export interface Candidate extends _CandidatePartial {
  name: string,
  type: 'candidate'
}

export interface PartyList extends _CandidatePartial {
  firstCandidate: string,
  otherCandidates: string[],
  type: 'list'
}
