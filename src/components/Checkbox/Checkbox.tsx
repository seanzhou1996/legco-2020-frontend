import React from 'react';
import classnames from 'classnames';

import { Props } from '../../models';

import './Checkbox.scss';

export interface CheckboxProps extends Props {
  id: string,
  name: string,
  label: string,
  checked: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>
}

class Checkbox extends React.Component<CheckboxProps> {
  render() {
    const { className, label, ...inputProps } = this.props;
    const checkboxClass = classnames(
      ...(className || '').split(/\s+/g),
      'legco-checkbox'
    );
    return (
      <div className={ checkboxClass }>
        <input 
          className="legco-checkbox__input"
          type="checkbox" 
          {...inputProps} />
        <label className="legco-checkbox__label" htmlFor={ inputProps.id }>
          { label }
        </label>
      </div>
    );
  }
}

export default Checkbox;