import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Button, Box } from '@mui/material';

//** Import i18n
import { useTranslation } from 'react-i18next';

const PREFIX = 'UserProfilePhotoUploadButton';

const classes = {
  uploadBtn: `${PREFIX}-uploadBtn`
};

const StyledUploadWrap = styled(Box)((
  { theme }
) => ({
  [`& .${classes.uploadBtn}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    letterSpacing: '0.4px',
    height: 'auto',
    display: 'flex',
    justifyContent: 'flex-start',
  }
}));

interface UserProfilePhotoUploadButtonProps {
  onChange?: Function;
}

export default (props: UserProfilePhotoUploadButtonProps) => {

  const { onChange } = props;
  const { t } = useTranslation();
  const handleFilesChange = e => {
    const file = e.target.files[0];
    onChange(file);
  };

  return (
    <StyledUploadWrap>
      <Button
        variant="contained"
        component="label"
        // sx={{ p: 0 }}
        // className={classes.uploadBtn}
      >
        {t('components.userProfileAndSettingsPage.changeAvatar')}
        <input
          hidden
          accept="image/*"
          multiple
          type="file"
          name="files"
          onChange={handleFilesChange}
        />
      </Button>
    </StyledUploadWrap>
  );
};