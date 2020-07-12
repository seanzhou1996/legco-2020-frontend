import React from 'react';

import './Checkbox.scss';

export interface CheckboxProps {
  id: string,
  name: string,
  label: string,
  checked: boolean,
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void
}

class Checkbox extends React.Component<CheckboxProps> {
  render() {
    return (
      <div className="legco-checkbox">
        <input 
          className="legco-checkbox__input"
          type="checkbox" 
          name={ this.props.name } 
          id={ this.props.id } 
          checked={ this.props.checked }
          onChange={ this.props.onChange } />
        <label className="legco-checkbox__label" htmlFor={ this.props.id }>
          { this.props.label }
        </label>
      </div>
    );
  }
}

export default Checkbox;