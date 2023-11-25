import { prismaDbClient } from '../../../libs/db/src';
import { fetch } from './fetch';

async function main() {
  const operators = (await fetch()).records;
  // console.log('ss', result);
  // const operators = mcc_mnc_list.all();
  // console.log('all', operators);

  for (const operator of operators) {
    if (
      !operator.mcc ||
      !operator.mnc ||
      !operator.brand ||
      !operator.operator ||
      !operator.countryCode ||
      !operator.countryName
    ) {
      continue;
    }

    console.log('oper', operator);
    await prismaDbClient.phoneOperator.upsert({
      update: {},
      create: {
        mcc: operator.mcc,
        mnc: operator.mnc,
        brand: operator.brand,
        operator: operator.operator,
        country: operator.countryName,
        countryCode: operator.countryCode,
      },
      where: {
        mnc_mcc: {
          mcc: operator.mcc,
          mnc: operator.mcc,
        },
      },
    });
  }
}
main();
