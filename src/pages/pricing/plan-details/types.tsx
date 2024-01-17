export type PricingPlanType = {
  planId: string
  title: string
  imgSrc: string
  imgWidth: number
  subtitle: string
  imgHeight: number
  currentPlan: boolean
  popularPlan: boolean
  monthlyPrice: number
  planBenefits: string[]
  yearlyPlan: {
    perMonth: number
    totalAnnual: number
  }
}

export type PricingDataType = {
  pricingPlans: PricingPlanType[]
}
