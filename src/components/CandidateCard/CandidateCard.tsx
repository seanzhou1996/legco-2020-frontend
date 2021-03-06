import React from 'react';
import classnames from 'classnames';

import './CandidateCard.scss';

import {
  Camp,
  CandidateCardProps
} from 'constants/types';

export default class CandidateCard extends React.Component<CandidateCardProps> {
  colorMap = {
    dem: 'yellow',
    est: 'red',
    ctr: 'dark-grey'
  }
  campMap = {
    dem: '民主派',
    est: '建制派',
    ctr: '中間派'
  }
  getColorFromCampId(camp: Camp | null) {
    return camp ? this.colorMap[camp] : 'green';
  }
  getCampFromId(camp: Camp | null) {
    return camp ? this.campMap[camp] : '';
  }
  render() {
    const {
      id,
      firstCandidate,
      list,
      affiliation,
      camp
    } = this.props;

    const headerText = affiliation || `獨立${this.getCampFromId(camp)}`;
    const name = firstCandidate + (list ? '團隊' : '');
    const captionElem = list ? (
      <div className="candidate-card__caption">
        <span >
          { list.length }人名單
        </span>
      </div>
    ) : null;

    const href = `/candidate/${id}`;

    const headerClass = classnames(
      'candidate-card__header',
      `candidate-card__header--${this.getColorFromCampId(camp)}`
    );
    return (
      <div className="candidate-card">
        <div className={ headerClass }>
          <span>
            { headerText }
          </span>
        </div>
        <a href={ href } className="candidate-card__link">
          <h3 className="candidate-card__name">
            { name }
          </h3>
        </a>
        { captionElem }
      </div>
    );
  }
}
