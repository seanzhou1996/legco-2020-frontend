import {
  Selected,
  Checked
} from 'types';

// We use "all" for political position because it's a real option in the
// select set.
export const selectedDefaults: Selected = {
  constituency_type: '',
  constituency: '',
  political_position: 'all'
}

export const checkedDefaults: Checked = {
  younger_than_36: false,
  fresh_face: false,
  independent: false,
  dem_primary: false
}
