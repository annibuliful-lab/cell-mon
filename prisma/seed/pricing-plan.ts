import { Prisma } from '@prisma/client';
import { client } from './client';
import util from 'util';

export const PRICING_PLAN: Prisma.PricingPlanUncheckedCreateInput[] = [
  {
    id: 1,
    title: 'Free plan',
    description: 'Free plan description',
    price: 0,
    createdBy: 'SYSTEM',
    updatedBy: 'SYSTEM',
  },
  {
    id: 2,
    title: 'Paid plan',
    description: 'Paid plan description',
    price: 12.99,
    createdBy: 'SYSTEM',
    updatedBy: 'SYSTEM',
  },
];

export async function seedPricingPlan() {
  const pricingPlans = await Promise.all(
    PRICING_PLAN.map((data) => client.pricingPlan.create({ data }))
  );
  console.log('pricing plan', util.inspect(pricingPlans, false, null, true));
}
