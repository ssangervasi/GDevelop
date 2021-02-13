// @flow
import clamp from 'lodash/clamp';

export const shortenString = (str: string, maxLength: number) => {
  return str.length > maxLength ? str.substring(0, maxLength) + '...' : str;
};

/**
 * parseFloatSafe parses a string to a number that is never Nan or Infinity.
 * If the numer would be NaN, it is returned as zero.
 * Negative/positive Infinity is clamped to the min/max safe JS integer.
 */
export const parseFloatSafe = (str?: string): number => {
  const parsed = Number.parseFloat(str);
  if (Number.isNaN(parsed)) {
    return 0;
  }
  return clamp(parsed, Number.MIN_SAFE_INTEGER, Number.MAX_SAFE_INTEGER);
};
