//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n

import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useGetOrgListQuery,
  useRenameOrganizationMutation,
  useGetOrgMemberListQuery,
} from '../../redux/OrgAPISlice';
import { handleSetTeamsManagementTabPanel } from '../../store/org/index';

//** Import Mui
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import LoadingButton from '@mui/lab/LoadingButton';
import TextField from '@mui/material/TextField';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material';
import lightTheme from '../../mui/theme/lightTheme';

//** Import components
import OrganizationSettingsInviteUsers from './OrganizationSettingsInviteUsers';
import OrganizationSettingsMemberList from './OrganizationSettingsMemberList';
import OrganizationExtend from './OrganizationExtend';
import UserViewBilling from '../billing/Billing';
import AIAssistantPromptTeamsAdminPage from '../teamPromptManagement/AIAssistantPromptTeamsAdminPage';
import TeamTemplateManagementPage from '../teamTemplateManagement/TeamTemplateManagementPage';
import TeamContextManagementPage from '../teamContextManagement/TeamContextManagementPage';

const PREFIX = 'OrganizationSettings';

const classes = {
  root: `${PREFIX}-root`,
  textColorPrimary: `${PREFIX}-textColorPrimary`,
  updateOrgNameButton: `${PREFIX}-updateOrgNameButton`,
  inviteMembersCanAccessOrgText: `${PREFIX}-inviteMembersCanAccessOrgText`
};

const StyledThemeProvider = styled('div')((
  { theme }
) => ({
  [`& .${classes.root}`]: {
    '& .MuiOutlinedInput-input': {
      padding: '8px 0px 8px 12px',
      width: '360px',
      height: '40px',
      boxSizing: 'border-box'
    }
  },

  [`& .${classes.textColorPrimary}`]: {
    minWidth: 'unset',
    marginRight: '24px',
    padding: 0,
    textTransform: 'none'
  },

  [`& .${classes.updateOrgNameButton}`]: {
    marginLeft: '16px',
    width: '73px',
    height: '40px'
  },

  [`& .${classes.inviteMembersCanAccessOrgText}`]: {
    fontSize: '20px',
    fontWeight: 500,
    fontStyle: 'normal',
    margin: '24px 0px'
  }
}));

