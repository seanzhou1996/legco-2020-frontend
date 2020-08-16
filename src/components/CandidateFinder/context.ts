import React, { ChangeEventHandler } from 'react';
import {
  SelectType,
  Selected,
  SelectSet,
  Checked,
  CheckboxOption,
  Constituency
} from 'models';

export interface FinderContextValue {
  constituencies: Constituency[],
  selected: Selected,
  checked: Checked,
  selectSet: SelectSet,
  checkboxOptions: CheckboxOption[],
  defaultSelects: Selected,
  updateSelectedState: (type: SelectType, value: string) => void,
  updateCheckedState: (id: string) => void
}

const defaultContext: FinderContextValue = {
  constituencies: [],
  selected: {
    constituency_type: '',
    constituency: '',
    political_position: 'all'
  },
  checked: {},
  selectSet: {
    constituency_type: [],
    constituency: [],
    political_position: []
  },
  checkboxOptions: [],
  defaultSelects: {
    constituency_type: '',
    constituency: '',
    political_position: 'all'
  },
  updateSelectedState: () => {},
  updateCheckedState: () => {}
}

export default React.createContext(defaultContext);
