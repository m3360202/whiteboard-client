//** Import react
import React from 'react';

import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PREFIX = 'AdvancedSettingHelpTips';

const classes = {
  advancedSettingHelpTitle: `${PREFIX}-advancedSettingHelpTitle`,
  advancedSettingHelpSubtitle: `${PREFIX}-advancedSettingHelpSubtitle`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.advancedSettingHelpTitle}`]: {
    color: '#16B1FF',
    fontWeight: 500,
    fontSize: '12px',
    letterSpacing: '0.15px',
    lineHeight: '150%'
  },

  [`& .${classes.advancedSettingHelpSubtitle}`]: {
    color: 'rgba(35, 41, 48, 0.65)',
    fontWeight: 400,
    lineHeight: '20px',
    fontSize: '12px',
    letterSpacing: '0.15px'
  }
}));

export default function AdvancedSettingHelpTips() {


  return (
    <StyledBox>
      <Typography className={classes.advancedSettingHelpTitle}>
        Didn't find ideal styles？ Write your prompt below!
      </Typography>
      <Typography className={classes.advancedSettingHelpSubtitle}>
        The more detailed the description, the better the picture results will
        be.
      </Typography>
    </StyledBox>
  );
}
