import React, { ChangeEventHandler } from 'react';
import {
  SelectType,
  Selected,
  SelectSet,
  ConstituencyTypeMap,
  Checked,
  CheckboxOption
} from 'models';

export interface FinderContextValue {
  selected: Selected,
  checked: Checked,
  selectSet: SelectSet,
  checkboxOptions: CheckboxOption[],
  defaultSelects: Selected,
  constituencyTypeMap: ConstituencyTypeMap,
  updateSelectedState: (type: SelectType, value: string) => void,
  updateCheckedState: (id: string) => void
}

const defaultContext: FinderContextValue = {
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
  constituencyTypeMap: {},
  updateSelectedState: () => {},
  updateCheckedState: () => {}
}

export default React.createContext(defaultContext);
