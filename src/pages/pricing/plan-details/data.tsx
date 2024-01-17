// ** Types
import { PricingDataType } from './types'

const data: PricingDataType = {
  pricingPlans: [
    {
      planId: 'basic-plan',
      imgWidth: 264,
      imgHeight: 163,
      monthlyPrice: 0,
      title: 'Basic',
      popularPlan: false,
      currentPlan: true,
      subtitle: 'Basic functions',
      imgSrc: '/images/pricing-1.png',
      yearlyPlan: {
        perMonth: 0,
        totalAnnual: 0
      },
      planBenefits: [
        '100 projects',
        'Storytelling',
        'Limited version history',
        'Shareable team templates',
        'Extra feature 1'
      ]
    },
    {
      planId: 'premium-plan',
      imgWidth: 264,
      imgHeight: 163,
      monthlyPrice: 4,
      title: 'Premium',
      popularPlan: true,
      currentPlan: false,
      subtitle: 'A simple start for everyone',
      imgSrc: '/images/pricing-2.png',
      yearlyPlan: {
        perMonth: 4,
        totalAnnual: 38
      },
      planBenefits: [
        'Unlimited projects',
        'Storytelling',
        'Unlimited version history',
        'Shareable team templates',
        'Workshop analytics'
      ]
    },
    {
      planId: 'business-plan',
      imgWidth: 264,
      imgHeight: 163,
      monthlyPrice: 6,
      popularPlan: false,
      currentPlan: false,
      title: 'Businesses',
      subtitle: 'For small to medium businesses',
      imgSrc: '/images/pricing-3.png',
      yearlyPlan: {
        perMonth: 6,
        totalAnnual: 57
      },
      planBenefits: [
        'Everything in Premium, plus',
        'Extra feature 1',
        'Extra feature 2',
        'Extra feature 3',
        'Extra feature 4'
      ]
    }
  ]
}

export default data;