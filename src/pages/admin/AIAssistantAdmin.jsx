//** Import react
import * as React from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Mui
import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

//** Import components
import AIAssistantContentAdminPage from './AIAssistantContentAdmin/AIAssistantContentAdminPage';
import AIAssistantImagesAdminPage from './AICustomStyleCommand/AIAssistantImagesAdminPage';

const PREFIX = 'AIAssistantAdmin';

const classes = {
  boxStyle: `${PREFIX}-boxStyle`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`&.${classes.boxStyle}`]: {
    width: '100%',
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    overflow: 'hidden'
  },

  [`& .${classes.tabRoot}`]: {
    padding: '8px 10px',
    fontSize: '14px',
  },

  [`& .${classes.tabPanelRoot}`]: {
    padding: '0px',
    width: '100%',
    height: '93%'
  }
}));

export default function AIAssitantAdmin() {

  const [tabValue, setTabValue] = React.useState('1');
  const { t } = useTranslation();
  const handleChangeTab = (event, newValue) => {
    setTabValue(newValue);
  };

  return (
    <StyledBox className={classes.boxStyle}>
      <TabContext value={tabValue}>
        <Box sx={{ mb: '18px' }}>
          <TabList onChange={handleChangeTab} aria-label="lab API tabs example">
            <Tab
              classes={{ root: classes.tabRoot }}
              label={t('promptManagement.content')}
              value="1"
            />
            <Tab
              classes={{ root: classes.tabRoot }}
              label={t('promptManagement.images')}
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel
          id="addNewPromptPopper"
          classes={{ root: classes.tabPanelRoot }}
          value="1"
        >
          <AIAssistantContentAdminPage />
        </TabPanel>
        <TabPanel
          id="addNewDetailPopper"
          classes={{ root: classes.tabPanelRoot }}
          value="2"
        >
          <AIAssistantImagesAdminPage />
        </TabPanel>
      </TabContext>
    </StyledBox>
  );
}
