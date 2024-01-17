//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetSubscriptionPlanMutation } from '../../redux/PricingApiSlice';
import { useCalculationUserXPValueQuery } from '../../redux/UserAPISlice';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import clsx from 'clsx';

//** Import Services
import { PricingService, UserService } from '../../services';
import server from '../../startup/serverConnect';

import UpgradePlanDialog from './UpgradePlanDialog';

function UserBasicInfo() {

  const { t } = useTranslation();
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const [openMyPlan, setOpenMyPlan] = React.useState(false);

  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] =
    React.useState(null);
  const [subscriptionPlan] = useGetSubscriptionPlanMutation();

  const { data: xpValue = 0 } = useCalculationUserXPValueQuery({
    userId: userInfo.userId
  });

  const handleSetSubscriptionPlan = async orgId => {
    let user = store.getState().user.userInfo;
    let result: any = await subscriptionPlan({ orgId, user });
    setCurrentSubscriptionPlan(result?.data);
  };

  useEffect(() => {
    handleSetSubscriptionPlan(orgId);
  }, [orgId]);



  const handleOpenMyPlan = () => {
    setOpenMyPlan(true);
  }

  const onCloseMyPlan = () => {
    setOpenMyPlan(false);
  }

  let checkPruchaseHandle = null;

  const startListenCallBack = () => {
    if (checkPruchaseHandle) {
      clearInterval(checkPruchaseHandle); //结束之前的轮询
    }
    //轮询订单
    checkPruchaseHandle = setInterval(() => {
      let mode =
        location.host.indexOf('app.boardx.us') > -1 ? 'livemode' : 'testmode';
      server.call('purchaseCallback', { mode: mode, currentPlan: currentSubscriptionPlan, user: store.getState().user.userInfo }).then(async (res) => {
        console.log('startListenCallBack', res);
        if (res.data.length > 0) {
          clearInterval(checkPruchaseHandle);
          Boardx.Util.Msg.success(t('chatAi.purchaseSuccessfully'));
          let user = await server.call('getUserInfo');
          UserService.getInstance().saveStore(user);
        }
      }).catch(err => {
        console.log(err)
      });
    }, 10000);
    setTimeout(() => {
      clearInterval(checkPruchaseHandle);
    }, 300000); //5分钟后过期，关闭轮询
  };

  return (
    <Box sx={{
      width: '100%', '.userInfoBox': {
        display: 'flex',
        alignItems: 'center',
        cursor: 'text'
      },
      '.userCreditInfoBox': { justifyContent: 'space-between' }
    }}>
      <Box className={'userInfoBox'}>
        <Typography variant="body1" sx={{
          color: 'rgba(58, 53, 65, 0.87)',
          textAlign: 'center',
          letterSpacing: '0.15px',
          fontWeight: 500,
          fontSize: '20px',
          lineHeight: '160%',
          marginRight: '8px',
          maxWidth: '160px',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
          overflow: 'hidden'
        }}>
          {store.getState().user.userInfo.userName}
        </Typography>
        <Box sx={{
          letterSpacing: '0.16px',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: '18px',
          color: '#FFB400',
          padding: '3px 10px ',
          margin: '2px',
          background:
            'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #ED6C02',
          borderRadius: '4px'
        }}>
          XP: {xpValue.toLocaleString('en-US')}
        </Box>
        <Box sx={{
          letterSpacing: '0.16px',
          fontWeight: 400,
          fontSize: '10px',
          lineHeight: '18px',
          color: '#FFB400',
          padding: '3px 10px ',
          margin: '2px',
          background:
            'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #ED6C02',
          borderRadius: '4px'
        }}>
          {userInfo.status == 'pro' ? 'Pro' : 'Free'}
        </Box>
      </Box>
      <Box className={clsx('userInfoBox', 'userCreditInfoBox')}>

        <Button onClick={() => handleOpenMyPlan()} sx={{
          letterSpacing: '0.46px',
          fontWeight: 700,
          fontSize: '15px',
          lineHeight: '22px',
          padding: '0px',
          color: '#F21D6B',
          /*textTransform: 'uppercase',*/
          cursor: 'pointer'
        }}>
          {/* {t('components.userMenu.purchase')} */}
          upgrade my plan
        </Button>
      </Box>
      <UpgradePlanDialog open={openMyPlan} onClose={onCloseMyPlan} userInfo={userInfo} />
    </Box>
  );
}

export default UserBasicInfo;
