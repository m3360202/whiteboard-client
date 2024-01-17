//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import { DataGrid } from '@mui/x-data-grid';
import Divider from '@mui/material/Divider';

//** Import components
import TeamsAddCustomizedContentOutputFormat from './TeamsAddCustomizedContentOutputFormat';
import TeamsEditCustomizedContentOutputFormat from './TeamsEditCustomizedContentOutputFormat';

const PREFIX = 'AIAssistantPromptTeamsCustomizedOutputFormat';

const classes = {
  dialogBox: `${PREFIX}-dialogBox`,
  contentBox: `${PREFIX}-contentBox`,
  dialogHeader: `${PREFIX}-dialogHeader`,
  dialogTitle: `${PREFIX}-dialogTitle`,
  dialogSubtitle: `${PREFIX}-dialogSubtitle`,
  dialogContent: `${PREFIX}-dialogContent`,
  editButton: `${PREFIX}-editButton`,
  deleteButton: `${PREFIX}-deleteButton`,
  addButton: `${PREFIX}-addButton`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.dialogBox}`]: {
    maxWidth: 'unset',
    borderRadius: '6px'
  },

  [`& .${classes.contentBox}`]: {
    width: '850px',
    maxWidth: '850px',
    height: 'auto',
    padding: '0 24px 10px',
    boxSizing: 'border-box'
  },

  [`& .${classes.dialogHeader}`]: {
    position: 'relative',
    paddingTop: '30px',
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

  [`& .${classes.editButton}`]: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    marginRight: '6px'
  },

  [`& .${classes.deleteButton}`]: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#F21D6B'
  },

  [`& .${classes.addButton}`]: {
    fontSize: '14px',
    fontWeight: '500',
    color: '#fff',
    marginLeft: '-8px'
  }
}));

const AIAssistantPromptTeamsCustomizedOutputFormat = props => {
  const {
    openCustomizedOutputFormatDialog,
    setOpenCustomizedOutputFormatDialog,
    customizedContentOutputFormat,
    setCustomizedContentOutputFormat,
    currentRowData,
    setCurrentRowData
  } = props;

  const { t } = useTranslation();

  const [currentSelectFormat, setCurrentSelectFormat] = React.useState(null);

  const [
    openAddCustomizedContentOutputFormatDialog,
    setOpenAddCustomizedContentOutputFormatDialog
  ] = React.useState(false);

  const [
    openEditCustomizedContentOutputFormatDialog,
    setOpenEditCustomizedContentOutputFormatDialog
  ] = React.useState(false);

  /**
   * Handles the action to close a dialog or modal.
   * This function sets the state to indicate that the customized output format dialog should be closed.
   */
  const handleClosesDialog = () => {
    setOpenCustomizedOutputFormatDialog(false);
  };

  /**
   * Handles the save action when a user clicks a save button.
   * This function performs the following tasks:
   * 1. Closes a dialog.
   * 2. Updates the current row's data with a customizedContentOutputFormat property.
   */
  const handleClickSave = () => {
    // Close the dialog (assuming handleClosesDialog is a function that handles dialog closing).
    handleClosesDialog();

    // Update the current row's data by merging the existing data with a new customizedContentOutputFormat property.
    setCurrentRowData({
      ...currentRowData, // Spread the existing data to preserve other properties.
      customizedContentOutputFormat // Add or update the customizedContentOutputFormat property.
    });
  };

  /**
   * Handles the action to open a dialog or modal for adding customized content output formats.
   * This function sets the state to indicate that the "Add Customized Content Output Format" dialog should be opened.
   */
  const handleAddCustomizedContentOutputFormat = () => {
    setOpenAddCustomizedContentOutputFormatDialog(true);
  };

  /**
   * Handles the action to open a dialog or modal for editing a customized content output format.
   * This function takes `params` as a parameter, which likely contains information about the format to be edited.
   * It sets the state to indicate that the "Edit Customized Content Output Format" dialog should be opened
   * and updates the current selected format with the format specified in `params.row`.
   *
   * @param {object} params - Parameters that likely contain information about the format to be edited.
   */
  const handleEditCustomizedContentOutputFormat = params => {
    // Update the current selected format with the format specified in `params.row`.
    setCurrentSelectFormat(params.row);

    // Set the state to indicate that the "Edit Customized Content Output Format" dialog should be opened.
    setOpenEditCustomizedContentOutputFormatDialog(true);
  };

  /**
   * Handles the action to delete a customized content output format.
   * This function takes `params` as a parameter, which likely contains information about the format to be deleted.
   * It filters the existing `customizedContentOutputFormat` array to remove the format specified in `params.row.id`
   * and updates the state with the modified array.
   *
   * @param {object} params - Parameters that likely contain information about the format to be deleted.
   */
  const handleDeleteCustomizedContentOutputFormat = params => {
    // Filter the existing customized content output formats array to remove the specified format.
    const newCustomizedContentOutputFormat =
      customizedContentOutputFormat.filter(item => item.id !== params.row.id);

    // Update the state with the modified array, effectively deleting the format.
    setCustomizedContentOutputFormat(newCustomizedContentOutputFormat);
  };

  const columns = [
    {
      field: 'title',
      headerName: t('promptManagement.title'),
      width: 100,
      type: 'string'
    },
    {
      field: 'description',
      headerName: t('promptManagement.itemsToBeGenerated'),
      width: 500,
      type: 'string'
    },
    {
      field: 'id',
      headerName: t('promptManagement.edit'),
      width: 180,
      renderCell: params => {
        return (
          <Box style={{ display: 'flex' }}>
            <Button
              variant="contained"
              className={classes.editButton}
              onClick={() => handleEditCustomizedContentOutputFormat(params)}
            >
              {t('promptManagement.edit')}
            </Button>
            <Button
              variant="outlined"
              className={classes.deleteButton}
              onClick={() => handleDeleteCustomizedContentOutputFormat(params)}
            >
              {t('promptManagement.delete')}
            </Button>
          </Box>
        );
      }
    }
  ];

  return (
    <StyledDialog
      open={openCustomizedOutputFormatDialog}
      onClose={handleClosesDialog}
      id="customizedOutputFormatDialog"
      classes={{ paper: classes.dialogBox }}
    >
      <Box className={classes.contentBox}>
        {/* Title */}
        <Box className={classes.dialogHeader}>
          <Typography className={classes.dialogTitle} variant="h4">
            {t('promptManagement.customizingTheOutputFormat')}
          </Typography>
          <Typography className={classes.dialogSubtitle} variant="h4">
            {t('promptManagement.clickTheBottomLeftButtonToAdd')}
          </Typography>
          <Divider sx={{ width: '100%' }} />
        </Box>

        <DialogContent classes={{ root: classes.dialogContent }}>
          <DataGrid
            style={{ height: '480px' }}
            rows={customizedContentOutputFormat}
            columns={columns}
            disableColumnMenu
            rowsPerPageOptions={[25, 50, 100]}
            getRowId={row => row.id}
            hideFooter
          />
        </DialogContent>

        <DialogActions sx={{ justifyContent: 'space-between' }}>
          <Button
            variant="contained"
            className={classes.addButton}
            onClick={handleAddCustomizedContentOutputFormat}
          >
            {t('promptManagement.add')}
          </Button>
          <Box style={{display:'flex'}}>
            <Button variant="text" onClick={handleClosesDialog}>
              {t('promptManagement.cancel')}
            </Button>
            <Button variant="contained" onClick={handleClickSave}>
              {t('promptManagement.save')}
            </Button>
          </Box>
        </DialogActions>

        <TeamsAddCustomizedContentOutputFormat
          openAddCustomizedContentOutputFormatDialog={
            openAddCustomizedContentOutputFormatDialog
          }
          setOpenAddCustomizedContentOutputFormatDialog={
            setOpenAddCustomizedContentOutputFormatDialog
          }
          setCustomizedContentOutputFormat={setCustomizedContentOutputFormat}
          customizedContentOutputFormat={customizedContentOutputFormat}
        />

        <TeamsEditCustomizedContentOutputFormat
          currentSelectFormat={currentSelectFormat}
          openEditCustomizedContentOutputFormatDialog={
            openEditCustomizedContentOutputFormatDialog
          }
          setOpenEditCustomizedContentOutputFormatDialog={
            setOpenEditCustomizedContentOutputFormatDialog
          }
          setCustomizedContentOutputFormat={setCustomizedContentOutputFormat}
          customizedContentOutputFormat={customizedContentOutputFormat}
        />
      </Box>
    </StyledDialog>
  );
};

export default AIAssistantPromptTeamsCustomizedOutputFormat;
