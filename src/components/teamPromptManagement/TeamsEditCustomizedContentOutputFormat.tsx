//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import TextField from '@mui/material/TextField';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';
import Typography from '@mui/material/Typography';

const PREFIX = 'TeamsEditCustomizedContentOutputFormat';

const classes = {
  dialogBox: `${PREFIX}-dialogBox`,
  contentBox2: `${PREFIX}-contentBox2`,
  textAreaStyle: `${PREFIX}-textAreaStyle`,
  inputTitle: `${PREFIX}-inputTitle`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.dialogBox}`]: {
    maxWidth: 'unset',
    borderRadius: '6px'
  },

  [`& .${classes.contentBox2}`]: {
    width: '500px',
    height: 'auto',
    padding: '18px 24px 10px',
    boxSizing: 'border-box'
  },

  [`& .${classes.textAreaStyle}`]: {
    width: '100%',
    resize: 'none',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.15px',
    padding: '5px',
    overflow: 'unset !important'
  },

  [`& .${classes.inputTitle}`]: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    marginBottom: '6px'
  }
}));

const TeamsEditCustomizedContentOutputFormat = props => {
  const {
    currentSelectFormat,
    openEditCustomizedContentOutputFormatDialog,
    setOpenEditCustomizedContentOutputFormatDialog,
    customizedContentOutputFormat,
    setCustomizedContentOutputFormat
  } = props;

  const { t } = useTranslation();

  const titleRef: any = React.useRef('');

  const [descriptionContent, setDescriptionContent] = React.useState('');

  useEffect(() => {
    setDescriptionContent(currentSelectFormat?.description);
  }, [currentSelectFormat]);

  const handleClosesDialog = () => {
    setOpenEditCustomizedContentOutputFormatDialog(false);
  };

  /**
   * Handles the click event for editing and saving a customized content output format.
   * Updates the selected format with new title and description, then closes the dialog.
   */
  const handleClickEditSave = () => {
    // Create a new format object with updated title and description.
    const newCurrentSelectFormat = {
      id: currentSelectFormat.id,
      title: titleRef.current.value,
      description: descriptionContent
    };

    // Map through the existing formats and update the selected format.
    const newCustomizedContentOutputFormat = customizedContentOutputFormat.map(
      item => {
        if (item.id === currentSelectFormat.id) {
          return newCurrentSelectFormat;
        }
        return item;
      }
    );

    // Update the state with the new format list and close the edit dialog.
    setCustomizedContentOutputFormat(newCustomizedContentOutputFormat);
    setOpenEditCustomizedContentOutputFormatDialog(false);
  };

  return (
    <StyledDialog
      open={openEditCustomizedContentOutputFormatDialog}
      onClose={handleClosesDialog}
      id="customizedOutputFormatDialog"
      classes={{ paper: classes.dialogBox }}
    >
      <Box className={classes.contentBox2}>
        {/* Title */}
        <Box sx={{ mb: '20px' }}>
          <TextField
            fullWidth
            id="title"
            inputProps={{ style: { height: '18px', marginBottom: '8px' } }}
            inputRef={titleRef}
            defaultValue={currentSelectFormat?.title}
            label={t('promptManagement.fieldName')}
            variant="outlined"
          />
        </Box>

        {/* Description */}
        <Box>
          <Typography className={classes.inputTitle} variant="body1">
            {t('promptManagement.itemsToBeGenerated')}
          </Typography>
          <TextareaAutosize
            value={descriptionContent}
            id="description"
            placeholder={t('promptManagement.itemsToBeGenerated')}
            className={classes.textAreaStyle}
            onChange={e => {
              setDescriptionContent(e.target.value);
            }}
          />
        </Box>

        <DialogActions>
          <Button variant="text" onClick={handleClosesDialog}>
            {t('promptManagement.cancel')}
          </Button>
          <Button variant="contained" onClick={handleClickEditSave}>
            {t('promptManagement.save')}
          </Button>
        </DialogActions>
      </Box>
    </StyledDialog>
  );
};

export default TeamsEditCustomizedContentOutputFormat;
