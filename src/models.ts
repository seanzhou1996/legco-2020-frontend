export interface Props {
  className?: string
}

export type ConstituencyType = 'gc' | 'fc'

export interface Constituency {
  id: string,
  type: ConstituencyType,
  name: string
}

export interface ConstituencyTypeMap {
  [constituencyId: string]: ConstituencyType
}

export interface Candidate {
  id: string,
  label: string,
  candidates: string,
  constituencyId: string
}

export interface PoliticalPosition {
  id: string,
  name: string
}
