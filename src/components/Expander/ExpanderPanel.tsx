import React from 'react';

export default class ExpanderPanel extends React.Component {
  render() {
    return (
      <div className="legco-expander__content">
        { this.props.children }
      </div>
    );
  }
}
