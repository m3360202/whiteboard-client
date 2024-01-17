//**Import React  */
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory, useLocation } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//**Import Mui */
import { useTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Button from '@mui/lab/LoadingButton';
import LoadingButton from '@mui/lab/LoadingButton';
import Link from '@mui/material/Link';
import { ThemeProvider } from '@mui/material';
import RemoveRedEyeIcon from '@mui/icons-material/RemoveRedEye';
import ToggleButton from '@mui/material/ToggleButton';
import Checkbox from '@mui/material/Checkbox';
import currentTheme from '../../mui/theme/lightTheme';
import Box from '@mui/material/Box';
import ErrorOutlineIcon from '@mui/icons-material/ErrorOutline';

//**Import Redux kit  */
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetByEmailAddressMutation,
  useRegisterUserMutation
} from '../../redux/UserAPISlice';
import { useInsertNewOrgMutation } from '../../redux/OrgAPISlice';

//**Import Service  */
import { UtilityService,UserService } from '../../services';

//**Import Settings  */
import { isEmail } from '../../util/isEmail';
import Divider from '@mui/material/Divider';

import i18n from '../../i18n';
// A custom hook that builds on useLocation to parse
import server from '../../startup/serverConnect';

const PREFIX = 'AuthPageJoin';

const classes = {
  root: `${PREFIX}-root`,
  item: `${PREFIX}-item`,
  joinMain: `${PREFIX}-joinMain`,
  paper1: `${PREFIX}-paper1`,
  paper2: `${PREFIX}-paper2`,
  logoImg: `${PREFIX}-logoImg`,
  joinTitle: `${PREFIX}-joinTitle`,
  form: `${PREFIX}-form`,
  toggleEyeIcon: `${PREFIX}-toggleEyeIcon`,
  submit: `${PREFIX}-submit`,
  container: `${PREFIX}-container`,
  caption: `${PREFIX}-caption`,
  linkSignin: `${PREFIX}-linkSignin`,
  dialogRightContent: `${PREFIX}-dialogRightContent`,
  orgModalTitle: `${PREFIX}-orgModalTitle`,
  orgRole: `${PREFIX}-orgRole`,
  textFieldStyle: `${PREFIX}-textFieldStyle`,
  errorMessageBox: `${PREFIX}-errorMessageBox`
};

const StyledThemeProvider = styled('div')(({ theme }) => (
  {
  [`& .${classes.root}`]: {
    height: 'auto'
  },

  [`& .${classes.item}`]: {
    position: 'relative'
  },

  [`& .${classes.joinMain}`]: {
    display: 'flex',
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
      paper1: {
        padding: 0,
        boxShadow: 'none'
      },
      joinMain: {
        position: 'absolute'
      },
      dialogRightContent: {
        padding: '34px 16px',
        justifyContent: 'flex-start',
        width: '100%'
      }
    }
  },

  [`& .${classes.paper1}`]: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: 456,
    height: 616,
    padding: '32px 64px',
    background: '#FFFFFF',
    boxShadow: '0px 1px 6px 2px rgba(154, 154, 154, 0.34)',
    borderRadius: '8px',
    justifyContent: 'center'
  },

  [`& .${classes.paper2}`]: {
    marginTop: 0,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'left',
    width: 456,
    height: 'auto',
    padding: '58px 28px 36px',
    background: '#FFFFFF',
    boxShadow: '0px 1px 6px 2px rgba(154, 154, 154, 0.34)',
    borderRadius: '8px'
  },

  [`& .${classes.logoImg}`]: {
    width: 'auto',
    height: 40
  },

  [`& .${classes.joinTitle}`]: {
    color: '#232930',
    marginBottom: '8px',
    fontSize: '2rem',
    lineHeight: 1.125,
    fontStyle: 'normal',
    marginTop: '32px'
  },

  [`& .${classes.form}`]: {
    width: '100%', // Fix IE 11 issue.
    marginTop: theme.spacing(2.75)
  },

  [`& .${classes.toggleEyeIcon}`]: {
    position: 'absolute',
    right: 0,
    top: 19
  },

  [`& .${classes.submit}`]: {
    margin: theme.spacing(3, 0, 1),
    width: '100%',
    height: 56
  },

  [`& .${classes.container}`]: {
    marginTop: 0
  },

  [`& .${classes.caption}`]: {
    color: 'rgba(35, 41, 48, 0.65)',
    fontSize: '0.75rem'
  },

  [`& .${classes.linkSignin}`]: {
    textDecoration: 'none',
    fontSize: '1rem',
    fontWeight: 500
  },

  [`& .${classes.dialogRightContent}`]: {
    width: 490,
    padding: '45px 64px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  },

  [`& .${classes.orgModalTitle}`]: {
    color: '#232930',
    marginBottom: '8px',
    fontSize: '24px',
    lineHeight: 1.125,
    fontFamily: 'inter',
    fontWeight: 600,
    marginTop: '32px'
  },

  [`& .${classes.orgRole}`]: {
    color: 'rgba(35, 41, 48, 0.65)',
    fontSize: '0.875rem'
  },

  [`& .${classes.textFieldStyle}`]: {
    width: '100%',
    margin: '24px 0'
  },

  [`& .${classes.errorMessageBox}`]: {
    color: '#fd3426',
    display: 'flex',
    alignItems: 'center',
    paddingLeft: '15px'
  }
}));

