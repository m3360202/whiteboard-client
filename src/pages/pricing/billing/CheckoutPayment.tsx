// ** React Imports
import React, { ChangeEvent, Fragment, useEffect, useState } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

//** Import Redux toolkit
import { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOrgMemberList, handleSetOrgList, handleSetOrgInfo } from '../../../store/org';
import { handleSetUserInfo } from '../../../store/user'
import { useGetOrgMemberListQuery } from '../../../redux/OrgAPISlice';

//** Import services
import { PricingService,  UserService, OrgService } from '../../../services';

// ** Custom Components Imports
import MemberItem from './MemberItem'
import SelectedPlanInfo from './SelectedPlanInfo'
import Success from './Success'
import OrganizationSettingsInviteUsers from '../../../components/org/OrganizationSettingsInviteUsers';

// ** MUI Imports
import Card from '@mui/material/Card'
import Step from '@mui/material/Step'
import Grid from '@mui/material/Grid'
import Button from '@mui/material/Button'
import Stepper from '@mui/material/Stepper'
import StepLabel from '@mui/material/StepLabel'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import CardContent from '@mui/material/CardContent'
import List from '@mui/material/List'
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Skeleton from '@mui/material/Skeleton';

// ** Custom Components Imports
import StepperCustomDot from './StepperCustomDot'

// ** Styled Component
import StepperWrapper from './StepperWrapper'

//for add card
import { formatCVC, formatExpirationDate, formatCreditCardNumber } from './format'
import Payment from 'payment'

import store from '../../../store';

const steps = [
  {
    title: 'Select members'
  },
  {
    title: 'Billing information'
  },
  {
    title: 'Confirmation'
  }
]

