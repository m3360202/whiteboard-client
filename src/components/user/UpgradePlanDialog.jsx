import React from 'react';
import { Dialog, IconButton, DialogContent, DialogTitle, Typography, Button, List, ListItem, ListItemIcon, ListItemText } from '@mui/material';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import CloseIcon from '@mui/icons-material/Close';


function UpgradePlanDialog({ open, onClose, userInfo }) {
  const [userLicense, setUserLicense] = React.useState(userInfo.status == 'pro' ? 'pro' : 'free');

  const goPurchase = async () => {
    const paymentLink = await server.call('getPaymentLink');
    window.open(paymentLink + '?prefilled_email=' + userInfo.email + '&client_reference_id=' + userInfo.userId, '_self'); //real link
    // startListenCallBack();
    // setOpenMyPlan(true);
  };

  const manageMySubscription = () => {
    server.call('createStripePortalSession').then((result) => {
      window.open(result, '_self');
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Upgrade your plan</DialogTitle>
      <DialogContent>
        <Typography variant="h5" color="primary" gutterBottom>
          {userLicense}
        </Typography>
        {/* //if user is pro then say "Your current plan is Pro, please enjoy the following advanced features" else say "Your current plan is Free, please upgrade to access the following advanced features" */}
        <Typography variant="body2" gutterBottom style={{ 'margin': '1em' }}>
          {userLicense == 'free' ? 'Your current plan is free, please upgrade to access the following advanced features' : 'Your current plan is pro, please enjoy the following advanced features'}
        </Typography>

        {/* //if userLicense is free, then add a button to upgrade to pro
        //else add a button to downgrade to free */}
        {userLicense == 'free' ? <Button variant="contained" color="primary" fullWidth onClick={goPurchase}  >
          Upgrade to Pro $20USD/Month
        </Button> : null}

        <List>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Access to GPT-4, the most capable model" />
          </ListItem>
          <ListItem>
            <ListItemIcon>
              <CheckCircleOutlineIcon />
            </ListItemIcon>
            <ListItemText primary="Browse, create, and use Prompts and Agents" />
          </ListItem>

        </List>
        <Button variant="text" color="primary" fullWidth onClick={manageMySubscription} >
          Manage my subscription
        </Button>
        {/* <Button color="primary" fullWidth onClick={onClose}>
          I need help with a billing issue
        </Button>
        <Typography variant="body2" align="center" color="primary" gutterBottom>
          Need more capabilities? See ChatGPT Enterprise
        </Typography> */}
      </DialogContent>
      <IconButton aria-label="close" onClick={onClose} sx={{ position: 'absolute', right: 8, top: 8, color: (theme) => theme.palette.grey[500] }}>
        <CloseIcon />
      </IconButton>

    </Dialog>
  );
}

export default UpgradePlanDialog;
