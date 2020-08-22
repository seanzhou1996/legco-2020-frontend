export interface Props {
  className?: string
}

export type ConstituencyType = 'gc' | 'fc';
export type ConstituencyTypeMap = Record<string, ConstituencyType>;

export type SelectType = 
  'constituency_type' | 
  'constituency' | 
  'political_position';
export type CheckboxId = 
  'younger_than_36' |
  'dem_primary' |
  'fresh_face' |
  'independent';
export type Filter = SelectType | CheckboxId;

export interface Constituency {
  id: string,
  type: ConstituencyType,
  name: string
}

export interface Candidate {
  id: string,
  label: string,
  candidate?: string,
  list?: string[],
  constituencyId: string
}

export interface SelectOption {
  id: string,
  name: string
}
export type Selected = Record<SelectType, string>;
export type SelectSet = Record<SelectType, SelectOption[]>;

export interface CheckboxOption {
  id: CheckboxId,
  name: string,
  group: string
}
export type Checked = Record<CheckboxId, boolean>;

export interface CandidateInfo {
  id: string,
  dob: string,
  dem_primary: boolean,
  fresh_face: boolean,
  independent: boolean,
  political_position: string
}
export type CandidateInfoMap = Record<string, CandidateInfo>;
