import React from 'react';

import Checkbox from './Checkbox';

import './ListOfCheckboxes.scss';

export interface ListOfCheckboxesProps {
  checkboxes: {
    id: string,
    name: string,
    label: string,
    checked: boolean,
    onCheckboxChange: (event: React.ChangeEvent<HTMLInputElement>) => void  
  }[]
}

class ListOfCheckboxes extends React.Component<ListOfCheckboxesProps> {
  render() {
    const checkboxItems = this.props.checkboxes.map(checkbox => {
      return (
        <li key={ checkbox.id } className="legco-checkboxes__item">
          <Checkbox 
            id={ checkbox.id } 
            name={ checkbox.name } 
            label={ checkbox.label }
            checked={ checkbox.checked }
            onChange={ checkbox.onCheckboxChange } />
        </li>
      );
    });
    return (
      <ul className="legco-checkboxes">
        { checkboxItems }
      </ul>
    );
  }
}

export default ListOfCheckboxes;