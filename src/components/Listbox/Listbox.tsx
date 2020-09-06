import React from 'react';

import './Listbox.scss';

export interface ListboxProps {
    id: string, 
    name: string, 
    value: string, 
    onChange: React.ChangeEventHandler<HTMLSelectElement>,
    disabled?: boolean
}

export interface Option {
  value: string,
  label: string,
}

export default class Listbox extends React.Component<ListboxProps> {
  createOption(value: string, label: string) {
    return <option key={ value } value={ value } >{ label }</option>;
  }
  render() {
    const {children, ...selectProps } = this.props;
    return (
      <div className="legco-listbox">
        <select {...selectProps} className="legco-select">
          { children }
        </select>
      </div>
    );
  }
}
