import {
  SelectType
} from 'models';

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
  const selectTypes = [
    'constituency_type',
    'constituency',
    'political_position'
  ];
  return selectTypes.includes(x);
}

