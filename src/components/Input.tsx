import React from 'react';
import classnames from 'classnames';

import './Input.scss';

import { Props } from '../models';

interface InputProps extends Props {
  type?: 'text' | 'number',
  name?: string,
  id?: string,
  value?: string,
  placeholder?: string,
  onChange?: React.ChangeEventHandler,
  onFocus?: React.FocusEventHandler,
  onBlur?: React.FocusEventHandler
}

class Input extends React.Component<InputProps> {
  static defaultProps: InputProps = {
    type: 'text'
  }
  render() {
    const inputClass = classnames(
      ...(this.props.className || '').split(/\s+/g),
      'legco-input'
    );
    return (
      <input 
        className={ inputClass }
        type={ this.props.type } 
        name={ this.props.name }
        id={ this.props.id }
        value={ this.props.value }
        placeholder={ this.props.placeholder || '' }
        onChange={ this.props.onChange }
        onFocus={ this.props.onFocus }
        onBlur={ this.props.onBlur } />
    );
  }
}

export default Input;