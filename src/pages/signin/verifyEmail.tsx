import React, { useEffect } from 'react';

//**Import Services
import { UserService } from '../../services';
import { useCheckVerifyMutation } from '../../redux/UserAPISlice';
//** Import i18n

import { useTranslation } from 'react-i18next';

// ** MUI Imports
import Box from '@mui/material/Box';

import store from '../../store';

function verifyEmail() {

  const token = location.pathname.replace('/verify-email/', '');
  const { t } = useTranslation();
  const [checkVerify] = useCheckVerifyMutation();
  const handleCheckVerify = async (token) => {
    await checkVerify(token);
  }
  
  useEffect(() => {
    async function deal() {
      if (token) {
        let result:any = await handleCheckVerify(token);
        if (result) {
          Boardx.Util.Msg.info(
            t('pages.authPageJoin.yourEmailHasVerified')
          );
  
          setTimeout(() => {
            if (result == store.getState().user.userInfo.userId) {
              window.location.href =
                location.origin + '/recent';
            }
            else {
              UserService.getInstance().logout();
            }
          }, 3000);
        } else {
          Boardx.Util.Msg.info(t('pages.authPageJoin.emailVerifiedFail'));
  
          setTimeout(() => {
            window.location.href =
              location.origin + '/emailVerified';
          }, 3000);
        }
      }
    }
    deal();
    
  }, [])
  return (
    <Box></Box>
  )
}
export default verifyEmail;