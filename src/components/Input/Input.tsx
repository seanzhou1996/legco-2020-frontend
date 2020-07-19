import React from 'react';
import classnames from 'classnames';

import './Input.scss';

import { Props } from '../../models';

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
      <input {...this.props} className={ inputClass } />
    );
  }
}

export default Input;