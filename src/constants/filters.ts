import {
  SelectSet,
  CheckboxSet
} from 'constants/types';

export const partialSelectSet: SelectSet = {
  constituency_type: [
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
  political_position: [
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
    }
  ]
};

export   const checkboxSet: CheckboxSet = [
  {
    id: 'younger_than_36', 
    name: '35嵗及以下候選人',
    group: 'age'
  },
  {
    id: 'dem_primary',
    name: '參與民主派初選',
    group: 'other_info'
  },
  {
    id: 'fresh_face',
    name: '首次參選立法會',
    group: 'other_info'
  },
  {
    id: 'independent',
    name: '無政黨背景',
    group: 'other_info'
  }
];
