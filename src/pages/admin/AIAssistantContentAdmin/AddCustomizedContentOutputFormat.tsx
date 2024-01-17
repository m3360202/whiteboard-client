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

//** Import services
import { UtilityService } from '../../../services';

const PREFIX = 'AddCustomizedContentOutputFormat';

const classes = {
  dialogBox: `${PREFIX}-dialogBox`,
  contentBox2: `${PREFIX}-contentBox2`,
  textAreaStyle: `${PREFIX}-textAreaStyle`,
  inputTitle: `${PREFIX}-inputTitle`
};

const ContentBoxStyled = styled(Box)(({ theme }) => ({
  width: '500px',
  height: 'auto',
  padding: '18px 24px 10px',
  boxSizing: 'border-box'
}));

const TextareaAutosizeStyled = styled(TextareaAutosize)(({ theme }) => ({
  width: '100%',
  resize: 'none',
  border: '1px solid rgba(0, 0, 0, 0.23)',
  fontSize: '16px',
  fontWeight: 400,
  lineHeight: '24px',
  letterSpacing: '0.15px',
  padding: '5px',
  overflow: 'unset !important'
}));

const TypographyStyled = styled(Typography)(({ theme }) => ({
  fontWeight: 600,
  fontSize: '12px',
  lineHeight: '15px',
  marginBottom: '6px'
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialog-paper': {
    maxWidth: 'unset',
    borderRadius: '6px'
  },
}));

const AddCustomizedContentOutputFormat = props => {

  const {
    openAddCustomizedContentOutputFormatDialog,
    setOpenAddCustomizedContentOutputFormatDialog,
    customizedContentOutputFormat,
    setCustomizedContentOutputFormat
  } = props;
  const { t } = useTranslation();


  const titleRef:any = React.useRef('');

  const [descriptionContent, setDescriptionContent] = React.useState('');

  const handleClosesDialog = () => {
    // This function sets a state variable to close a dialog window.
    setOpenAddCustomizedContentOutputFormatDialog(false);
  };

  const handleClickAddSave = () => {
    // Check if the title and description are not empty.
    if (!titleRef.current.value || descriptionContent === '') {
      // Show an info message if either the title or description is empty.
      Boardx.Util.Msg.info(t('promptManagement.pleaseEnterContent'));

      return;
    }

    // Create a new object with the entered data.
    const newAddContentOutputFormatData = {
      id: UtilityService.getInstance().generateWidgetID(),
      title: titleRef.current.value,
      description: descriptionContent
    };

    // Add the new data object to the existing array of customized content.
    setCustomizedContentOutputFormat([
      ...customizedContentOutputFormat,
      newAddContentOutputFormatData
    ]);

    // Close the dialog or modal by setting its state variable to false.
    setOpenAddCustomizedContentOutputFormatDialog(false);

    // Clear the descriptionContent for future inputs.
    setDescriptionContent('');
  };

  return (
    <StyledDialog
      open={openAddCustomizedContentOutputFormatDialog}
      onClose={handleClosesDialog}
      id="customizedOutputFormatDialog"
    >
      <ContentBoxStyled>
        {/* Title */}
        <Box sx={{ mb: '20px' }}>
          <TextField
            fullWidth
            id="title"
            inputProps={{ style: { height: '18px', marginBottom: '8px' } }}
            inputRef={titleRef}
            label={t('promptManagement.fieldName')}
            variant="outlined"
            minRows={2}
          />
        </Box>

        {/* Description */}
        <Box>
          <TypographyStyled variant="body1">
            {t('promptManagement.itemsToBeGenerated')}
          </TypographyStyled>
          <TextareaAutosizeStyled
            value={descriptionContent}
            id="description"
            placeholder={t('promptManagement.itemsToBeGenerated')}
            onChange={e => {
              setDescriptionContent(e.target.value);
            }}
          />
        </Box>

        <DialogActions>
          <Button variant="text" onClick={handleClosesDialog}>
            {t('promptManagement.cancel')}
          </Button>
          <Button variant="contained" onClick={handleClickAddSave}>
            {t('promptManagement.save')}
          </Button>
        </DialogActions>
      </ContentBoxStyled>
    </StyledDialog>
  );
};

export default AddCustomizedContentOutputFormat;
