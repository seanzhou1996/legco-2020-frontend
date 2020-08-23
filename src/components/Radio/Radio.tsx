import React from 'react';
import classnames from 'classnames';

import { Props } from 'constants/types';

import './Radio.scss';

export interface RadioProps extends Props {
  id: string,
  name: string,
  label: string,
  checked: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

class Radio extends React.Component<RadioProps> {
  render() {
    // [1] forms part of the container class list,
    // [2] is the label text, and
    // [3] is props for the input element.
    const {
      className, // [1]
      label, // [2]
      ...inputProps // [3]
    } = this.props;

    const checkboxClass = classnames(
      ...(className || '').split(/\s+/g),
      'legco-radio'
    );
    return (
      <div className={ checkboxClass }>
        <input 
          className="legco-radio__input"
          type="radio" 
          {...inputProps} />
        <label className="legco-radio__label" htmlFor={ inputProps.id }>
          { label }
        </label>
      </div>
    );
  }
}

export default Radio;