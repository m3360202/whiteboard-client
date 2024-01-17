//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useParams, useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import mui
import { ThemeProvider, Button, TextField, Typography } from '@mui/material';
import currentTheme from '../../mui/theme/lightTheme';
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import IconButton from '@mui/material/IconButton';
import KeyboardArrowLeftIcon from '@mui/icons-material/KeyboardArrowLeft';

import _ from 'lodash';
import server from '../../startup/serverConnect';


function ResetPassword() {
  const { token } = useParams<any>();
  const history = useHistory();

  const { t } = useTranslation();
  const valueRefNewPassword:any = useRef('');
  const valueRefConfirmPassword:any = useRef('');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  useEffect(() => {
    window.document.body.style.backgroundColor = '#F4F5FA';
    window.document.body.style.height = '100%';
    window.document.body.style.overflow = 'hidden';
  }, []);

  // Define a function called resetPasswordClick that takes an event object 'e' as a parameter.
  const resetPasswordClick = e => {
    // Prevent the default behavior of the event, which is typically to submit a form.
    e.preventDefault();

    // Retrieve the password and password confirmation values from input fields.
    const password = valueRefNewPassword.current.value;
    const passwordConfirm = valueRefConfirmPassword.current.value;

    // Check if the password is not empty and matches the password confirmation.
    if (!_.isEmpty(password) && password === passwordConfirm) {
      // If the password is valid, call the Accounts.resetPassword method with 'token' and 'password'.
      // Provide a callback function 'err' to handle the result of the password reset.
      server.call('resetPassword',token, password).then((res:any) => {
        Boardx.Util.Msg.info(t('pages.authPageJoin.passwordChanged'));
          history.push('/signin');
      }).catch((err:any) => {
        Boardx.Util.Msg.warning(t('pages.authPageJoin.sthWrong'), err);
      })
    } else {
      // If the password is empty or does not match the confirmation, display an information message.
      Boardx.Util.Msg.info(t('pages.authPageJoin.passwordCheck'));
    }

    // Return false to prevent any further default event handling.
    return false;
  };

  const handleGoBackToLogin = () => {
    history.push('/signin');
  };

  return (
    <Box>
      <Container sx={{ display: 'flex',
    justifyContent: 'center',
    position: 'absolute',
    left: '50%',
    top: '50%',
    transform: 'translate(-50%, -50%)',

    '@media (max-height: 644px)': {
      joinMain: {
        marginTop: 48
      }
    },

    '@media (max-width: 912px)': {
      joinMain: {
        position: 'absolute',
        top: '50%'
      },
      paper: {
        boxShadow: 'none'
      }
    }}} component="main" maxWidth="lg">
        <CssBaseline />
        <Box sx={  {  marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 456,
    height: 500,
    padding: '48px 28px 36px 28px',
    background: '#FFFFFF',
    boxShadow: '0px 1px 6px 2px rgba(154, 154, 154, 0.34)',
    borderRadius: '8px',
    zIndex: '5'}}>
          <Box
            style={{
              display: 'flex',
              alignItems: 'center',
              marginBottom: '32px'
            }}
          >
            <a href="/">
              <img
                style={{ width: '28px', height: '28px' }}
                src="/images/apple-icon.png"
              />
            </a>
            <Typography
              style={{
                fontSize: '24px',
                fontWeight: '600',
                color: 'rgba(58, 53, 65, 0.87)',
                marginLeft: '12px'
              }}
            >
              BOARDX
            </Typography>
          </Box>

          <form style={{    width: '100%' /* Fix IE 11 issue.*/}} noValidate>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{    fontSize: '1.4993rem',
                fontWeight: 'bold',
                color: 'rgba(58, 53, 65, 0.87)'}}
                component="h1"
                variant="h5"
              >
                {t('pages.resetPasswordPage.resetPassword')}
              </Typography>
              <img
                style={{
                  width: '29px',
                  height: '26px',
                  marginLeft: '8px'
                }}
                src="/images/hello.png"
              />
            </Box>
            <Typography sx={{    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '166%',
    color: 'rgba(58, 53, 65, 0.68)',
    letterSpacing: '0.4px'}} variant="body1">
              {t('pages.resetPasswordPage.resetPasswordReason')}
            </Typography>

            <FormControl sx={{ mt: '25px' }} variant="outlined" fullWidth>
              <InputLabel style={{ backgroundColor: '#FFFFFF' }}>
                {t('pages.resetPasswordPage.newPassword')}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showNewPassword ? 'text' : 'password'}
                inputRef={valueRefNewPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() => setShowNewPassword(!showNewPassword)}
                      onMouseDown={event => event.preventDefault()}
                      edge="end"
                    >
                      {showNewPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <FormControl sx={{ mt: '18px' }} variant="outlined" fullWidth>
              <InputLabel style={{ backgroundColor: '#FFFFFF' }}>
                {t('pages.resetPasswordPage.confirmPassword')}
              </InputLabel>
              <OutlinedInput
                id="outlined-adornment-password"
                type={showConfirmPassword ? 'text' : 'password'}
                inputRef={valueRefConfirmPassword}
                endAdornment={
                  <InputAdornment position="end">
                    <IconButton
                      aria-label="toggle password visibility"
                      onClick={() =>
                        setShowConfirmPassword(!showConfirmPassword)
                      }
                      onMouseDown={event => event.preventDefault()}
                      edge="end"
                    >
                      {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                    </IconButton>
                  </InputAdornment>
                }
                label="Password"
              />
            </FormControl>

            <Box sx={{ mt: '20px' }}>
              <Button
                onClick={resetPasswordClick}
                variant="contained"
                style={{ width: '100%' }}
              >
                {t('pages.resetPasswordPage.reset')}
              </Button>
            </Box>
            <Box sx={{ mt: '20px' }}>
              <Button
                variant="text"
                style={{ width: '100%' }}
                onClick={handleGoBackToLogin}
              >
                <KeyboardArrowLeftIcon style={{ marginRight: '5px' }} />
                {t('pages.resetPasswordPage.backTologin')}
              </Button>
            </Box>
          </form>
        </Box>
        <Box style={{ position: 'fixed', bottom: '-260px', zIndex: '2' }}>
          <img src="/images/bottom.png" />
        </Box>
      </Container>
    </Box>
  );
}

export default ResetPassword;
