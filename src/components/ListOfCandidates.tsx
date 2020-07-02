import React from 'react';
import PartyListCard from './PartyListCard';
import CandidateCard from './CandidateCard';

import { Candidate, PartyList } from '../models';

interface ListOfCandidatesProps {
  // A "candidate" can be either a single candidate or a party list
  candidates: (Candidate | PartyList)[]
}

class ListOfCandidates extends React.Component<ListOfCandidatesProps> {
  render() {
    let items = this.props.candidates.map(obj => {
      // Inner element of the current list item
      let innerElem: JSX.Element;
      // `Candidate` and `PartyList` have different `type` values
      switch (obj.type) {
        case 'list': {
          innerElem = (
            <PartyListCard 
              firstCandidate={ obj.firstCandidate }
              otherCandidates={ obj.otherCandidates }
              politicalParty={ obj.politicalParty } />
          );
          break;
        }
        case 'candidate': {
          innerElem = (
            <CandidateCard 
              name={ obj.name }
              politicalParty={ obj.politicalParty } />
          );
          break;
        }
        default: {
          // TODO: add some error handling
          throw Error('Unknown candidate type.');
        }
      }
      return (
        <li key={ obj.id } className="candidates__item">
          { innerElem }
        </li>
      );
    });
    return (
      <ul className="candidates__list">
        { items }
      </ul>
    );
  }
}

export default ListOfCandidates;