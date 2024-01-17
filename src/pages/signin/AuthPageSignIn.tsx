//** Import react
import React, { useRef, useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory, useLocation } from 'react-router-dom';

//** Import i18n


//** Import Redux kit
import store from '../../store'
import { handleSetUserInfo } from '../../store/user';
import { useDispatch } from 'react-redux';

//**Import Mui
import Grid from '@mui/material/Grid';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Button from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../../mui/theme/lightTheme';
import Box from '@mui/material/Box';
import ToggleButton from '@mui/material/ToggleButton';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import Divider from '@mui/material/Divider';

//**Import Services
import server from '../../startup/serverConnect';

//**Import others
import { useTranslation } from 'react-i18next';
import { UserService } from '../../services';

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

function SignInPage() {
  //use
  const history = useHistory();
  const dispatch = useDispatch();

  const query = useQuery();
  const { t } = useTranslation();
  //refs
  const emailRef: any = useRef();
  const passwordRef: any = useRef();

  //hooks
  const [loading, setLoading] = useState(false);
  const callback = query.get('callback');
  const [linkSignin, setLinkSignin] = useState(null);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [errorMsgEmail, setErrorMsgEmail] = useState('');
  const [errorMsgPass, setErrorMsgPass] = useState('');
  const [errors, setErrors] = useState({});
  const [open, setOpen] = useState(false);
  let intervel = null;

  useEffect(() => {
    if (callback) {
      setLinkSignin('/join?callback=' + callback);
    } else if (query.get('invite')) {
      setLinkSignin('/join?invite=' + query.get('invite'));
    } else {
      setLinkSignin('/join');
    }
    window.document.body.style.backgroundColor = '#F4F5FA';
    window.document.body.style.height = '100%';
    window.document.body.style.overflow = 'hidden';
    if (!intervel) {
      intervel = setInterval(() => {
        if (store.getState().user.userInfo.userId) {
          if (location.href.indexOf('signin?callback=') > -1) {
            history.push('/board/' + location.href.split('board/')[1]);
          }
          if (location.href.indexOf('signin') > -1 && location.href.indexOf('callback=') == -1) {
            history.push('/recent');
          }
        }
      }, 1000);
    }
    server.on('loginResume', (m) => {
      intervel = setInterval(() => {
        if (store.getState().user.userInfo.userId) {
          if (location.href.indexOf('signin?callback=') > -1) {
            history.push('/board/' + location.href.split('board/')[1]);
          }
          if (location.href.indexOf('signin') > -1 && location.href.indexOf('callback=') == -1) {
            history.push('/recent');
          }
        }
      }, 1000);
    });

    return () => {
      if (intervel) {
        clearInterval(intervel);
      }
    }
  }, []);


  const logInWithWechat = event => {
    event.preventDefault();

    let appid = 'wx7b9c396cfe495af5';
    let redirect_uri = window.location.origin + '/wechat';
    let uri = 'https://open.weixin.qq.com/connect/qrconnect?appid=' +
      appid +
      '&redirect_uri=' +
      redirect_uri +
      '&response_type=code&scope=snsapi_login#wechat_redirect'; window.location.href = uri;
  };
  const logInWithLinkedin = () => {
    const clientId = '77n0zwjlzuyfte';
    let redirect_uri = window.location.origin + '/singinWithLinkedin';
    console.log('redirect_uri', redirect_uri);
    let uri = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`;

    window.location.href = uri;
  };
  const onSubmit = async event => {
    event.preventDefault();

    const email = emailRef.current ? emailRef.current.value : '';
    const password = passwordRef.current ? passwordRef.current.value : '';

    setErrorEmail(false);
    setErrorPass(false);
    setErrorMsgEmail('');
    setErrorMsgPass('');

    if (!email && !password) {
      setErrorEmail(true);
      setErrorMsgEmail(t('pages.authPageJoin.emailRequired'));
      setErrorPass(true);
      setErrorMsgPass(t('pages.authPageJoin.passwordRequired'));
      return;
    }

    if (!email) {
      setErrorEmail(true);
      setErrorMsgEmail(t('pages.authPageSignIn.emailRequired'));
      return;
    }
    if (!password) {
      setErrorPass(true);
      setErrorMsgPass(t('pages.authPageSignIn.passwordRequired'));

      return;
    }

    setLoading(true);
      await server.login({ password, user: { email } }).then(async res => {

      console.log('res---', res)
      setLoading(false);
      let user = await server.call('getUserInfo');
      UserService.getInstance().saveStore(user);
      localStorage.setItem('token', res.token);
      const userId = user._id;
      const token = res.token;
      await server.call('saveLoginToken', userId, token);
      if (location.href.indexOf('signin?callback=') > -1) {
        history.push('/board/' + location.href.split('board/')[1]);
      }
      if (location.href.indexOf('signin') > -1 && location.href.indexOf('callback=') == -1) {
        history.push('/recent');
      }


    }).catch(err => {
      setLoading(false);
      Boardx.Util.Msg.warning(t('pages.authPageSignIn.incorrect'));
      return;
    });

    // server.call('loginAuth2', email, password).then(res => {
    //   if(res && res.status){
    //     console.log('res---',res)
    //     setLoading(false);
    //     UserService.getInstance().saveStore(res.user);
    //     localStorage.setItem('token', res.token);
    //     history.push('/recent');
    //   }
    //   else{
    //     setLoading(false);
    //     Boardx.Util.Msg.warning(t('pages.authPageSignIn.incorrect'));
    //     return;
    //   }
    // }).catch(err => {
    //   console.log('err',err)
    //   Boardx.Util.Msg.warning(t('pages.authPageSignIn.incorrect'));
    //   return;
    // });
  };

  const forgotPassword = () => {
    const email = emailRef.current ? emailRef.current.value : '';

    const newErrors: any = {};

   


    if (!email) {
      newErrors.email = t('pages.authPageSignIn.emailRequired');
      Boardx.Util.Msg.info(newErrors.email);
    } else {
      Boardx.Util.Msg.info(t('pages.authPageSignIn.resetSent'));
      server.call('forgotPassword', {
        email
      }).then(res => {
      }).catch(err => {
        if (err.error === 403) {
          setErrorEmail(true);
          setErrorMsgEmail(t('pages.authPageSignIn.resetSentFailed'));
          Boardx.Util.Msg.info(
            t('pages.authPageSignIn.resetSentFailed')
          );
          return;
        }
        Boardx.Util.Msg.warning(
          t('pages.authPageSignIn.resetSentFailed') + err
        );
      });

    }
  };

  const handleOnBlur = e => {
    if (e.target.value !== '') {
      if (e.target.id === 'email') {
        setErrorEmail(false);
        setErrorMsgEmail('');
        return;
      }
      if (e.target.id === 'password') {
        setErrorPass(false);
        setErrorMsgPass('');
        return;
      }
    }
  };

  const handlEyeOpenClick = () => {
    if (!open) {
      setOpen(true);
      document.getElementById('password').setAttribute('type', 'text');
    } else {
      setOpen(false);
      document.getElementById('password').setAttribute('type', 'password');
    }
  };

  const errorMessages = Object.values(errors);
  const errorClass = key => errors[key] && 'error';

  return (
    <div>
      <Container sx={{    display: 'flex',
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
        position: 'absolute'
      }
    }}} component="main" maxWidth="lg">
        <CssBaseline />
        <Box sx={{marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 456,
    height: 596,
    padding: '48px 28px 36px 28px',
    background: '#FFFFFF',
    boxShadow: '0px 1px 6px 2px rgba(154, 154, 154, 0.34)',
    borderRadius: '8px',
    zIndex: 5,
    overflow: 'hidden'}}>
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

          <form style={{ width: '100%' /* Fix IE 11 issue.*/}} noValidate>
            <Box style={{ display: 'flex', alignItems: 'center' }}>
              <Typography
                sx={{fontSize: '1.4993rem',
                fontWeight: 'bold',
                marginBottom: '20px',
                color: 'rgba(58, 53, 65, 0.87)'}}
                component="h1"
                variant="h5"
              >
                {t('pages.authPageSignIn.welcomeLogin')}
              </Typography>
              <img
                style={{
                  width: '29px',
                  height: '26px',
                  marginLeft: '8px',
                  marginBottom: '20px'
                }}
                src="/images/hello.png"
              />
            </Box>
            <Box>
              <TextField
                //InputLabelProps={{
                //shrink: shrinkValue,
                //}}
                autoComplete="email"
                autoFocus
                error={errorEmail}
                fullWidth
                helperText={errorMsgEmail}
                id="email"
                inputRef={emailRef}
                onBlur={handleOnBlur}
                label={t('pages.authPageSignIn.yourEmail')}
                margin="normal"
                name="email"
                variant="outlined"
              />
              <Box style={{ position: 'relative' }}>
                <TextField
                  // InputLabelProps={{
                  //shrink: shrinkValue,
                  //}}
                  autoComplete="current-password"
                  error={errorPass}
                  fullWidth
                  helperText={errorMsgPass}
                  id="password"
                  inputRef={passwordRef}
                  onBlur={handleOnBlur}
                  label={t('pages.authPageSignIn.password')}
                  margin="normal"
                  name="password"
                  type="password"
                  variant="outlined"
                />
                <ToggleButton
                 sx={{    position: 'absolute',
                 right: 0,
                 top: 19}}
                  onClick={handlEyeOpenClick}
                  selected={open}
                  value="password"
                >
                  <RemoveRedEyeIcon />
                </ToggleButton>
              </Box>
            </Box>

            <Box style={{ textAlign: 'right', marginBottom: '16px' }}>
              <Typography variant="subtitle2">
                <Link
                  color="primary"
                  onClick={() => forgotPassword()}
                  style={{
                    width: 180,
                    marginTop: '-10px',
                    textDecoration: 'none',
                    fontSize: '14px',
                    background: 'transparent'
                  }}
                  href="#"
                >
                  {t('pages.authPageSignIn.forgotPassword')}
                </Link>
              </Typography>
            </Box>
            <Button
              sx={{ padding: '0.53125rem 1.625rem',
              width: '100%',
              boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
              fontSize: '15px',
              height: '42px'}}
              color="primary"
              fullWidth
              id="submit"
              loading={loading}
              onClick={e => onSubmit(e)}
              type="submit"
              variant="contained"
            >
              <Box
                style={{
                  textAlign: 'right'
                }}
              >
                <Typography variant="subtitle2">
                  {t('pages.authPageSignIn.signInButton')}
                </Typography>
              </Box>
            </Button>
            {/* <Box sx={{ mt: '28px' }}>
              <Typography
                variant="body1"
                sx={{    textAlign: 'center',
    letterSpacing: '0.15px',
    fontWeight: 400,
    fontSize: '16px',
    lineHeight: '24px',
    color: 'rgba(58, 53, 65, 0.68)'}}
              >
                {t('pages.authPageSignIn.newToOurPlatform')}{' '}
                <Link
                  sx={{ color: '#F21D6B',
    cursor: 'pointer'}}
                  underline="none"
                  onClick={() => history.push('/join')}
                >
                  {t('pages.authPageSignIn.createAnAccount')}
                </Link>
              </Typography>
            </Box> */}

            {/* 隐藏注册入口 */}
            <Grid container sx={{ mt: '38px' }} justifyContent="center">
              <Typography variant="body1" sx={{ color: 'rgba(58, 53, 65, 0.68)',
    fontSize: '14px',
    fontWeight: '400'}}>
                {t('pages.authPageSignIn.hasNoAccount')}
                <Link
                  style={{
                    textDecoration: 'none',
                    marginLeft: '10px', cursor: 'pointer'
                  }}
                  onClick={() => history.push(linkSignin)}
                >
                  {`${t('pages.authPageSignIn.signUp')}`}
                </Link>
              </Typography>
            </Grid>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                marginBottom: '20px',
                marginTop: '20px'
              }}
              sx={{'line':   {  width: '170px',
              color: 'rgba(58, 53, 65, 0.12)'}}}
            >
              <Divider className={'line'} />
              <Typography style={{ margin: '0 8px' }}>
                {`${t('pages.authPageSignIn.or')}`}
              </Typography>
              <Divider className={'line'} />
            </Box>
            <Box
              style={{
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center'
              }}
            >
              <svg
                onClick={e => logInWithLinkedin()}
                viewBox="0 0 1024 1024"
                version="1.1"
                xmlns="http://www.w3.org/2000/svg"
                style={{ width: '24px', height: '24px', cursor: 'pointer' }}
              >
                <path
                  d="M871.168 844.3904h-151.7056l-3.584-269.5168s3.584-71.8848-74.496-70.9632c-78.0288 0.8704-89.2928 70.9632-89.2928 70.9632v269.5168H399.3088V390.656h146.432v62.5664s6.0416-20.3776 39.7824-44.3392c33.6896-23.9616 89.6-29.2864 113.5616-28.416 23.9616 0.9216 56.7808-3.2768 111.7696 34.6112 58.8288 40.448 60.3136 146.3808 60.3136 146.3808v282.88zM226.9184 335.7184a85.8624 85.8624 0 1 1 0.0512-171.7248 85.8624 85.8624 0 0 1 0 171.7248z m75.6224 508.672H151.3472V390.656H302.592v453.632zM936.8576 0H85.1456C38.144 0 0 38.144 0 85.1456v853.7088C0 985.856 38.144 1024 85.1456 1024h851.712c47.0016 0 85.1456-38.144 85.1456-85.1456V85.1456C1021.952 38.144 983.8592 0 936.8576 0z"
                  fill="#008DC2"
                  p-id="2635"
                ></path>
              </svg>
            </Box>
          </form>
        </Box>
      </Container>
    </div>
  );
}

export default SignInPage;
