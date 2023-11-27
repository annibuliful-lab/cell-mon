import { exit } from 'process';
import { prismaDbClient } from '../../../libs/db/src';
import mcc_mnc_list from 'mcc-mnc-list';

async function main() {
  const operators = mcc_mnc_list.all();
  //   console.log('all', operators);

  for (const operator of operators) {
    console.log('aaa', operator);

    await prismaDbClient.phoneOperator.upsert({
      update: {
        technology: operator.bands?.split(' / ') ?? [''],
        brand: operator.brand ?? 'Unknown',
        operator: operator.operator ?? 'Unknown',
        country: operator.countryName ?? 'Unknown',
        countryCode: operator.countryCode ?? 'Unknown',
      },
      create: {
        technology: operator.bands?.split(' / ') ?? [''],
        mcc: operator.mcc,
        mnc: operator.mnc,
        brand: operator.brand ?? 'Unknown',
        operator: operator.operator ?? 'Unknown',
        country: operator.countryName ?? 'Unknown',
        countryCode: operator.countryCode ?? 'Unknown',
      },
      where: {
        mnc_mcc: {
          mcc: operator.mcc,
          mnc: operator.mnc,
        },
      },
    });
  }
  exit(0);
}
main();
