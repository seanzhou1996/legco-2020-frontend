import React from 'react';
import {
  SelectType,
  Selected,
  CheckboxId,
  Checked,
  Candidate,
  Constituency
} from 'constants/types';
import {
  selectedDefaults,
  checkedDefaults
} from 'constants/defaults';

export interface FinderContextValue {
  candidates: Candidate[],
  constituencies: Constituency[],
  selected: Selected,
  checked: Checked,
  updateSelectedState: (type: SelectType, value: string) => void,
  updateCheckedState: (id: CheckboxId) => void
}

const defaultContext: FinderContextValue = {
  candidates: [],
  constituencies: [],
  selected: selectedDefaults,
  checked: checkedDefaults,
  updateSelectedState: () => {},
  updateCheckedState: () => {}
}

export default React.createContext(defaultContext);
