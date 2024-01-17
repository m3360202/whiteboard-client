import React from 'react';

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import CardContent from '@mui/material/CardContent'
import Typography from '@mui/material/Typography'
import Radio from '@mui/material/Radio'
import RadioGroup from '@mui/material/RadioGroup'
import FormControlLabel from '@mui/material/FormControlLabel'

export default (props: any) => {
  const { title, selectMemberIds, plan, price, handlePlanChange, handleTitleChange } = props;

  return (
    <Card id="planInfo" sx={{ marginRight: 6, minHeight: 150, padding: '0px !important' }}>
      <CardContent>
        <Typography variant='caption' sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
          Choose your plan
        </Typography>
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <RadioGroup row aria-label='selectPlan' name='selectPlan' value={title} onChange={handleTitleChange}>
            <FormControlLabel value='Premium' control={<Radio />} label='Premium' />
            <FormControlLabel value='Businesses' control={<Radio />} label='Businesses' />
          </RadioGroup>
        </Grid>
        <Typography variant='caption' sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
          Subscription cycle
        </Typography>
        <Grid item xs={12} sx={{ marginBottom: 2 }}>
          <RadioGroup row aria-label='selectBilingCycle' name='selectBilingCycle' value={plan} onChange={handlePlanChange}>
            <FormControlLabel value='annually' control={<Radio />} label='Annually(Save 20%)' />
            <FormControlLabel value='monthly' control={<Radio />} label='Monthly' />
          </RadioGroup>
        </Grid>
        <Typography variant='caption' sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
          {selectMemberIds.length} {title} Plan Members
        </Typography>

        <Grid container >
          <Grid item xs={7}>
            <Typography variant='caption'>
              ${price} {plan} X {selectMemberIds.length} members
            </Typography>
          </Grid>
          <Grid item xs={5} sx={{ textAlign: 'right' }}>
            <Typography variant='caption'>
              ${price * selectMemberIds.length}
            </Typography>
          </Grid>
        </Grid>

        <hr />
        <Grid container >
          <Grid item xs={7}>
            <Typography variant='caption' sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
              Subtotal
            </Typography>
          </Grid>
          <Grid item xs={5} sx={{ textAlign: 'right' }}>
            <Typography variant='caption' sx={{ fontWeight: 600, fontSize: '0.875rem', color: 'text.primary' }}>
              $ {price * selectMemberIds.length}
            </Typography>
          </Grid>
        </Grid>
      </CardContent>
    </Card>
  )
}