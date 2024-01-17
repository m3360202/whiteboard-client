import React from 'react';

// ** MUI Imports
import Button from '@mui/material/Button'
import { styled } from '@mui/material/styles'
import Card from '@mui/material/Card';
import Typography from '@mui/material/Typography'
import Box, { BoxProps } from '@mui/material/Box'

// ** Styled Component for the wrapper of whole component
const BoxWrapper = styled(Box)<BoxProps>(({ theme }) => ({
  position: 'relative',
  padding: '10px',
  borderRadius: '6px',
  border: '1px solid #999'
}))

// ** Styled Component for the wrapper of all the features of a plan
const BoxFeature = styled(Box)<BoxProps>(({ theme }) => ({
  marginBottom: '10px',
  '& > :not(:first-of-type)': {
    marginTop: '10px'
  }
}))

export default function PlanDetails(props: any) {
  const { data, handlyShow } = props
  const renderFeatures = () => {
    return data.planBenefits.map((item: string, index: number) => (
      <Box key={index} sx={{ display: 'flex', alignItems: 'center' }}>
        <div style={{ width: '6px', height: '6px', borderRadius: '50%', backgroundColor: '#ccc', margin: '5px' }}></div>
        <Typography variant='body2'>{item}</Typography>
      </Box >
    ))
  }

  return (
    <BoxWrapper sx={{ height: '100%' }}>
      <Box sx={{
        display: 'flex',
        justifyContent: 'center'
      }}>
        <img
          width={data.imgWidth}
          src={`${data.imgSrc}`}
          alt={`${data.title.toLowerCase()}-plan-img`}
        />
      </Box>
      <Box sx={{ textAlign: 'center' }}>
        <Typography variant='h3'>{data.title}</Typography>
        <Typography variant='caption'>{data.subtitle}</Typography>
        <Box sx={{ mt: 4.4, mb: 5, position: 'relative' }}>
          <Box sx={{ display: 'flex', justifyContent: 'center' }}>
            <Typography variant='caption' sx={{ mt: 1.6, alignSelf: 'flex-start' }}>
              $
            </Typography>
            <Typography
              variant='h1'
              sx={{ fontWeight: 600, alignSelf: 'center', color: 'primary.main' }}
            >
              {data.monthlyPrice}
            </Typography>
            <Typography variant='caption' sx={{ mb: 1.6, alignSelf: 'flex-end' }}>
              /month
            </Typography>
          </Box>

          <Typography
            variant='body2'
            sx={{ left: 0, right: 0, position: 'absolute' }}
          >
            {`( ${data.yearlyPlan.totalAnnual}/year )`}
          </Typography>

        </Box>
        <Button
          fullWidth
          color={data.currentPlan ? 'success' : 'primary'}
          variant={'contained'}
          type="submit"
          onClick={() => handlyShow(data.title)}
          sx={{ mb: 4 }}
        >
          {data?.currentPlan ? 'Your Current Plan' : 'Upgrade'}
        </Button>

        <BoxFeature>{renderFeatures()}</BoxFeature>
      </Box>

    </BoxWrapper >
  )
}

