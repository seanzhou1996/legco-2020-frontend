import {
  SelectSet,
  CheckboxSet
} from 'constants/types';

export const partialSelectSet: SelectSet = {
  constituencyType: [
    {
      id: 'gc',
      name: '地方選區'
    },
    {
      id: 'fc',
      name: '功能組別選區'
    }  
  ],
  constituency: [],
  camp: [
    {
      id: 'all',
      name: '不限'
    },
    {
      id: 'est',
      name: '建制派'
    },
    {
      id: 'dem',
      name: '民主派'
    },
    {
      id: 'ctr',
      name: '中間派'
    }
  ]
};

export const checkboxSet: CheckboxSet = [
  {
    id: 'youngerThan36', 
    name: '35嵗及以下候選人'
  },
  {
    id: 'inPrimary',
    name: '參與民主派初選'
  },
  {
    id: 'freshFace',
    name: '首次參選立法會'
  },
  {
    id: 'independent',
    name: '無政黨背景'
  }
];
