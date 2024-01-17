import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogActions from '@mui/material/DialogActions';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';



export default function Welcome({ activeStep }) {


  // const isOpen = Session.get('showWelcome')

  // const handleClose = () => {
  //   Session.set('showWelcome', false);
  // };
  const handleNext = () => {
    activeStep += 1;
  };
  // const handleBack = () => {
  //   Session.set('showWelcome', false);
  // };

  return (
    <div>
      <Dialog
        aria-describedby="alert-dialog-description"
        aria-labelledby="alert-dialog-title"
        sx={{ width: '26%',
        height: '30%',
        left: '35%',
        top: '33%',}}
        fullScreen
        onClose={handleClose}
        open={isOpen}
      >
        <Typography sx={{fontFamily: 'Inter',
    fontStyle: 'normal',
    textAlign: 'center',
    fontWeight: 500,
    fontSize: '30px',
    lineHeight: '44px',
    color: '#232930',}}>
          Welcome! We are glad you are here
        </Typography>
        <Paper sx={{display: 'flex',
    alignItems: 'center',
    height: 70,
    fontSize: '16px',
    backgroundColor: theme.palette.background.default,}} elevation={0} square>
          <Typography>
            To get a feel of the place, take a tutorial where we will show how
            to best use BoardX
          </Typography>
        </Paper>
        <DialogActions sx={{'.button': {  backgroundColor: '#FFF',
    borderRadius: '2px',
    color: '#f21d6b',
    maxWidth: '76px',
    '&:hover': {
      color: '#FFF',
      backgroundColor: '#f21d6b',}}}}>
          <Button className={'.button'} onClick={handleBack} size="small">
            ShowTips
          </Button>
          <Button
            className={'.button'}
            color="primary"
            onClick={handleClose}
            size="small"
            variant="contained"
          >
            Skip
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
