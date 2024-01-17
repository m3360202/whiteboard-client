import React, { useState } from 'react';

// ** MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'
import Grid from '@mui/material/Grid'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material';
import currentTheme from '../../mui/theme/lightTheme';
import Container from '@mui/material/Container';

import PlanDetails from './plan-details/PlanDetails'
import CheckoutPayment from './billing/CheckoutPayment'
import data from './plan-details/data'

// ** Styled Components
const CardContent = styled(MuiCardContent)<CardContentProps>(({ theme }) => ({
  padding: theme.spacing(17.5, 36, 28.25),
  [theme.breakpoints.down('xl')]: {
    padding: theme.spacing(12.5, 20, 20)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 5)
  }
}))

function Pricing() {
  const [isShow, setIsShow] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')

  const handlyShow = (plan) => {
    setIsShow(false);
    setTitle(plan)
  }

  const renderPlan = () => {
    return data.pricingPlans.map((item: any) => {
      return (
        <Grid item xs={12} md={4} key={item.title.toLowerCase()}>
          <PlanDetails handlyShow={handlyShow} data={item} />
        </Grid>
      )
    })
  }

  return (
    <ThemeProvider theme={currentTheme}>
      <Container component="main" >
        <Card>
          <CardContent>
            <Box sx={{ mb: 1, textAlign: 'center' }}>
              <Typography variant='h2'>Pricing Plans</Typography>
              <Box sx={{ my: 3 }}>
                <Typography variant='body2'>
                  All plans include 40+ advanced tools and features to boost your product.
                </Typography>
                <Typography variant='body2'>Choose the best plan to fit your needs.</Typography>
              </Box>
            </Box>
            {
              isShow ? <Grid container spacing={2} sx={{ mb: 10 }}>
                {renderPlan()}
              </Grid> : <CheckoutPayment title={title} />
            }
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  )
}
export default Pricing;