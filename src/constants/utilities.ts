import { DateTime } from 'luxon';
import {
  SelectType,
  CheckboxId,
  Filter,
  ConstituencyTypeMap,
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

export function getFullSelectSet(
  selectSet: SelectSet,
  constituencies: Constituency[]
): SelectSet {
  return {
    ...selectSet,
    constituency: constituencies.map(obj => {
      return {
        id: obj.id,
        name: obj.name
      }
    })
  };
}
