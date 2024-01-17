//** Import react
import React from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import ToggleButton from '@mui/material/ToggleButton';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';

export default function FileName({ fileName }) {

  const { t } = useTranslation();
  return (
    <Box sx={{ '.toggleButtonRoot': {
      height: '44px',
      textTransform: 'none',
    },
    '.typographyRoot': {
      color: '#150D33',
      fontSize: '14px',
      lineHeight: '20px',
      width: '92px'
    }
    }}
    >
      <ToggleButton
        value="fileName"
        classes={{ root: 'toggleButtonRoot' }}
      >
        <Typography classes={{ root: 'typographyRoot' }} noWrap >
          {fileName ? fileName : t('board.filedrop.fileNameError')}
        </Typography>
      </ToggleButton>
    </Box>
  );
}
