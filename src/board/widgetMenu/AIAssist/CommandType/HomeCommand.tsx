// Import dependencies
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

//  Import i18n
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Tab from '@mui/material/Tab';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';

// Import custom components
import AICommandRecentsIcon from '../../../../mui/icons/AICommandRecentsIcon';
import AICommandFavoritesIcon from '../../../../mui/icons/AICommandFavoritesIcon';
import HomeRecentCommand from './HomeRecentCommand';
import HomeFavoritesCommand from './HomeFavoritesCommand';

const PREFIX = 'HomeCommand';

const classes = {
  tabsRoot: `${PREFIX}-tabsRoot`,
  tabsFlexContainer: `${PREFIX}-tabsFlexContainer`,
  labelIcon: `${PREFIX}-labelIcon`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.tabsRoot}`]: {
    minHeight: '24px'
  },

  [`& .${classes.tabsFlexContainer}`]: {
    height: '24px',
    minHeight: '24px'
  },

  [`& .${classes.labelIcon}`]: {
    padding: '0px 5px',
    height: '24px',
    minHeight: '24px',
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '18px',
    letterSpacing: '0.16px',
    color: '#3A3541',
    textTransform: 'none'
  },

  [`& .${classes.tabPanelRoot}`]: {
    padding: '0px'
  }
}));

/**
 * HomeCommand component
 *
 * @param {Object} props
 * @param {Function} props.handleCommand - Function to handle command selection
 *
 * @return {JSX.Element} HomeCommand component
 */
function HomeCommand({ handleCommand }) {

  const [value, setValue] = useState('1');
  const { t } = useTranslation();
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <StyledBox sx={{ mt: '8px' }}>
      <TabContext value={value}>
        <Box>
          <TabList
            classes={{
              root: classes.tabsRoot,
              flexContainer: classes.tabsFlexContainer
            }}
            onChange={handleChange}
            aria-label="lab API tabs example"
          >
            <Tab
              classes={{ labelIcon: classes.labelIcon }}
              icon={<AICommandRecentsIcon />}
              iconPosition="start"
              label={t('widgetAi.recents')}
              value="1"
            />
            <Tab
              classes={{ labelIcon: classes.labelIcon }}
              icon={<AICommandFavoritesIcon />}
              iconPosition="start"
              label={t('widgetAi.favorites')}
              value="2"
            />
          </TabList>
        </Box>
        <TabPanel classes={{ root: classes.tabPanelRoot }} value="1">
          <HomeRecentCommand handleCommand={handleCommand} />
        </TabPanel>
        <TabPanel classes={{ root: classes.tabPanelRoot }} value="2">
          <HomeFavoritesCommand handleCommand={handleCommand} />
        </TabPanel>
      </TabContext>
    </StyledBox>
  );
}

HomeCommand.propTypes = {
  handleCommand: PropTypes.func.isRequired
};

export default HomeCommand;
