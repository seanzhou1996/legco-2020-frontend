export interface Props {
  className?: string
}

export interface Constituency {
  id: string,
  type: 'gc' | 'fc',
  name: string
}

export interface PoliticalPosition {
  id: string,
  name: string
}
