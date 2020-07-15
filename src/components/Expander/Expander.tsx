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

function DownArrow() {
  return (
    <svg 
      version="1.1" viewBox="0 0 1024 1024" xmlns="http://www.w3.org/2000/svg" 
      aria-hidden="true" 
      focusable="false">
        <path d="m225.84 414.16l256 256c16.683 16.683 43.691 16.683 60.331 0l256-256c16.683-16.683 16.683-43.691 0-60.331s-43.691-16.683-60.331 0l-225.84 225.84-225.84-225.84c-16.683-16.683-43.691-16.683-60.331 0s-16.683 43.691 0 60.331z"></path>
    </svg>
  );
}

export default Expander;