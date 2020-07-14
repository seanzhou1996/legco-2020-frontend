import React from 'react';

import './Expander.scss';

import DownArrow from './DownArrow';

interface ExpanderProps {
  // Title of the expander item
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
    const expanderClass = [
        'legco-expander',
        this.state.expanded ? 'legco-expander--expanded' : null
      ]
      .join(' ')
      .trim();

    return (
      <div className={ expanderClass }>
        <header className="legco-expander__header" onClick={ this.handleClick }>
          <button type="button" className="legco-expander__button">
            { this.props.title }
          </button>
          <i className="legco-expander__icon">
            <DownArrow />
          </i>
        </header>
        <div className="legco-expander__content">
          { this.props.children }
        </div>
      </div>
    );
  }
}

export default Expander;