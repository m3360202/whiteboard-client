// Import dependencies
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useHistory } from 'react-router-dom';

import Button from '@mui/material/Button';
import Popover from '@mui/material/Popover';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const PREFIX = 'VerifyDialog';

const classes = {
  popoverPaper: `${PREFIX}-popoverPaper`,
  titleText: `${PREFIX}-titleText`,
  titleText2: `${PREFIX}-titleText2`,
  buttonStyle: `${PREFIX}-buttonStyle`
};

const StyledPopover = styled(Popover)((
  { theme }
) => ({
  [`& .${classes.popoverPaper}`]: {
    width: '342px'
  },

  [`& .${classes.titleText}`]: {
    fontSize: '20px',
    fontFamily: 'Inter',
    fontWeight: '500',
    marginTop: '20px',
    marginLeft: '12px',
    textAlign: 'left'
  },

  [`& .${classes.titleText2}`]: {
    fontSize: '14px',
    fontFamily: 'Inter',
    fontWeight: '500',
    marginTop: '12px',
    padding: '12px',
    textAlign: 'left'
  },

  [`& .${classes.buttonStyle}`]: {
    marginTop: '12px',
    marginLeft: '12px',
    marginBottom: '8px'
  }
}));

/**
 * The CommandDialog component displays a dialog to verify the user's email.
 *
 * @component
 * @param {Object} props - React props.
 * @property {boolean} open - Whether the popover is open.
 * @property {Function} setOpen - A function to control the popover's open state.
 */
const VerifyDialog = ({ open, setOpen }) => {

  const history = useHistory();

  const handleCancel = () => {
    setOpen(false);
  };

  const goVerify = () => {
    history.push('/emailVerified');
  };

  return (
    <StyledPopover
      open={open}
      anchorEl={document.getElementById('aiassistwidget')}
      onClose={handleCancel}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      classes={{ paper: classes.popoverPaper }}
    >
      <Box style={{ textAlign: 'left' }}>
        <Typography className={classes.titleText}>
          Verify your email address
        </Typography>
      </Box>
      <Box style={{ textAlign: 'left' }}>
        <Typography className={classes.titleText2}>
          To start using BoardX, click the verify email button below.
        </Typography>
        <Button
          type="button"
          variant="contained"
          color="primary"
          className={classes.buttonStyle}
          onClick={goVerify}
        >
          Verify Email
        </Button>
      </Box>
    </StyledPopover>
  );
}

VerifyDialog.propTypes = {
  open: PropTypes.bool.isRequired,
  setOpen: PropTypes.func.isRequired
};

export default VerifyDialog;
