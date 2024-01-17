import React from 'react';

import Card from '@mui/material/Card'
import Grid from '@mui/material/Grid'
import { Button } from '@mui/material'
import Link from '@mui/material/Link';

const Success = (subscriptionId) => {
  console.log('subscriptionId', subscriptionId)
  return (
    <Card sx={{ marginRight: 6 }}>
      <Grid container sx={{ display: 'flex', justifyContent: 'center', flexDirection: 'column', alignItems: 'center', height: 400 }}>
        <img
          width={264}
          src={'/images/pricing-1.png'}
          height={163}
        />
        {subscriptionId == '' ? <>
          <h3>Subscription failed, please try again.</h3>
          <Link href='/pricing'>
            <Button variant='contained'>Subscription</Button>
          </Link>
        </> : <>
          <h3>Subscription to the plan successful!</h3>
          <Link href='/'>
            <Button variant='contained'>Back to Home Page</Button>
          </Link>
        </>
        }

      </Grid>
    </Card>
  );
};

export default Success;