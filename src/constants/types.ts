import { ChangeEventHandler } from "react";

export interface ClassList {
  classList?: (string | null)[]
}

export type ConstituencyType = 'gc' | 'fc';
export type ConstituencyTypeMap = Record<string, ConstituencyType>;

export type SelectType = 'constituencyType' 
                         | 'constituency' 
                         | 'camp';
export type CheckboxId = 'youngerThan36' 
                         | 'inPrimary' 
                         | 'freshFace' 
                         | 'independent';
export type Camp = 'dem' 
                   | 'est' 
                   | 'ctr';
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
  name: string
}
export type Checked = Record<CheckboxId, boolean>;
export type CheckboxSet = CheckboxOption[];

export interface PersonalInfo {
  id: string,
  name: string,
  dob: string,
  inPrimary: boolean,
  freshFace: boolean,
  camp: Camp | null,
  affiliation: string | null
}
export type PersonalInfoMap = Record<string, PersonalInfo>;

export type KeywordChangeHandler = ChangeEventHandler<HTMLInputElement>;
export type CheckboxChangeHandler = (id: CheckboxId) => void;
export type SelectChangeHandler = (type: SelectType, value: string) => void;

export interface SearchBoxProps {
  keyword: string,
  handleKeywordChange: KeywordChangeHandler
}

export interface FiltersListProps {
  selected: Selected,
  checked: Checked,
  constituencies: Constituency[],
  handleSelectChange: SelectChangeHandler,
  handleCheckboxChange: CheckboxChangeHandler,
}

export interface ActiveFiltersProps {
  selected: Selected,
  checked: Checked,
  constituencies: Constituency[],
  handleSelectChange: SelectChangeHandler,
  handleCheckboxChange: CheckboxChangeHandler,
}

export interface CandidateCardProps {
  id: string,
  firstCandidate: string,
  list: string[] | null,
  affiliation: string | null,
  camp: Camp | null
}

export interface HomePageState {
  keyword: string,
  checked: Checked,
  selected: Selected,
  resourceFetched: boolean,
  showFiltersPanel: boolean
}
