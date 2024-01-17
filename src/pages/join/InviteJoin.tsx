//** Import react
import React, { useEffect, useState } from 'react';
import { useParams, useLocation, useHistory } from 'react-router-dom';

//** Import Mui
import CssBaseline from '@mui/material/CssBaseline';
import Container from '@mui/material/Container';
import { ThemeProvider } from '@mui/material';
import currentTheme from '../../mui/theme/lightTheme';

//Import Store
import store from '../../store';

//** Import Services
import { useUserInviteTokenMutation, useValidateInviteTokenMutation } from '../../redux/UserAPISlice';
import { UserService } from '../../services';

function InviteJoinPage() {
  const { hash } = useParams<any>();
  const history = useHistory();
  const browserLocation = useLocation();
  const [useInviteToken] = useUserInviteTokenMutation();
  const [validateInviteToken] = useValidateInviteTokenMutation();
  
  const handleUseInviteToken = async (token) => {
    return await useInviteToken(token);
  }
  const handleValidateInviteToken = async (tokenData) => {
    return await validateInviteToken(tokenData)
  }


  useEffect(() => {
    async function deal() {
      let user = localStorage.getItem('token');
      let result:any = await handleValidateInviteToken({hash,user});
      console.log('result', result)
      if (result && result.data) {
        if (!result.data.isLogin) {
          //用户没有登录，跳转到对应登录页面
          let responseData = result.data;
          const currentUrl = browserLocation.pathname;
          const inviteOrgId =
            responseData?.inviteData?.type === 'org'
              ? responseData?.inviteData?.orgId
              : responseData?.room?.orgId;
          history.push(
            `/join?callback=${currentUrl}&invite=${responseData?.inviteData?.userId}&inviteOrgId=${inviteOrgId}`
          );
        }
        if (result.data.isLogin && result.data.isAnonymous) {
          //浏览者强制迁出
          let responseData = result.data;
          const currentUrl = browserLocation.pathname;
          const inviteOrgId =
            responseData?.inviteData?.type === 'org'
              ? responseData?.inviteData?.orgId
              : responseData?.room?.orgId;
          UserService.getInstance().logout();
          history.push(
            `/join?callback=${currentUrl}&invite=${responseData?.inviteData?.userId}&inviteOrgId=${inviteOrgId}`
          );
        }
        if (result.data.isLogin && !result.data.isAnonymous) {
          //正常跳转
          await handleUseInviteToken({hash,user});
          if (result.data.room) {
            localStorage.setItem('currentOrgId', result.data.room.orgId);
            localStorage.setItem('orgId', result.data.room.orgId);
            history.push(`/room/${result.data.room._id}`);
          } else {
            localStorage.setItem('currentOrgId', result.data.organization._id);
            localStorage.setItem('orgId', result.data.organization._id);
            history.push('/recent');
          }
        }
      }
    }
    deal();

  }, [])

  return (
    <ThemeProvider theme={currentTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
      </Container>
    </ThemeProvider>
  );
}

export default InviteJoinPage;
