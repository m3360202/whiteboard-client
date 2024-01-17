//** Import react
import React, { useRef, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
//** Import i18n
import { useTranslation } from 'react-i18next';


//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetOrgListQuery,
  useInsertNewOrgMutation
} from '../../redux/OrgAPISlice';

//** Import Mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import LoadingButton from '@mui/lab/LoadingButton';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';


//** Import Services
import { OrgService, BoardService, UtilityService } from '../../services';

const PREFIX = 'OrganizationCreateOrgModal';

const classes = {
  orgModalMain: `${PREFIX}-orgModalMain`,
  scrollPaper: `${PREFIX}-scrollPaper`,
  paper: `${PREFIX}-paper`,
  containerStyle: `${PREFIX}-containerStyle`,
  createTeamImg: `${PREFIX}-createTeamImg`,
  logoImg: `${PREFIX}-logoImg`,
  orgModalTitle: `${PREFIX}-orgModalTitle`,
  orgRole: `${PREFIX}-orgRole`,
  textFieldStyle: `${PREFIX}-textFieldStyle`,
  dialogRightContent: `${PREFIX}-dialogRightContent`
};

const Root = styled('div')({
  [`&.${classes.orgModalMain}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',

    '@media (max-width: 912px)': {
      dialogRightContent: {
        padding: '34px 16px',
        justifyContent: 'flex-start'
      },
      paper: {
        width: '100%',
        height: '100%',
        borderRadius: 0
      },
      containerStyle: {
        justifyContent: 'center'
      }
    },
    '@media (max-height: 644px)': {
      scrollPaper: {
        height: 'auto',
        marginTop: 48
      }
    }
  },
  [`& .${classes.scrollPaper}`]: {
    height: '100%'
  },
  [`& .${classes.paper}`]: {
    width: 'auto',
    height: 'auto',
    maxHeight: 'none',
    maxWidth: 'none',
    overflow: 'hidden',
    borderRadius: '8px',
    boxShadow: '0px 1px 6px 2px rgba(154, 154, 154, 0.34)'
  },
  [`& .${classes.containerStyle}`]: {
    display: 'flex',
    padding: 0
  },
  [`& .${classes.createTeamImg}`]: {
    width: 456
  },
  [`& .${classes.logoImg}`]: {
    width: 'auto',
    height: 40
  },
  [`& .${classes.orgModalTitle}`]: {
    color: '#232930',
    marginBottom: '8px',
    fontSize: '2rem',
    lineHeight: 1.125,
    fontStyle: 'normal',
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
  [`& .${classes.dialogRightContent}`]: {
    width: 490,
    padding: '45px 64px',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'flex-start',
    alignItems: 'center'
  }
});

export default function OrganizationCreateOrgModal({ handleClose, openCreateOrg, setOpenCreateOrg, }) {
  // use
  const theme = useTheme();
  const { t } = useTranslation();
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const history = useHistory();
  const nameRef: any = useRef();

  const dispatch = useDispatch();
  //org
  const user = useSelector((state: RootState) => state.user.userInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const {data: orgList=[], isLoading, isError} = useGetOrgListQuery({userId:user.userId});
  const [insertNewOrg,{error}] = useInsertNewOrgMutation();

  const [flag, setFlag] = React.useState(false);
  const [createOrgButtonLoading, setCreateOrgButtonLoading] = React.useState(false);

  useEffect(() => {
    setFlag(!openCreateOrg);
  });

  //创建org
  const handleCreateOrganization = async (e) => {
    let orgName = nameRef.current ? nameRef.current.value.trim() : '';
    if (orgName.length === 0) {
      Boardx.Util.Msg.info(t('pages.organizationNameEmpty'));
      return;
    }
    setFlag(true);
    setCreateOrgButtonLoading(true);
    const orgId = UtilityService.getInstance().generateWidgetID();
    let user = store.getState().user.userInfo;
    await insertNewOrg({ orgName: orgName, orgId: orgId, type:'dashBoardCreateOrg',user });
    history.push('/recent');
    // Boardx.Util.Msg.warning(error.reason);
     setOpenCreateOrg(false);
     setFlag(false);
     setCreateOrgButtonLoading(false);
  };

  return (
    <Root className={classes.orgModalMain} id="main">
      <Dialog
        aria-labelledby="responsive-dialog-title"
        // classes={{ scrollPaper: classes.scrollPaper, paper: classes.paper }}
        sx={{
          '& .MuiDialog-scrollPaper': {
            height: '100%'
          },
          '& .MuiDialog-paper': {
            width: 'auto',
            height: 'auto',
            maxHeight: 'none',
            maxWidth: 'none',
            overflow: 'hidden',
            borderRadius: '8px',
            boxShadow: '0px 1px 6px 2px rgba(154, 154, 154, 0.34)'
          }
        }}
        fullScreen={fullScreen}
        fullWidth
        id="dialog"
        onClose={handleClose}
        open={openCreateOrg}
      >
        <Container
          // className={classes.containerStyle}
          sx={{ display: 'flex', padding: 0 }}
          component="main"
          maxWidth="lg"
        >
          <CssBaseline />
          <Box
            sx={{
              width: 490,
              padding: '45px 64px',
              display: 'flex',
              flexDirection: 'column',
              justifyContent: 'flex-start',
              alignItems: 'center'
            }}
          >
            <a onClick={e => e.preventDefault()}>
              <img
                alt=""
                // className={classes.logoImg}
                style={{ width: 'auto', height: '40px' }}
                src="/images/logo_1.svg"
              />
            </a>
            <Typography
              align="left"
              // className={classes.orgModalTitle}
              sx={{
                color: '#232930',
                marginBottom: '8px',
                fontSize: '2rem',
                lineHeight: 1.125,
                fontStyle: 'normal',
                marginTop: '32px'
              }}
              component="h1"
              variant="h1"
            >
              {t('pages.listPage.createOrg')}
            </Typography>
            <Typography
              // className={classes.orgRole}
              sx={{ color: 'rgba(35, 41, 48, 0.65)', fontSize: '0.875rem' }}
              component="p"
            >
              {t('pages.listPage.orgRole')}
            </Typography>
            <TextField
              // className={classes.textFieldStyle}
              sx={{ width: '100%', margin: '24px 0' }}
              defaultValue=""
              id="inputOrgName"
              inputProps={{ style: { width: '100%' } }}
              inputRef={nameRef}
              placeholder={t('pages.listPage.orgName')}
            />
            <LoadingButton
              loading={createOrgButtonLoading}
              color="primary"
              onClick={handleCreateOrganization}
              style={{ height: 56, width: '100%' }}
              type="button"
              variant="contained"
              disabled={flag}
            >
              {t('pages.create')}
            </LoadingButton>
          </Box>
        </Container>
      </Dialog>
    </Root>
  );
}
