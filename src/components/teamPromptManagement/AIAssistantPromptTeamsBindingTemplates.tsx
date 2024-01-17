//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetOfficialTemplatesQuery } from '../../redux/ResourceAPISlice';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import Tab from '@mui/material/Tab';
import TabPanel from '@mui/lab/TabPanel';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { useTranslation } from 'react-i18next';

// ** Import components
import OfficialTemplate from './teamPromptBindingTemplateCategories/OfficialTemplate';
import TeamsTemplate from './teamPromptBindingTemplateCategories/TeamsTemplate';
import SharedTemplate from './teamPromptBindingTemplateCategories/SharedTemplate';

const PREFIX = 'AIAssistantPromptTeamsBindingTemplates';

const classes = {
  dialogBox: `${PREFIX}-dialogBox`,
  contentBox: `${PREFIX}-contentBox`,
  dialogHeader: `${PREFIX}-dialogHeader`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogSubtitle: `${PREFIX}-dialogSubtitle`,
  dialogContent: `${PREFIX}-dialogContent`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  tabRoot: `${PREFIX}-tabRoot`,
  tabTextButton: `${PREFIX}-tabTextButton`,
  tabPanelRoot: `${PREFIX}-tabPanelRoot`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.dialogBox}`]: {
    maxWidth: 'unset',
    borderRadius: '6px'
  },

  [`& .${classes.contentBox}`]: {
    width: '800px',
    maxWidth: '800px',
    height: 'auto',
    padding: '0 24px 10px',
    boxSizing: 'border-box'
  },

  [`& .${classes.dialogHeader}`]: {
    position: 'relative',
    paddingTop: '40px',
    width: '100%',
    marginBottom: '20px',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center'
  },

  [`& .${classes.dialogTitle}`]: {
    lineHeight: '19px',
    textAlign: 'center',
    fontWeight: '500',
    fontSize: '16px',
    textTransform: 'capitalize'
  },

  [`& .${classes.dialogSubtitle}`]: {
    textAlign: 'center',
    fontWeight: '400',
    fontSize: '12px',
    color: 'rgba(35, 41, 48, 0.65)',
    lineHeight: '15px',
    marginTop: '8px',
    marginBottom: '16px'
  },

  [`& .${classes.dialogContent}`]: {
    maxHeight: '500px',
    padding: 0,
    overflow: 'hidden',
    overflowY: 'scroll'
  },

  [`& .${classes.textFieldRoot}`]: {
    width: '400px',
    marginBottom: '15px',
    '& .MuiOutlinedInput-root': {
      padding: 0,
      height: '38px'
    }
  },

  [`& .${classes.tabRoot}`]: {
    minHeight: '21px',
    paddingBottom: '14px'
  },

  [`& .${classes.tabTextButton}`]: {
    minWidth: 'unset',
    minHeight: 'unset',
    textTransform: 'unset',
    color: 'rgba(35, 41, 48, 0.65)',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '21px',
    padding: '0 10px'
  },

  [`& .${classes.tabPanelRoot}`]: {
    height: '400px',
    padding: 0,
    overflow: 'hidden',
    overflowY: 'scroll'
  }
}));

const AIAssistantPromptTeamsBindingTemplates = props => {
  const {
    openBindingTemplatesDialog,
    setOpenBindingTemplatesDialog,
    currentBindingTemplatesData,
    setCurrentBindingTemplatesData
  } = props;

  const { t } = useTranslation();
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const { data: offTemplateList = [] } = useGetOfficialTemplatesQuery(orgId);
  const [currentTemplateData, setCurrentTemplateData] = React.useState(null);
  const [tabValue, setTabValue] = React.useState('1');

  useEffect(() => {
    if (offTemplateList) {
      setCurrentTemplateData(offTemplateList);
    }
  }, [offTemplateList]);

  const handleClosesDialog = () => {
    setOpenBindingTemplatesDialog(false);
  };

  const handleClickSave = () => {
    handleClosesDialog();
  };

  const handleChangeTabValue = (
    event: React.SyntheticEvent,
    newValue: string
  ) => {
    setTabValue(newValue);
  };

  const handleEnterSearchTemplate = value => {
    if (value.trim() !== '') {
      const result = offTemplateList.filter(item => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });
      setCurrentTemplateData(result);
    }
    handleChangeSearchValue(value);
  };

  const handleChangeSearchValue = value => {
    if (value.trim() === '') {
      setCurrentTemplateData(offTemplateList);
    }
  };

  return (
    <StyledDialog
      open={openBindingTemplatesDialog}
      onClose={handleClosesDialog}
      id="bindingTemplatesDialog"
      classes={{ paper: classes.dialogBox }}
    >
      <Box className={classes.contentBox}>
        {/* Title */}
        <Box className={classes.dialogHeader}>
          <Typography className={classes.dialogTitle} variant="h4">
            {t('promptManagement.pleaseSelectATemplate')}
          </Typography>
          <Typography className={classes.dialogSubtitle} variant="h4">
            {t(
              'promptManagement.mouseClickToSelectDoubleClickToDeselect'
            )}
          </Typography>
          <Divider sx={{ width: '100%' }} />
        </Box>

        <DialogContent classes={{ root: classes.dialogContent }}>
          <TabContext value={tabValue}>
            <TabList
              classes={{ root: classes.tabRoot }}
              onChange={handleChangeTabValue}
            >
              <Tab
                classes={{ textColorPrimary: classes.tabTextButton }}
                label={t('components.customTemplate.Official')}
                value="1"
              />
              <Tab
                classes={{ textColorPrimary: classes.tabTextButton }}
                label={t('components.customTemplate.teamsTemplate')}
                value="2"
              />
              <Tab
                classes={{ textColorPrimary: classes.tabTextButton }}
                label={t('components.customTemplate.Shared')}
                value="3"
              />
            </TabList>

            <TabPanel classes={{ root: classes.tabPanelRoot }} value="1">
              <OfficialTemplate
                currentBindingTemplatesData={currentBindingTemplatesData}
                setCurrentBindingTemplatesData={setCurrentBindingTemplatesData}
              />
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="2">
              <TeamsTemplate
                currentBindingTemplatesData={currentBindingTemplatesData}
                setCurrentBindingTemplatesData={setCurrentBindingTemplatesData}
              />
            </TabPanel>
            <TabPanel classes={{ root: classes.tabPanelRoot }} value="3">
              <SharedTemplate
                currentBindingTemplatesData={currentBindingTemplatesData}
                setCurrentBindingTemplatesData={setCurrentBindingTemplatesData}
              />
            </TabPanel>
          </TabContext>
        </DialogContent>

        <DialogActions>
          <Button variant="text" onClick={handleClosesDialog}>
            {t('promptManagement.cancel')}
          </Button>
          <Button
            disabled={!currentBindingTemplatesData}
            variant="contained"
            onClick={handleClickSave}
          >
            {t('promptManagement.save')}
          </Button>
        </DialogActions>
      </Box>
    </StyledDialog>
  );
};

export default AIAssistantPromptTeamsBindingTemplates;
