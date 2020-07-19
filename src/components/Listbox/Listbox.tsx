import React from 'react';
import classnames from 'classnames';
import { Props } from '../../models';

import './Listbox.scss';

interface ListboxProps extends Props {
  selectProps: {
    id: string, 
    name: string, 
    value: string, 
    onChange: (event: React.ChangeEvent<HTMLSelectElement>) => void,
    disabled?: boolean
  },
  choices: Option[]
}

interface Option extends Props {
  value: string,
  label: string,
}

export default class Listbox extends React.Component<ListboxProps> {
  createOption(value: string, label: string) {
    return <option key={ value } value={ value } >{ label }</option>;
  }
  render() {
    const listboxClass = classnames(
      ...(this.props.className || '').split(/\s+/g),
      'legco-listbox'
    );
    const options = this.props.choices.map(obj => this.createOption(obj.value, obj.label));
    return (
      <div className={ listboxClass }>
        <select className="legco-select" {...this.props.selectProps}>
          { options }
        </select>
      </div>
    );
  }
}
