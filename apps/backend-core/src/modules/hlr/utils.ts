import { padString } from '@cell-mon/utils';

export function getCellTechnology({
  on4G,
  mnc,
}: {
  on4G: boolean;
  mnc: string;
}) {
  if (on4G) {
    return 'LTE';
  }

  const is2G = ['01', '99'].includes(padString(mnc, 2));
  //   520 00 CAT 3G
  //   520 01 AIS 2G
  //   520 99 True 2G
  //   2G 16 bit
  //   3G 28 bit
  if (is2G) {
    return 'GSM';
  }

  return 'WCDMA';
}
