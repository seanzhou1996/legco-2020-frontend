import React from 'react';
import classNames from 'classnames';

import './Expander.scss';

import { ClassList as ExpanderProps } from 'constants/types';

import ExpanderContext from './context';

interface ExpanderState {
  expanded: boolean
}

export default class Expander extends React.Component<ExpanderProps, ExpanderState> {
  constructor(props: ExpanderProps) {
    super(props);
    this.handleClick = this.handleClick.bind(this);
    this.state = {
      expanded: false
    }
  }
  handleClick() {
    this.setState(prevState => {
      return {
        expanded: !prevState.expanded
      }
    });
  }
  render() {
    const expanderClass = classNames(
      ...(this.props.classList || []),
      'legco-expander',
      { 'legco-expander--expanded': this.state.expanded }
    );

    return (
      <ExpanderContext.Provider value={ { handleClick: this.handleClick } }>
        <div className={ expanderClass }>
          { this.props.children }
        </div>
      </ExpanderContext.Provider>
    );
  }
}
