import {
  Selected,
  Checked
} from 'constants/types';

// We use "all" for political position because it's a real option in the
// select set.
export const selectedDefaults: Selected = {
  constituencyType: 'all',
  constituency: 'all',
  camp: 'all'
}

export const checkedDefaults: Checked = {
  youngerThan36: false,
  freshFace: false,
  independent: false,
  inPrimary: false
}
