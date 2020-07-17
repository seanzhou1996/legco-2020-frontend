import React from 'react';

import ExpanderContext from './context';

export default class ExpanderButton extends React.Component {
  static contextType = ExpanderContext;
  context!: React.ContextType<typeof ExpanderContext>;
  render() {
    return (
      <header className="legco-expander__header" onClick={ this.context.handleClick }>
        <button type="button" className="legco-expander__button">
          { this.props.children }
        </button>
        <i className="legco-expander__icon">
          <DownArrow />
        </i>
      </header>
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