export default function OrganizationSettings() {
  //use
  const dispatch = useDispatch();

  const theme = useTheme();
  const { t } = useTranslation();

  //org
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const teamsManagementTabPanel = useSelector(
    (state: RootState) => state.org.teamsManagementTabPanel
  );
  const [orgMembers,setOrgMembers] = useState([]);
  const user = useSelector((state: RootState) => state.user.userInfo);
  const {data: orgList=[], isLoading, isError} = useGetOrgListQuery({userId:user.userId});
  const [
    renameOrganization,
    {
      isError: renameOrganizationIsError,
      isSuccess: renameOrganizationIsSuccess,
      isLoading: renameOrganizationIsLoading
    }
  ] = useRenameOrganizationMutation();

  const { data: orgMemberList = [] } = useGetOrgMemberListQuery({
    orgId: orgInfo.orgId
  });

  //dom
  const [orgName, setOrgName] = useState('');
  const [value, setValue] = useState('1');
  const [updateOrgNameButtonLoading, setUpdateOrgNameButtonLoading] = useState(false);

  useEffect(() => {
    setValue(teamsManagementTabPanel);
  }, [])

  const handleChange = (event, newValue) => {
    setValue(newValue);
    dispatch(handleSetTeamsManagementTabPanel(newValue));
  };

  useEffect(() => {
    if(orgMemberList.length>0){
      let newList = orgMemberList.filter((m)=>m.username && m.username.indexOf('vistor_')===-1);
      setOrgMembers(newList);
    }
    
  }, [orgMemberList]);

  useEffect(() => {
    setOrgName(orgInfo.name);
  }, [orgInfo]);


  const onSubmit = async (e) => {
    const newName = orgName.trim();

    if (newName === '') {
      Boardx.Util.Msg.info(t('pages.organizationNameEmpty'));
      return;
    }

    setUpdateOrgNameButtonLoading(true);
    await renameOrganization({
      orgId: orgInfo.orgId,
      newOrgName: newName,
      userId: store.getState().user.userInfo.userId,
    });
    // Boardx.Util.Msg.warning(error.message);
     Boardx.Util.Msg.success(t('pages.organizationUpdated'));
    setUpdateOrgNameButtonLoading(false);
  };


  return (
    <StyledThemeProvider theme={lightTheme}>
      <Box sx={{ width: '100%', typography: 'body1' }}>
        <TabContext value={value}>
          <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
            <TabList aria-label="lab API tabs example" onChange={handleChange}>
              <Tab
                classes={{ textColorPrimary: classes.textColorPrimary }}
                label={t('pages.listPage.roomSettings.general')}
                value="1"
              />
              {/* <Tab
                classes={{ textColorPrimary: classes.textColorPrimary }}
                label={t('pages.listPage.roomSettings.extend')}
                value="2"
              /> */}
              {/* <Tab
                classes={{ textColorPrimary: classes.textColorPrimary }}
                label={t('pages.listPage.roomSettings.billing')}
                value="3"
              /> */}
              <Tab
                classes={{ textColorPrimary: classes.textColorPrimary }}
                label={t('pages.listPage.roomSettings.prompt')}
                value="4"
              />
              <Tab
                classes={{ textColorPrimary: classes.textColorPrimary }}
                label={t('pages.listPage.roomSettings.template')}
                value="5"
              />
              <Tab
                classes={{ textColorPrimary: classes.textColorPrimary }}
                label={t('pages.listPage.roomSettings.teamsContext')}
                value="6"
              />
            </TabList>
          </Box>
          <TabPanel sx={{ p: 0, pb: '32px' }} value="1">
            <Box sx={{ flexGrow: 1, mt: '24px' }}>
              <Typography>
                {t('pages.listPage.roomSettings.organizationName')}
              </Typography>

              <Box
                sx={{
                  display: 'flex',
                  alignItems: 'center',
                  mt: '8px',
                  mb: '24px'
                }}
              >
                <TextField
                  classes={{ root: classes.root }}
                  id="orgName"
                  onChange={e => setOrgName(e.target.value)}
                  type="text"
                  value={orgName}
                />

                <LoadingButton
                  loading={updateOrgNameButtonLoading}
                  className={classes.updateOrgNameButton}
                  color="primary"
                  onClick={onSubmit}
                  size="small"
                  variant="contained"
                >
                  {t('pages.listPage.roomSettings.update')}
                </LoadingButton>
              </Box>

              <Divider sx={{ width: '916px' }} />
              <Typography
                className={classes.inviteMembersCanAccessOrgText}
                id="roomLabel"
              >
                {orgMemberList.length}{' '}
                {orgMemberList.length > 1
                  ? t('pages.listPage.inviteMembersCanAccessOrg')
                  : t('pages.listPage.inviteMemberCanAccessOrg')}
              </Typography>

              <OrganizationSettingsInviteUsers />
              <OrganizationSettingsMemberList orgInfo={orgInfo} />
            </Box>
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="2">
            <OrganizationExtend />
          </TabPanel>

          {/* {orgMembers && orgMembers.length > 0 && (
            <TabPanel sx={{ p: 0 }} value="3">
              <UserViewBilling orgMemberList={orgMembers} />
            </TabPanel>
          )} */}
          <TabPanel sx={{ p: 0 }} value="4">
            <AIAssistantPromptTeamsAdminPage />
          </TabPanel>
          <TabPanel
            sx={{
              p: 0,
              height: 'calc(100vh - 210px)',
              overflowY: 'scroll',
              pr: '5px'
            }}
            value="5"
          >
            <TeamTemplateManagementPage />
          </TabPanel>

          <TabPanel sx={{ p: 0 }} value="6">
            <TeamContextManagementPage />
          </TabPanel>
        </TabContext>
      </Box>
    </StyledThemeProvider>
  );
}
