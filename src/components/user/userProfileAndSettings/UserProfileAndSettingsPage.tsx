//** Import react
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import { ThemeProvider } from '@mui/material';
import currentTheme from '../../../mui/theme/lightTheme';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

//** Imort components
import OrganizationInviteMembersModal from '../../../components/org/OrganizationInviteMembersModal';
import UserMenu from '../../../components/user/UserMenu';
import UserAccount from './UserAccount';
import UserSettings from './UserSettings';
import UserBilling from './UserBilling';

//**Import Services
import UserService from '../../../services/UserService';



function UserProfileAndSettingsPage() {

  const history = useHistory();
  const { t } = useTranslation();
  const [tabValue, setTabValue] = useState('1');
  const settings = useSelector((state: RootState) => state.system.settings)?.websiteSettings;

  const isOrgAdmin =
    useSelector((state: RootState) => state.org.orgInfo.role) !== 'member'
      ? true
      : false;

  const handleOrganizationInviteMembersModalDOM = () => {
    if (!isOrgAdmin) return null;
    return <OrganizationInviteMembersModal />;
  };

  const logout = () => {
    UserService.getInstance().logout();
    // history.push('/signin');
    window.location.href = '/signin';
  };

  const handleClickBackToHome = () => {
    history.push('/recent');
  };

  const handleChangeTabs = (event: React.SyntheticEvent, newValue: string) => {
    setTabValue(newValue);
  };

  return (
      <Box
        sx={{
          width: '100%',
          height: '100%'
        }}
      >
        {/* 页头 */}
        <Box sx={{   display: 'flex',
    justifyContent: 'space-between',
    padding: '14px 24px 0px 20px',
    '.flexBox': {display: 'flex',
    alignItems: 'center',
    cursor: 'pointer'}}}>
          <Box className={'flexBox'} onClick={handleClickBackToHome}>
            <ChevronLeftIcon style={{ color: 'rgba(58, 53, 65, 0.68)' }} />
            <Typography sx={{   fontWeight: 500,
    fontSize: '16px',
    lineHeight: '24px',
    color: 'rgba(58, 53, 65, 0.68)',
    marginLeft: '4px'}}>
              {t('components.userProfileAndSettingsPage.backToHome')}
            </Typography>
          </Box>
          <Box className={'flexBox'}>
            {handleOrganizationInviteMembersModalDOM()}
            <UserMenu logout={logout} />
          </Box>
        </Box>

        {/* 页主体 */}
        <Box
          sx={{
            mt: '28px',
            p: '0 24px',
            height: 'calc(100% - 78px)'
          }}
        >
          <Box sx={{ display: 'flex',
    alignItems: 'center'}}>
            <Typography variant="h6" sx={{ fontWeight: 500,
    fontSize: '32px',
    lineHeight: '50px',
    color: '#232930',
    marginRight: '12px'}}>
              {t('components.userProfileAndSettingsPage.profile')} &{' '}
              {t('components.userProfileAndSettingsPage.settings')}
            </Typography>
            <Typography variant="body2" sx={{fontWeight: 400,
    fontSize: '12px',
    lineHeight: '14%',
    color: 'rgba(58, 53, 65, 0.38)',
    letterSpacing: '0.15px'}}>
              Version: {settings && settings.version ? settings.version : '0.2.3'}
            </Typography>
          </Box>

          <TabContext value={tabValue}>
            <Box sx={{ height: 'calc(100% - 50px)',
            '.TabPanelRoot':{padding: '24px 8px 0px 0px',
            boxSizing: 'border-box',
            height: 'calc(100vh - 250px)',
            overflowY: 'scroll'},
            '.tabRoot':{  padding: '12px 18px',
                  fontWeight: 500,
                  fontSize: '14px',
                  lineHeight: '24px',
                  textAlign: 'center',
                  letterSpacing: '0.4px',
                  textTransform: 'uppercase'}
            
            }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <TabList
                  onChange={handleChangeTabs}
                  aria-label="lab API tabs example"
                >
                  <Tab
                    label={t('components.userProfileAndSettingsPage.account')}
                    classes={{ root: 'tabRoot' }}
                    value="1"
                  />
                  {/* <Tab
                    label={t('components.userProfileAndSettingsPage.billing')}
                    classes={{ root: 'tabRoot' }}
                    value="2"
                  /> */}
                  <Tab
                    label={t('components.userProfileAndSettingsPage.settings')}
                    classes={{ root: 'tabRoot'}}
                    value="3"
                  />
                </TabList>
              </Box>
              <TabPanel classes={{ root:'TabPanelRoot' }} value="1">
                <UserAccount />
              </TabPanel>
              {/* <TabPanel classes={{ root: 'TabPanelRoot' }} value="2">
                <UserBilling />
              </TabPanel> */}
              <TabPanel classes={{ root: 'TabPanelRoot' }} value="3">
                <UserSettings />
              </TabPanel>
            </Box>
          </TabContext>
        </Box>
      </Box>
  );
}

export default UserProfileAndSettingsPage;
