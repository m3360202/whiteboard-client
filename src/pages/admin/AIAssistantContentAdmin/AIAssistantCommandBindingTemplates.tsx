//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetOfficialTemplatesQuery } from '../../../redux/ResourceAPISlice';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import Divider from '@mui/material/Divider';
import { IconButton, InputAdornment, TextField } from '@mui/material';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';

const PREFIX = 'AIAssistantCommandBindingTemplates';

const classes = {
  dialogBox: `${PREFIX}-dialogBox`,
  contentBox: `${PREFIX}-contentBox`,
  dialogHeader: `${PREFIX}-dialogHeader`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogSubtitle: `${PREFIX}-dialogSubtitle`,
  dialogContent: `${PREFIX}-dialogContent`,
  imagesCommandBox: `${PREFIX}-imagesCommandBox`,
  cardRoot: `${PREFIX}-cardRoot`,
  cardRoot2: `${PREFIX}-cardRoot2`,
  cardMediaRoot: `${PREFIX}-cardMediaRoot`,
  cardMediaActive: `${PREFIX}-cardMediaActive`,
  customCommandName: `${PREFIX}-customCommandName`,
  textFieldRoot: `${PREFIX}-textFieldRoot`
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
    maxHeight: '350px',
    padding: 0,
    overflow: 'hidden',
    overflowY: 'scroll'
  },

  [`& .${classes.imagesCommandBox}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    justifyContent: 'space-between'
  },

  [`& .${classes.cardRoot}`]: {
    width: '174px',
    cursor: 'pointer',
    marginBottom: '10px',
    position: 'relative',
    borderRadius: '0px',
    boxShadow: 'none'
  },

  [`& .${classes.cardRoot2}`]: {
    width: '174px',
    opacity: 0
  },

  [`& .${classes.cardMediaRoot}`]: {
    boxSizing: 'border-box',
    borderRadius: '2px',
    border: '2px solid transparent',
    '&:hover': {
      boxSizing: 'border-box',
      border: '2px solid #F21D6B'
    }
  },

  [`& .${classes.cardMediaActive}`]: {
    padding: '2px',
    boxSizing: 'border-box',
    border: '2px solid #F21D6B'
  },

  [`& .${classes.customCommandName}`]: {
    color: '#232930',
    width: '100%',
    display: 'block',
    overflow: 'hidden',
    paddingTop: '4px',
    whiteSpace: 'nowrap',
    paddingRight: 0,
    textOverflow: 'ellipsis',
    fontSize: '14px',
    fontWeight: 400
  },

  [`& .${classes.textFieldRoot}`]: {
    width: '400px',
    marginBottom: '15px',
    '& .MuiOutlinedInput-root': {
      padding: 0,
      height: '38px'
    }
  }
}));

const AIAssistantCommandBindingTemplates = props => {
  const {
    openBindingTemplatesDialog,
    setOpenBindingTemplatesDialog,
    currentBindingTemplatesData,
    setCurrentBindingTemplatesData
  } = props;
  const { t } = useTranslation();


  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);

  const { data: offTemplateListData = [] } = useGetOfficialTemplatesQuery(orgId);

  const offTemplateList:any = offTemplateListData;

  const [currentTemplateData, setCurrentTemplateData] = React.useState(offTemplateListData);

  // useEffect(() => {
  //   if (offTemplateList) {
  //     setCurrentTemplateData(offTemplateList);
  //   }
  // }, [offTemplateList]);

  const handleClosesDialog = () => {
    setOpenBindingTemplatesDialog(false);
  };

  const handleClickSave = () => {
    handleClosesDialog();
  };

  /**
   * Handles the search input when the user presses the Enter key.
   *
   * @param {string} value - The search input value.
   */
  const handleEnterSearchTemplate = value => {
    // Check if the input value is not empty after trimming whitespace.
    if (value.trim() !== '') {
      // Filter the list of templates to find items whose name contains the search value (case-insensitive).
      const result = offTemplateList.filter(item => {
        return item.name.toLowerCase().includes(value.toLowerCase());
      });

      // Set the filtered template data as the current template data.
      setCurrentTemplateData(result);
    }

    // Call the handleChangeSearchValue function to update the search value.
    handleChangeSearchValue(value);
  };

  /**
   * Handles changes to the search input value.
   *
   * @param {string} value - The search input value.
   */
  const handleChangeSearchValue = value => {
    // Check if the trimmed value is empty.
    if (value.trim() === '') {

      // If the search input is empty, reset the current template data to the full list of templates.
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
          <TextField
            onContextMenu={e => {
              e.stopPropagation();
            }}
            onPaste={e => {
              e.stopPropagation();
            }}
            onChange={(event:any) => handleChangeSearchValue(event.target.value)}
            onKeyDown={(event:any) => {
              if (event.key === 'Enter')
                handleEnterSearchTemplate(event.target.value);
            }}
            classes={{ root: classes.textFieldRoot }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="end">
                  <IconButton sx={{ ml: '-10px' }} size="large">
                    <SearchOutlinedIcon />
                  </IconButton>
                </InputAdornment>
              )
            }}
            placeholder={t(
              'promptManagement.searchForTemplatesEnterToConfirm'
            )}
            variant="outlined"
          />
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
          <Box className={classes.imagesCommandBox}>
            {currentTemplateData &&
              currentTemplateData.map((item, index) => (
                <TemplatesCard
                  key={index}
                  item={item}
                  index={index}
                  currentBindingTemplatesData={currentBindingTemplatesData}
                  setCurrentBindingTemplatesData={
                    setCurrentBindingTemplatesData
                  }
                  classes={classes}
                />
              ))}

            {currentTemplateData &&
              currentTemplateData.length % 4 === 2 &&
              currentTemplateData
                .slice(0, 2)
                .map((item, index) => (
                  <Card
                    classes={{ root: classes.cardRoot2 }}
                    key={index}
                  ></Card>
                ))}

            {currentTemplateData &&
              currentTemplateData.length % 4 === 3 &&
              currentTemplateData
                .slice(0, 2)
                .map((item, index) => (
                  <Card
                    classes={{ root: classes.cardRoot2 }}
                    key={index}
                  ></Card>
                ))}
          </Box>
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

/**
 * Functional component for rendering a template card.
 *
 * @param {object} props - The component's props.
 * @param {object} item - The template data to display in the card.
 * @param {number} index - The index of the template in the list.
 * @param {object} currentBindingTemplatesData - The currently selected binding template data.
 * @param {function} setCurrentBindingTemplatesData - Function to set the currently selected binding template.
 * @param {object} classes - CSS classes for styling the component.
 */
const TemplatesCard = ({
  item,
  index,
  currentBindingTemplatesData,
  setCurrentBindingTemplatesData,
  classes
}) => (
  <Card
    classes={{ root: classes.cardRoot }}
    onClick={() => setCurrentBindingTemplatesData(item)}
    onDoubleClick={() => {
      setCurrentBindingTemplatesData(null);
    }}
    key={index}
  >
    <CardMedia
      classes={{ root: classes.cardMediaRoot }}
      className={
        currentBindingTemplatesData &&
        currentBindingTemplatesData._id === item._id
          ? classes.cardMediaActive
          : ''
      }
      component="img"
      width="174"
      height="108"
      image={
        item.thumbnail2
          ? item.thumbnail2
          : item.thumbnail
          ? item.thumbnail
          : '/images/abbdgor.png'
      }
    />
    <Typography className={classes.customCommandName}>{item.name}</Typography>
  </Card>
);

export default AIAssistantCommandBindingTemplates;
