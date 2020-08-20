import React from 'react';
import classnames from 'classnames';
import { Props } from 'types';

import './Listbox.scss';

export interface ListboxProps extends Props {
    id: string, 
    name: string, 
    value: string, 
    onChange: React.ChangeEventHandler<HTMLSelectElement>,
    disabled?: boolean
}

export interface Option extends Props {
  value: string,
  label: string,
}

export default class Listbox extends React.Component<ListboxProps> {
  createOption(value: string, label: string) {
    return <option key={ value } value={ value } >{ label }</option>;
  }
  render() {
    const { className, children, ...selectProps } = this.props;
    const listboxClass = classnames(
      ...(className || '').split(/\s+/g),
      'legco-listbox'
    );
    return (
      <div className={ listboxClass }>
        <select {...selectProps} className="legco-select">
          { children }
        </select>
      </div>
    );
  }
}
