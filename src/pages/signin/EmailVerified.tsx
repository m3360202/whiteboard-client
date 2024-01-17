import React, { useState, useEffect } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

// ** MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material';
import currentTheme from '../../mui/theme/lightTheme';
import Container from '@mui/material/Container';
//** Import Redux kit
import store, { RootState } from '../../store';
import { handleSetUserInfo } from '../../store/user';
import { useSelector, useDispatch } from 'react-redux';
import { useGetUserInfoQuery, useSendVerifyMsgMutation } from '../../redux/UserAPISlice';
//**Import Services
import { UserService } from '../../services';

// ** Styled Components
const CardContent = styled(MuiCardContent)<CardContentProps>(({ theme }) => ({
  padding: theme.spacing(17.5, 36, 28.25),
  [theme.breakpoints.down('xl')]: {
    padding: theme.spacing(12.5, 20, 20)
  },
  [theme.breakpoints.down('sm')]: {
    padding: theme.spacing(10, 5)
  }
}))

function EmailVerified(props) {
  const [isShow, setIsShow] = useState<boolean>(true)
  const [title, setTitle] = useState<string>('')
  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  //user
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [sendVerifyMsg] = useSendVerifyMsgMutation();
  const { lastUrl } = props;
  const handleSendVerifyMsg = async (data) => {
    return await sendVerifyMsg(data);
  }
  const handlyShow = (plan) => {
    setIsShow(false);
    setTitle(plan)
  }
  const verify = () => {
    const data = {
      lastUrl: lastUrl ? lastUrl : null,
      userId: store.getState().user.userInfo.userId
    }
    handleSendVerifyMsg(data);
    Boardx.Util.Msg.info(t('adminPage.emailVerification'));
  }

  useEffect(() => {
    if (store.getState().user.userInfo.userId) {
      verify();
    }
  }, []);
  return (
    <ThemeProvider theme={currentTheme}>
      <Container component="main" style={{ marginTop: '10%', width: '50%', wordBreak: 'break-word' }} >
        <Card>
          <CardContent>
            <Box sx={{ mb: 1, textAlign: 'left', dispaly: 'flex', flexDirection: 'column', lineHeight: '32px', marginBottom: '24px' }}>
              <Typography variant='h2'>
                <img src='/images/logo_1.svg' style={{ width: '120px', marginBottom: '15px' }} /></Typography>
              <Typography style={{ fontWeight: '500', fontSize: '20px', textAlign: 'left', marginBottom: '24px' }}>Verify your email</Typography>
              <Box>
                <Typography variant='body2' style={{ textAlign: 'left', marginBottom: '38px' }}>
                  A verify email has been sented to <b>{userInfo.email}</b>.
                </Typography>
              </Box>
              <Box>
                <Typography variant='body2' style={{ textAlign: 'left' }}>
                  This helps keep your account secure.
                </Typography>
              </Box>
              <Box style={{ marginTop: '28px' }}>
                <Typography style={{ textAlign: 'left', color: 'rgba(35, 41, 48, 0.65)', marginBottom: '12px' }}>No email in your inbox or spam folder? </Typography>
              </Box>
              <Box>
                <Typography style={{ textAlign: 'left', color: 'rgba(74, 123, 247, 1)', cursor: 'pointer' }} onClick={verify}>Resend the email</Typography>
              </Box>
            </Box>

          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  )
}
export default EmailVerified;