const CheckoutPayment = (props: any) => {
  //use
  const dispatch = useDispatch();
  const local = useLocation();
 

  // ** State
  const [plan, setPlan] = useState<string>('annually')
  const [title, setTitle] = useState<string>(props.title)
  const [price, setPrice] = useState<number>(0)
  const [activeStep, setActiveStep] = useState<number>(0)

  const [userId, setUserId] = useState<string>(store.getState().user.userInfo.userId)
  const [email, setEmail] = useState<string>('')
  const [line1, setLine1] = useState<string>('')
  const [line2, setLine2] = useState<string>('')
  const [city, setCity] = useState<string>('')
  const [state, setState] = useState<string>('')
  const [postal_code, setPostal_code] = useState<string>('')

  const [cardNumber, setCardNumber] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [cvc, setCvc] = useState<string>('')
  const [expiry, setExpiry] = useState<string>('')
  const [subscriptionId, setSubscriptionId] = useState<string>('')

  const [selectMemberIds, setSelectMemberIds] = useState<string[]>([])
  const [showCardErrorMessage, setShowCardErrorMessage] = useState<string>('')

  //user
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  //org
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  const { data: orgMemberList } = useGetOrgMemberListQuery({
    orgId: orgInfo.orgId
  });
 
 
  useEffect(() => {
    if (userInfo && userInfo.userName && userInfo.userName.indexOf('vistor_') > -1) {
      window.location.href = location.origin + '/signin';
    }
  }, [userInfo]);
 
 

  useEffect(() => {
    handlePriceChange(title, plan);
    let members = [];
    orgMemberList.forEach(item => members.push(item.userId))
    setSelectMemberIds(members)
  }, [orgInfo]);

  //Select the Billing cycle plan
  const handlePlanChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newPlan = (event.target as HTMLInputElement).value;
    setPlan(newPlan)
    handlePriceChange(title, newPlan)
  }

  const handleTitleChange = (event: ChangeEvent<HTMLInputElement>) => {
    let newTitle = (event.target as HTMLInputElement).value;
    setTitle(newTitle)
    handlePriceChange(newTitle, plan)
  }

  const handlePriceChange = (title: string, plan: string) => {
    let planPrice = 0;

    if (title == "Premium") {
      planPrice = (plan === 'monthly') ? 4 : 38;
    } else {
      planPrice = (plan === 'monthly') ? 6 : 57;
    }
    setPrice(planPrice);
  }

  const handleInputChange = ({ target }: ChangeEvent<HTMLInputElement>) => {
    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value, Payment)
      setCardNumber(target.value)
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value)
      setExpiry(target.value)
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value, cardNumber, Payment)
      setCvc(target.value)
    } else if (target.name === 'email') {
      setEmail(target.value)
    } else if (target.name === 'line1') {
      setLine1(target.value)
    } else if (target.name === 'line2') {
      setLine2(target.value)
    } else if (target.name === 'city') {
      setCity(target.value)
    } else if (target.name === 'state') {
      setState(target.value)
    } else if (target.name === 'postal_code') {
      setPostal_code(target.value)
    }
  }

  const submitSubscription = () => {

    let arr = expiry.split('/');
    let month = parseInt(arr[0]);
    let year = parseInt('20' + arr[1]);

    let addressObj: any = {
      line1: line1,
      line2: line2,
      city: city,
      state: state,
      country: 'US',
      postal_code: postal_code
    }

    PricingService.getInstance().createSubscription(
      {
        email: email,
        name: name,
        address: addressObj,
        planTitle: title,
        plan: plan,
        number: cardNumber,
        exp_month: month,
        exp_year: year,
        cvc: cvc,
        quantity: selectMemberIds.length
      },
      (error: any, result: any) => {
        if (error) {
          console.log('error', error)
          return;
        }
        console.log('createSubscription result', result)
        setSubscriptionId(result.id);

        PricingService.getInstance().addPricingPlan({
          userId: userId,
          subscriptionId: result.id,
          memberIds: selectMemberIds
        })

      },
    );
  }

  // Handle Stepper
  const handleBack = () => {
    setActiveStep(prevActiveStep => prevActiveStep - 1)
  }
  const handleNext = () => {
    setActiveStep(prevActiveStep => prevActiveStep + 1)
    if (activeStep === steps.length - 2) {

      if (!name) {
        setShowCardErrorMessage('Please input Card Holder Name');
        handleBack();
        return;
      }

      if (!cardNumber) {
        setShowCardErrorMessage('Please input Credit Card Number');
        handleBack();
        return;
      }

      if (!expiry) {
        setShowCardErrorMessage('Please input Expiration Date');
        handleBack();
        return;
      }
      if (!cvc) {
        setShowCardErrorMessage('Please input Card CVC');
        handleBack();
        return;
      }

      let arr = expiry.split('/');
      let month = parseInt(arr[0]);
      let year = parseInt('20' + arr[1]);

      PricingService.getInstance().checkCardToken(
        {
          number: cardNumber,
          exp_month: month,
          exp_year: year,
          cvc: cvc
        },
        (error: any, result: any) => {
          if (error) {
            console.log('error', error)
            return;
          }
          if (result == 'valid') {
            setShowCardErrorMessage('');
          } else {
            setShowCardErrorMessage('Your card number is incorrect');
            handleBack();
          }

        },
      );
    }
    if (activeStep === steps.length - 1) {
      submitSubscription();
    }
  }

  const getStepContent = (step: number) => {

    switch (step) {
      case 0:
        return (
          <Fragment>
            <Grid item xs={12} sm={7}>
              <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '1.4rem', color: 'text.primary' }}>
                Select your premium members
              </Typography>
              <Typography variant='caption' component='p'>
                Select members for your Premium Plan. Unselected members will not be removed from your organization and will still enjoy free features
              </Typography>


              <Grid item xs={12} sx={{ paddingTop: 5 }}>

                <OrganizationSettingsInviteUsers />

                <Typography variant='h6' sx={{ marginTop: '1rem' }}>{'Name'}</Typography>
                <List dense sx={{ mb: 3 }}>
                  {orgMemberList ? orgMemberList.map(member => {
                    return (
                      <MemberItem
                        key={member.userId}
                        member={member}
                        selectMemberIds={selectMemberIds}
                        setSelectMemberIds={setSelectMemberIds}
                      />
                    )
                  }) : null}
                </List>
                <Grid item xs={12} sx={{ textAlign: 'right' }}>
                  {selectMemberIds.length} selected
                </Grid>
              </Grid>
            </Grid >
            <Grid item xs={12} sm={5}>
              <SelectedPlanInfo
                title={title}
                plan={plan}
                selectMemberIds={selectMemberIds}
                price={price}
                handlePlanChange={handlePlanChange}
                handleTitleChange={handleTitleChange}
              />
            </Grid>
          </Fragment >
        )
      case 1:
        return (
          <Fragment key={step}>
            <Grid item xs={12} sm={7} sx={{ padding: 5 }}>
              <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '1.4rem', color: 'text.primary' }}>
                1, Add Credit Card
              </Typography>
              <Typography variant='caption' component='p'>
                please add your Credit Card information
              </Typography>

              {/* card start */}
              <Grid container spacing={3}>
                <Grid item xs={12}>
                  <Grid container spacing={2}>

                    <Grid item xs={12}>
                      {
                        showCardErrorMessage ?
                          <Chip label={showCardErrorMessage} color='error' sx={{ marginBottom: '20px' }} />
                          : null
                      }
                      <TextField
                        fullWidth
                        name='name'
                        value={name}
                        autoComplete='off'
                        label='Name on Card'
                        placeholder='John Doe'
                        onChange={e => setName(e.target.value)}
                      />
                    </Grid>
                    <Grid item xs={12}>
                      <TextField
                        fullWidth
                        name='number'
                        value={cardNumber}
                        autoComplete='off'
                        label='Card Number'
                        onChange={handleInputChange}
                        placeholder='0000 0000 0000 0000'
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name='expiry'
                        label='Expiration Date'
                        value={expiry}
                        placeholder='MM/YY'
                        onChange={handleInputChange}
                        inputProps={{ maxLength: '5' }}
                      />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                      <TextField
                        fullWidth
                        name='cvc'
                        label='CVC'
                        value={cvc}
                        autoComplete='off'
                        onChange={handleInputChange}
                        placeholder={Payment.fns.cardType(cardNumber) === 'amex' ? '1234' : '123'}
                      />
                    </Grid>
                    <Grid item xs={12}>

                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* card end */}

              <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '1.4rem', color: 'text.primary', marginTop: '30px' }}>
                2, Billing Contact
              </Typography>
              <Typography variant='caption' component='p'>
                This is the contact or department who recives the invoices or any billing communications.
              </Typography>
              <Grid container spacing={2} sx={{ marginTop: 1, marginBottom: 6 }}>

                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='email'
                    value={email}
                    label='Email'
                    onChange={handleInputChange}
                    placeholder='Your Email'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='line1'
                    value={line1}
                    label='Address line 1'
                    onChange={handleInputChange}
                    placeholder='e.g., street, PO Box, or company name'
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    fullWidth
                    name='line2'
                    value={line2}
                    label='Address line 2'
                    onChange={handleInputChange}
                    placeholder='e.g., apartment, suite, unit, or building'
                  />
                </Grid>
                <Grid item xs={12} sm={5}>
                  <TextField
                    fullWidth
                    name='city'
                    value={city}
                    label='City'
                    onChange={handleInputChange}
                    placeholder='City'
                  />
                </Grid>
                <Grid item xs={12} sm={4}>
                  <TextField
                    fullWidth
                    name='state'
                    value={state}
                    label='State'
                    onChange={handleInputChange}
                    placeholder='State'
                  />
                </Grid>
                <Grid item xs={12} sm={3}>
                  <TextField
                    fullWidth
                    name='postal_code'
                    value={postal_code}
                    label='Zip Code'
                    onChange={handleInputChange}
                    placeholder='Zip/Postal'
                  />
                </Grid>
              </Grid>
            </Grid>
            <Grid item xs={12} sm={5}>
              <SelectedPlanInfo
                title={title}
                selectMemberIds={selectMemberIds}
                plan={plan}
                price={price}
                handlePlanChange={handlePlanChange}
                handleTitleChange={handleTitleChange}
              />
            </Grid>
          </Fragment>
        )
      case 2:
        return (
          <Fragment key={step}>
            <Grid item xs={12} sm={6}>
              <Typography variant='body2' sx={{ fontWeight: 600, fontSize: '1.4rem', color: 'text.primary' }}>
                Confirmation
              </Typography>
              <Typography variant='caption' component='p'>
                Please review your information
              </Typography>
            </Grid>
            <Grid item xs={12}>
              <Card sx={{ minHeight: 250 }}>
                <CardContent>
                  <h5>
                    Credit Card
                  </h5>
                  <Typography variant='caption'>
                    {cardNumber} <br />
                    Exp. {expiry} <br />
                    {name} <p />
                  </Typography>
                  <h5>
                    Email
                  </h5>
                  <Typography variant='caption'>
                    {email}
                  </Typography>
                  <h5>
                    Billing Contact
                  </h5>
                  <Typography variant='caption'>
                    {line1 + ', '}
                    {line2 ? line2 + ', ' : null}
                    {city + ', '}
                    {state} {postal_code}
                  </Typography>
                  <h5>
                    Selected Plan
                  </h5>
                  <Typography variant='caption'>
                    {title} Plan
                  </Typography>
                  <h5>
                    Biling Cycle
                  </h5>
                  <Grid item xs={12}>
                    <Typography variant='caption'>
                      {plan}
                    </Typography>
                  </Grid>
                  <h5>
                    {selectMemberIds.length} {title} Members
                  </h5>

                  <Grid container >
                    <Grid item xs={7}>
                      <Typography variant='caption'>
                        $ {price} {plan} X {selectMemberIds.length} members
                      </Typography>

                    </Grid>
                    <Grid item xs={5} sx={{ textAlign: 'right' }}>
                      <Typography variant='caption'>
                        $ {price * selectMemberIds.length}
                      </Typography>
                    </Grid>
                  </Grid>

                  <hr />
                  <Grid container >
                    <Grid item xs={7}>
                      <h4>
                        Subtotal
                      </h4>
                    </Grid>
                    <Grid item xs={5} sx={{ textAlign: 'right' }}>
                      <h4> $ {price * selectMemberIds.length} </h4>
                    </Grid>
                  </Grid>
                </CardContent>

              </Card>

            </Grid>

          </Fragment>
        )
      default:
        return 'Unknown Step'
    }
  }

  const renderContent = () => {
    if (activeStep === steps.length) {
      return (
        <Fragment>
          {
            subscriptionId ? <Success subscriptionId={subscriptionId} />
              : <Box sx={{ width: 600 }} >
                <Skeleton variant="text" animation="wave" />
                <Skeleton variant="text" animation="wave" />
                <Skeleton variant="rectangular" animation="wave" width={600} height={100} />
                <Skeleton variant="text" animation="wave" width={200} />
              </Box>


          }
        </Fragment>
      )
    } else {
      return (
        <form onSubmit={e => e.preventDefault()}>
          <Grid container spacing={3}>
            <Grid item xs={12} sx={{ display: 'flex', justifyContent: 'space-between' }}>
              <Button
                size='large'
                variant='contained'
                disabled={activeStep === 0}
                onClick={handleBack}
              >
                Back
              </Button>
              <Button size='large' variant='contained' onClick={handleNext}>
                {activeStep === steps.length - 1 ? 'Submit' : 'Next'}
              </Button>
            </Grid>
            {getStepContent(activeStep)}

          </Grid>
        </form>
      )
    }
  }

  return (
    <Fragment>
      <StepperWrapper>
        <Stepper activeStep={activeStep} alternativeLabel>
          {steps.map((step, index) => {
            return (
              <Step key={index}>
                <StepLabel StepIconComponent={StepperCustomDot}>
                  <div className='step-label'>
                    <div>
                      <Typography className='step-title'>{step.title}</Typography>
                    </div>
                  </div>
                </StepLabel>
              </Step>
            )
          })}
        </Stepper>
      </StepperWrapper>
      <Card sx={{ marginTop: 4 }}>
        <CardContent>{renderContent()}</CardContent>
      </Card>
    </Fragment>
  )
}

export default CheckoutPayment



