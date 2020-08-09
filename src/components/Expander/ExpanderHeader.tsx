import React from 'react';
import classnames from 'classnames';
import { Props } from 'models';

import ExpanderContext from './context';

export interface ExpanderHeaderProps extends Props {
}

export interface ExpanderLabelProps extends Props {

}

export default class ExpanderHeader extends React.Component {
  static contextType = ExpanderContext;
  context!: React.ContextType<typeof ExpanderContext>;
  render() {
    return (
      <header className="legco-expander__header" onClick={ this.context.handleClick }>
        { this.props.children }
        <i className="legco-expander__icon">
          <DownArrow />
        </i>
      </header>
    );
  }
}

export class ExpanderButton extends React.Component {
  render() {
    return (
      <button type="button" className="legco-expander__button">
        { this.props.children }
      </button>
    );
  }
}

export class ExpanderLabel extends React.Component<ExpanderLabelProps> {
  render() {
    const labelClass = classnames(
      ...(this.props.className || '').split(/\s+/g),
      'legco-expander__header-label'
    )
    return (
      <span className={ labelClass }>
        { this.props.children }
      </span>
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
