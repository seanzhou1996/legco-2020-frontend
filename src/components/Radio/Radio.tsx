import React from 'react';
import classnames from 'classnames';

import './Radio.scss';

export interface RadioProps {
  size?: 'small',
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
      size, // [1]
      label, // [2]
      ...inputProps // [3]
    } = this.props;

    const radioClass = classnames(
      'legco-radio',
      size === 'small' ? 'legco-radio--small' : null,
    );
    return (
      <div className={ radioClass }>
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