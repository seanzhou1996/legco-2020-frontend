import React from 'react';

import CandidateCard from './CandidateCard';

interface PartyListCardProps {
  // Name of the first candidate
  firstCandidate: string,
  // Names of the other candidates on the list
  otherCandidates: string[],
  politicalParty: string
}

class PartyListCard extends React.Component<PartyListCardProps> {
  render() {
    return (
      <CandidateCard 
        title="Party list"
        name={ this.props.firstCandidate }
        politicalParty={ this.props.politicalParty }
      >
        {
          /**
           * Count of the other candidates appears next to
           * the name of the first candidate.
           */
        }
        <span>And { this.props.otherCandidates.length } other(s)</span>
      </CandidateCard>
    );
  }
}

export default PartyListCard;