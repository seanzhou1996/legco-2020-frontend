export interface Constituency {
  id: string,
  type: 'gc' | 'fc',
  name: string
}

export interface PoliticalPosition {
  id: 'dem' | 'est' | 'center' | 'unclear',
  name: string
}
