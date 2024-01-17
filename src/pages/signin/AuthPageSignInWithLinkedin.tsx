//**Import React  */
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory, useLocation } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//**Import Mui */
import CssBaseline from '@mui/material/CssBaseline';

import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import { ThemeProvider } from '@mui/material';

import currentTheme from '../../mui/theme/lightTheme';

//* i18n */
import i18n from '../../i18n';

//**Import Redux kit  */
import store, { RootState } from '../../store';
import { handleSetUserInfo } from '../../store/user';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetLinkedinUserEmailQuery,
  useRegisterUserMutation
} from '../../redux/UserAPISlice';

import { useInsertNewOrgMutation } from '../../redux/OrgAPISlice';

//**Import Service  */
import {
  UserService,
  UtilityService
} from '../../services';
import server from '../../startup/serverConnect';
import { get } from 'jquery';

const PREFIX = 'AuthPageSignInWithLinkedin';

const classes = {
  joinMain: `${PREFIX}-joinMain`,
  paper1: `${PREFIX}-paper1`,
  logoImg: `${PREFIX}-logoImg`,
  avatar: `${PREFIX}-avatar`,
  dialogRightContent: `${PREFIX}-dialogRightContent`,
  orgModalTitle: `${PREFIX}-orgModalTitle`,
  orgRole: `${PREFIX}-orgRole`,
  textFieldStyle: `${PREFIX}-textFieldStyle`
};

const StyledThemeProvider = styled('div')(({ theme }) => ({
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

  [`& .${classes.logoImg}`]: {
    width: 'auto',
    height: 40
  },

  [`& .${classes.avatar}`]: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main
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
  }
}));

// A custom hook that builds on useLocation to parse
// the query string for you.
function useQuery() {
  return new URLSearchParams(useLocation().search);
}

export default function JoinPage() {

  const dispatch = useDispatch();
  const history = useHistory();
  const { t } = useTranslation();
  const [orgName, setOrgName] = useState(null);
  const query = useQuery();

  const [errorOrgName, setErrorOrgName] = useState(false);
  const [errorMsgOrgName, setErrorMsgOrgName] = useState('');
  const [registerUser] = useRegisterUserMutation();

  const [openCreateOrg, setOpenCreateOrg] = useState(false);
  const [createBoardButtonLoading, setCreateBoardButtonLoading] = useState(false);
  const { data: anyLinkedInData } = useGetLinkedinUserEmailQuery({
    code: query.get('code'),
    uri: window.location.origin + '/singinWithLinkedin'
  });
  const getLinkedInData = anyLinkedInData as any;
  const [insertNewOrg] = useInsertNewOrgMutation();
  const language = i18n.language.slice(0, 2);
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
  const setOrgNameValue = e => {
    setOrgName(e.target.value);
  };

  //** save store */
  const saveStore = async result => {

    await dispatch(
      handleSetUserInfo({
        email: result.emails[0].address,
        nickName: result.name,
        userName: result.username,
        status: result.status,
        avatar:
          result.head_url && result.head_url.indexOf('cn-boardx.oss') > -1
            ? ''
            : result.head_url,
        avatarType: result.updateImg ? 'data' : 'nickname',
        type: result.type,
        userId: result._id,
        credits: result.credits,
        emailVerified: result.emails[0].verified,
        createdAt: result.createdAt,
        roles: result.roles
      })
    );
  };

  //** Save user information */
  const handleSetStorageInfo = () => {
    localStorage.setItem('is_onboard', 'true');
    setOpenCreateOrg(false);
    setCreateBoardButtonLoading(false);
    history.go(-2);
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
    handleSetStorageInfo();
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
    handleCreateOrganization();
  };
  useEffect(() => {
    console.log('useGetLinkedinUserEmailQuery',getLinkedInData)
    if (getLinkedInData && getLinkedInData.profile) {
      
      const deal = async () => {
        let result: any = await handleRegisterUserMethod(
          getLinkedInData.profile.name,
          getLinkedInData.profile.email,
          getLinkedInData.profile.pass,
          getLinkedInData.profile.name,
          getLinkedInData.profile.profile,
          language
        );
        if (result && result.data) {
          let email= result.data.emails[0].address, password=result.data.pass;
          server.login( {password, user: {email}}).then(res => {
            saveStore(result.data);
            localStorage.setItem('token', res.token);
            const userId = result.data._id;
            const token = res.token;
            server.call('saveLoginToken', userId, token).then(() => {
              history.push('/recent');
            });
            
          }).catch(err => {
            Boardx.Util.Msg.warning(
              t('pages.authPageJoin.registerUser'),
              err.message
              );
            }
          );

          // server.call('loginAuth2', getLinkedInData.profile.email, getLinkedInData.profile.pass).then(res => {
          //   saveStore(result.data);
          //   localStorage.setItem('token', res.token);
          //   setOpenCreateOrg(true);
          // }).catch(err => {
          //   Boardx.Util.Msg.warning(
          //     t('pages.authPageJoin.registerUser'),
          //     err.message
          //   );
          // });
        }

      }
      deal();
    }
    if (getLinkedInData && getLinkedInData.email) {
      let email=getLinkedInData.email, password= 'boardx@linkedin';

      server.login( {password, user: {email}}).then(async res => {
        let user = await server.call('getUserInfo');
        UserService.getInstance().saveStore(user);
        localStorage.setItem('token', res.token);
        const userId = res.data._id;
            const token = res.token;
            server.call('saveLoginToken', userId, token).then(() => {
              history.push('/recent');
            });
      }).catch(err => {
          Boardx.Util.Msg.warning(
            t('pages.authPageJoin.registerUser'),
            err.message
          );
        });

      // server.call('loginAuth2', getLinkedInData.email, 'boardx@linkedin').then(res => {
      //   UserService.getInstance().saveStore(res.user);
      //   localStorage.setItem('token', res.token);
      //   history.push('/recent');
      // }).catch(err => {
      //   Boardx.Util.Msg.warning(
      //     t('pages.authPageJoin.registerUser'),
      //     err.message
      //   );
      // });
    }
  }, [getLinkedInData]);

  return (
    <StyledThemeProvider theme={currentTheme}>
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
