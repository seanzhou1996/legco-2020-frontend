import React from 'react';

interface CandidateCardProps {
  // Name of the candidate
  name: string,
  // Title to be displayed above the candidate name. Defaults to
  // "Candidate" if not specified.
  title?: string,
  politicalParty: string
}

class CandidateCard extends React.Component<CandidateCardProps> {
  render() {
    return (
      <div className="candidate-card">
        <a href="/">
          <span className="candidate-card__title">{ this.props.title || 'Candidate' }</span>
          <h4 className="candidate-card__name">{ this.props.name }</h4>
          {
            /**
             * Additional information shows up here. Note this is inside the anchor tag so
             * it forms part of the link.
             */
          }
          { this.props.children }
        </a>
        <a href="/" className="candidate-card__footer">
          { this.props.politicalParty }
        </a>
      </div>
    );
  }
}

export default CandidateCard;