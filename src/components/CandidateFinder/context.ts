import React from 'react';
import {
  SelectType,
  Selected,
  SelectSet,
  CheckboxId,
  Checked,
  CheckboxOption,
  Constituency
} from 'types';
import {
  selectedDefaults,
  checkedDefaults
} from 'defaults';

export interface FinderContextValue {
  constituencies: Constituency[],
  selected: Selected,
  checked: Checked,
  selectSet: SelectSet,
  checkboxOptions: CheckboxOption[],
  updateSelectedState: (type: SelectType, value: string) => void,
  updateCheckedState: (id: CheckboxId) => void
}

const defaultContext: FinderContextValue = {
  constituencies: [],
  selected: selectedDefaults,
  checked: checkedDefaults,
  selectSet: {
    constituency_type: [],
    constituency: [],
    political_position: []
  },
  checkboxOptions: [],
  updateSelectedState: () => {},
  updateCheckedState: () => {}
}

export default React.createContext(defaultContext);
