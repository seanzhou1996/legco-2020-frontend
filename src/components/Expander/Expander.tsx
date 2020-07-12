import React from 'react';

import './Expander.scss';

import UpArrow from './UpArrow';
import DownArrow from './DownArrow';

interface ExpanderProps {
  title: string
}

interface ExpanderState {
  expanded: boolean
}

class Expander extends React.Component<ExpanderProps, ExpanderState> {
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
    const expanderClassList = [
      'legco-expander'
    ];
    if (this.state.expanded) {
      expanderClassList.push('legco-expander--expanded');
    }
    return (
      <div className={ expanderClassList.join(' ') }>
        <header className="legco-expander__header" onClick={ this.handleClick }>
          <button type="button" className="legco-expander__button">
            { this.props.title }
          </button>
          { this.state.expanded ? <UpArrow /> : <DownArrow /> }
        </header>
        <div className="legco-expander__content">
          { this.props.children }
        </div>
      </div>
    )
  }
}

export default Expander;