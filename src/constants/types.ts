export interface Props {
  className?: string
}

export type ConstituencyType = 'gc' | 'fc';
export type ConstituencyTypeMap = Record<string, ConstituencyType>;

export type SelectType = 
  'constituencyType' | 
  'constituency' | 
  'camp';
export type CheckboxId = 
  'youngerThan36' |
  'inPrimary' |
  'freshFace' |
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
  names: string | string[],
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
export type CheckboxSet = CheckboxOption[];

export interface PersonalInfo {
  id: string,
  name: string,
  dob: string,
  inPrimary: boolean,
  freshFace: boolean,
  camp: 'dem' | 'est' | 'ctr',
  affiliation: string | null
}
export type CandidateInfoMap = Record<string, PersonalInfo>;
