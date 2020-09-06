import React from 'react';
import classnames from 'classnames';

import './Checkbox.scss';

export interface CheckboxProps {
  id: string,
  name: string,
  label: string,
  checked: boolean,
  onChange: React.ChangeEventHandler<HTMLInputElement>,
  size?: 'small',
}

class Checkbox extends React.Component<CheckboxProps> {
  render() {
    const { size, label, ...inputProps } = this.props;
    const checkboxClass = classnames(
      'legco-checkbox',
      size === 'small' ? 'legco-checkbox--small' : null,
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