function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function JoinPage() {

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const [name, setName] = useState(null);
  const [email, setEmail] = useState('prepare@boardx.us');
  const [password, setPassword] = useState(null);
  const [orgName, setOrgName] = useState(null);
  const [checked, setChecked] = useState<boolean>(false);
  const [openDialog, setOpenDialog] = useState<boolean>(false);
  const query = useQuery();
  const theme = useTheme();
  const inviteId = query.get('invite') ? query.get('invite') : '';
  const inviteOrgId = query.get('inviteOrgId')
    ? query.get('inviteOrgId')
    : null;
  const [errorName, setErrorName] = useState(false);
  const [errorEmail, setErrorEmail] = useState(false);
  const [errorPass, setErrorPass] = useState(false);
  const [errorOrgName, setErrorOrgName] = useState(false);
  const [errorMsgName, setErrorMsgName] = useState('');
  const [errorMsgEmail, setErrorMsgEmail] = useState('');
  const [errorMsgPass, setErrorMsgPass] = useState('');
  const [errorMsgOrgName, setErrorMsgOrgName] = useState('');
  const [registering, setRegistering] = useState(false);
  const callback = query.get('callback');
  const [linkSignin, setLinkSignin] = useState(
    callback ? `/signin?callback=${callback}` : '/signin'
  );

  const [openCreateOrg, setOpenCreateOrg] = useState(false);
  const [createBoardButtonLoading, setCreateBoardButtonLoading] =
    useState(false);

  const [getByEmailAddress] = useGetByEmailAddressMutation();
  const [insertNewOrg] = useInsertNewOrgMutation();
  const [registerUser] = useRegisterUserMutation();

  const handleRegisterUserMethod = async (
    username,
    email,
    pass,
    name,
    profile,
    language
  ) => {
    return await registerUser({
      username,
      email,
      pass,
      name,
      profile,
      language
    });
  };

  const handleGetByEmailAddress = async email => {
    return await getByEmailAddress(email);
  };

  //** Get the information filled in by the user */
  const setNameValue = e => {
    setName(e.target.value);
  };

  const setOrgNameValue = e => {
    setOrgName(e.target.value);
  };

  const setEmailValue = e => {
    console.log('evalue---------', e.target.value);
    setEmail(e.target.value);
  };

  const setPasswordValue = e => {
    setPassword(e.target.value);
  };

  const setCheckedValue = () => {
    if (checked) {
      setChecked(false);
    } else {
      setChecked(true);
      setOpenDialog(false);
    }
  };

  //** Control password show and hide */
  const handlEyeOpenClick = () => {
    if (!open) {
      setOpen(true);
      document.getElementById('password').setAttribute('type', 'text');
    } else {
      setOpen(false);
      document.getElementById('password').setAttribute('type', 'password');
    }
  };

  /**
   * Handle the loss of focus event on input elements.
   * If the input element is not empty, clear associated error messages and error states.
   * @param {Event} e - The event object representing the blur event.
   */
  const handleOnBlur = e => {
    if (e.target.value !== '') {
      if (e.target.id === 'name') {
        // If the 'name' input is not empty, clear its error state and message.
        setErrorName(false);
        setErrorMsgName('');
        return;
      }
      if (e.target.id === 'email') {
        // If the 'email' input is not empty, clear its error state and message.
        setErrorEmail(false);
        setErrorMsgEmail('');
        return;
      }
      if (e.target.id === 'password') {
        // If the 'password' input is not empty, clear its error state and message.
        setErrorPass(false);
        setErrorMsgPass('');
        return;
      }
    }
  };

  const handleRegisterUser = async (inviteId, inviteOrgId) => {
    setRegistering(true);
    setOpenCreateOrg(inviteOrgId ? false : true);
    const profile = { inviteId: inviteId };
    const language = i18n.language.slice(0, 2);
    let result: any = await handleRegisterUserMethod(
      email?.split('@')[0],
      email,
      password,
      name,
      profile,
      language
    );

    if (result && result.data) {
      server.login( {password, user: {email}}).then(async res => {
        setRegistering(false);
        let user= await server.call('getUserInfo');
       
        UserService.getInstance().saveStore(user);
        localStorage.setItem('token', res.token);
        const userId = user._id;
        const token = res.token;
        await server.call('saveLoginToken', userId,token);
        if (!inviteOrgId) {
          handleCreateOrganization();
        } else {
          handleSaveUserInfo(inviteOrgId);
        }
      }).catch(err => {
        Boardx.Util.Msg.warning(
          t('pages.authPageJoin.registerUser'),
          err.message
        );
      });

      // server.call('loginAuth2', email, password).then(res => {
      //   setRegistering(false);
      //   UserService.getInstance().saveStore(res.user);
      //   localStorage.setItem('token', res.token);
      //   if (!inviteOrgId) {
      //     handleCreateOrganization();
      //   } else {
      //     handleSaveUserInfo(inviteOrgId);
      //   }
      // }).catch(err => {
      //   Boardx.Util.Msg.warning(
      //     t('pages.authPageJoin.registerUser'),
      //     err.message
      //   );
      // });
    }
  };

  const logInWithLinkedin = () => {
    const clientId = '77n0zwjlzuyfte';
    let redirect_uri = window.location.origin + '/singinWithLinkedin';
    console.log('redirect_uri', redirect_uri);
    let uri = `https://www.linkedin.com/oauth/v2/authorization?response_type=code&client_id=${clientId}&redirect_uri=${redirect_uri}&state=foobar&scope=r_liteprofile%20r_emailaddress%20w_member_social`;

    window.location.href = uri;
  };

  //** User registration verification */
  const handleUserverification = async () => {
    if (!name && !email && !password && !checked) {
      setErrorName(true);
      setErrorMsgName(t('pages.authPageJoin.nameRequired'));
      setErrorEmail(true);
      setErrorMsgEmail(t('pages.authPageJoin.emailRequired'));
      setErrorPass(true);
      setErrorMsgPass(t('pages.authPageJoin.passwordRequired'));
      setOpenDialog(true);
      return;
    }

    if (!name) {
      setErrorName(true);
      setErrorMsgName(t('pages.authPageJoin.nameRequired'));
    }

    if (!email) {
      setErrorEmail(true);
      setErrorMsgEmail(t('pages.authPageJoin.emailRequired'));
    }

    if (!isEmail(email)) {
      setErrorEmail(true);
      setErrorMsgEmail(t('pages.authPageJoin.validEmail'));
    }

    if (!password) {
      setErrorPass(true);
      setErrorMsgPass(t('pages.authPageJoin.passwordRequired'));
    }

    if (!checked) {
      setOpenDialog(true);
    }

    if (!name || !email || !isEmail(email) || !password || !checked) return;

    let result: any = await handleGetByEmailAddress(email);
    if (result && result.data && result.data._id) {
      setErrorEmail(true);
      setErrorMsgEmail(t('pages.authPageJoin.emailExists'));
      setOpenCreateOrg(false);
      return;
    }

    if (inviteOrgId) {
      setOpenCreateOrg(false);
      handleRegisterUser(inviteId, inviteOrgId);
    } else {
      setOpenCreateOrg(true);
    }
  };

  /**
   * Registered Users
   * @handleCreateOrganization Users who are not invited to the organization, need to create an organization before registration.
   * @handleSaveUserInfo Users who have been invited to the organization, register directly.
   */

  //** Save user information */
  const handleSaveUserInfo = async inviteOrgId => {
    if (callback) {
      let boardId = callback.replace('/board/', '');
      localStorage.setItem('is_onboard', 'true');
      localStorage.setItem('dashBoardInviteTeamTutorials', 'true');
      history.push(callback);
    } else {
      localStorage.setItem('is_onboard', 'true');
      setOpenCreateOrg(false);
      setCreateBoardButtonLoading(false);
      history.push('/recent');
    }
  };

  //** Users who are not invited to the organization, need to create an organization before registration */
  const handleCreateOrganization = async () => {
    const orgId = UtilityService.getInstance().generateWidgetID();
    let user = store.getState().user.userInfo;
    await insertNewOrg({
      orgName: orgName,
      orgId: orgId,
      type: 'joinCreateOrg',
      user
    });
    handleSaveUserInfo(orgId);
  };

  //** User registration after creating an organization */
  const onSubmit = event => {
    event.preventDefault();
    if (!orgName) {
      setErrorOrgName(true);
      setErrorMsgOrgName(t('pages.organizationNameEmpty'));
      return;
    }
    setErrorOrgName(false);
    setErrorMsgOrgName('');
    handleRegisterUser(inviteId, inviteOrgId);
  };

  useEffect(() => {
    if (store.getState().user.userInfo.userId) {
      history.push('/recent');
    }
  }, []);

  return (
    <StyledThemeProvider theme={currentTheme}>
      {!openCreateOrg && (
        <Container className={classes.joinMain} component="main" maxWidth="lg">
          <CssBaseline />
          <div className={classes.paper2}>
            <a href="/" style={{ textAlign: 'center' }}>
              <img
                alt=""
                className={classes.logoImg}
                src="/images/logo_1.svg"
              />
            </a>
            <Typography
              align="left"
              className={classes.joinTitle}
              style={{
                fontSize: '24px',
                fontFamily: 'inter',
                fontWeight: '600'
              }}
            >
              {t('pages.authPageJoin.joinNew')}🚀
            </Typography>

            <form className={classes.form} noValidate>
              <Grid container spacing={2}>
                <Grid item xs={12}>
                  <TextField
                    autoComplete="fname"
                    autoFocus
                    classes={{ root: classes.root }}
                    error={errorName}
                    fullWidth
                    helperText={errorMsgName}
                    id="name"
                    onBlur={handleOnBlur}
                    label={t('pages.authPageJoin.name')}
                    name="fullName"
                    variant="outlined"
                    onChange={setNameValue}
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    autoComplete="email"
                    classes={{ root: classes.root }}
                    error={errorEmail}
                    fullWidth
                    helperText={errorMsgEmail}
                    id="email"
                    onBlur={handleOnBlur}
                    label={t('pages.authPageJoin.yourEmail')}
                    name="email"
                    variant="outlined"
                    onChange={setEmailValue}
                  />
                </Grid>
                <Grid className={classes.item} item xs={12}>
                  <TextField
                    autoComplete="current-password"
                    classes={{ root: classes.root }}
                    error={errorPass}
                    fullWidth
                    helperText={errorMsgPass}
                    id="password"
                    onBlur={handleOnBlur}
                    label={t('pages.authPageJoin.password')}
                    name="password"
                    type="password"
                    variant="outlined"
                    onChange={setPasswordValue}
                  />
                  <ToggleButton
                    className={classes.toggleEyeIcon}
                    onClick={handlEyeOpenClick}
                    selected={open}
                    value="password"
                  >
                    <RemoveRedEyeIcon />
                  </ToggleButton>
                </Grid>
                <Box
                  sx={{
                    display: 'flex',
                    pl: '8px',
                    alignItems: 'center',
                    marginTop: '10px'
                  }}
                >
                  <Checkbox
                    sx={{ p: '5px' }}
                    checked={checked}
                    onChange={setCheckedValue}
                    inputProps={{ 'aria-label': 'controlled' }}
                  />
                  <Box sx={{ display: 'table' }}>
                    <Typography
                      className={classes.caption}
                      variant="caption"
                      sx={{ display: 'table-cell', verticalAlign: 'middle' }}
                    >
                      {t('pages.authPageJoin.termsAndPrivacy1')}
                      <Link
                        target="_blank"
                        underline="none"
                        href='https://www.boardx.us/terms-of-use/'
                      >
                        {t('pages.authPageJoin.termsAndPrivacy2')}
                      </Link>
                      {t('pages.authPageJoin.termsAndPrivacy3')}
                      <Link
                        target="_blank"
                        underline="none"
                        href='https://www.boardx.us/privacy-policy/'
                      >
                        {t('pages.authPageJoin.termsAndPrivacy4')}
                      </Link>
                    </Typography>
                  </Box>
                </Box>
                <Box sx={{ display: openDialog ? 'block' : 'none' }}>
                  <Box className={classes.errorMessageBox}>
                    <ErrorOutlineIcon
                      sx={{ width: '18px', height: '18px', mr: '5px' }}
                    />
                    <Typography sx={{ fontSize: '14px' }}>
                      {t('pages.authPageJoin.AllowRules')}
                    </Typography>
                  </Box>
                </Box>
              </Grid>
              <Button
                className={classes.submit}
                color="primary"
                fullWidth
                id="submit"
                loading={registering}
                onClick={handleUserverification}
                variant="contained"
              >
                {t('pages.authPageJoin.joinNow')}
              </Button>
            </form>

            <Grid
              className={classes.container}
              container
              flexDirection="column"
              justifyContent="flex-start"
              alignItems="center"
            >
              <Typography
                className={classes.caption}
                variant="caption"
                style={{
                  fontSize: '16px',
                  fontWeight: '400',
                  marginTop: '28px'
                }}
              >
                {t('pages.authPageJoin.Alreadyhaveanaccount')}

                <Link
                  underline="none"
                  onClick={() => history.push(linkSignin)}
                  style={{ cursor: 'pointer' }}
                // href={linkSignin}
                >
                  {t('pages.authPageJoin.Signininstead')}
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
            >
              <Divider />
              <Typography style={{ margin: '0 8px' }}>
                {`${t('pages.authPageSignIn.or')}`}
              </Typography>
              <Divider />
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
          </div>
        </Container>
      )}

      {openCreateOrg && (
        <Container className={classes.joinMain} component="main" maxWidth="lg">
          <CssBaseline />
          <div className={classes.paper1}>
            <div className={classes.dialogRightContent}>
              <a onClick={e => e.preventDefault()}>
                <img
                  alt=""
                  className={classes.logoImg}
                  src="/images/logo_1.svg"
                />
              </a>
              <Typography
                align="left"
                className={classes.orgModalTitle}
                component="h1"
                variant="h1"
              >
                {t('pages.listPage.createOrg')}
              </Typography>
              <Typography className={classes.orgRole} component="p">
                {t('pages.listPage.orgRole')}
              </Typography>
              <TextField
                autoFocus
                error={errorOrgName}
                helperText={errorMsgOrgName}
                className={classes.textFieldStyle}
                defaultValue=""
                id="inputOrgName"
                inputProps={{ style: { width: '100%' } }}
                placeholder={t('pages.listPage.orgName')}
                onChange={setOrgNameValue}
              />
              <LoadingButton
                loading={createBoardButtonLoading}
                color="primary"
                onClick={onSubmit}
                style={{ height: 56, width: '100%' }}
                type="button"
                variant="contained"
              >
                {t('pages.create')}
              </LoadingButton>
            </div>
          </div>
        </Container>
      )}
    </StyledThemeProvider>
  );
}
