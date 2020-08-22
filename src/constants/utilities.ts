import { DateTime } from 'luxon';
import {
  SelectType,
  CheckboxId,
  Filter,
  ConstituencyTypeMap,
  CheckboxSet,
  SelectSet,
  Constituency
} from 'constants/types';

import Remote from 'Remote';

const selectTypes = [
  'constituency_type',
  'constituency',
  'political_position'
];

const checkboxIds = [
  'younger_than_36',
  'dem_primary',
  'fresh_face',
  'independent'  
];

const filters = [
  ...selectTypes,
  ...checkboxIds
];

/**
 * Type guard to check if an variable is not undefined.
 * 
 * @param x has type `T` or `undefined`.
 */
export function notUndefined<T>(x: T | undefined): x is T {
  return x !== undefined;
}

/**
 * Type guard to check if a string is `SelectType`.
 * 
 * @param x has type `string` or `SelectType`.
 */
export function isSelectType(x: SelectType | string): x is SelectType {
  return selectTypes.includes(x);
}

export function isCheckboxId(x: CheckboxId | string): x is CheckboxId {
  return checkboxIds.includes(x);
}

export function isFilter(x: Filter | string): x is Filter {
  return filters.includes(x);
}

/**
 * Calculate age from date of birth.
 * 
 * @param dob Date of birth in "yyyy-mm-dd" format.
 */
export function calculateAge(dob: string): number {
  const then = DateTime.fromISO(dob);
  const now = DateTime.local();
  return Math.floor(now.diff(then, 'years').years);
}

export const getConstituencies = () => Remote.getConstituencies();
export const getCandidates = () => Remote.getCandidates();
export const getCandidateInfoList = () => Remote.getCandidateInfoList();

export function getConstituencyTypeMap(
  constituencies: Constituency[]
) {
  const constituencyTypeMap: ConstituencyTypeMap = 
    constituencies.reduce((prev, current) => {
      return {
        ...prev,
        [current.id]: current.type
      }
    }, {});

  return constituencyTypeMap;
}

export function getCheckboxSet() {
  const checkboxSet: CheckboxSet = [
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

  return checkboxSet;
}

export function getSelectSet(
  constituencies: Constituency[]
) {
  const selectSet: SelectSet = {
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
    constituency: constituencies.map(obj => ({
      id: obj.id,
      name: obj.name
    })),
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

  return selectSet;
}
