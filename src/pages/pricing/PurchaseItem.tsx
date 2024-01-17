import React, { useState,useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//**Import i18n */
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import {
  useGetSubscriptionPlanMutation,
} from '../../redux/PricingApiSlice';

// ** MUI Imports
import Card from '@mui/material/Card';
import { styled } from '@mui/material/styles'
import MuiCardContent, { CardContentProps } from '@mui/material/CardContent'
import Box from '@mui/material/Box'
import Typography from '@mui/material/Typography'
import { ThemeProvider } from '@mui/material';
import currentTheme from '../../mui/theme/lightTheme';
import Container from '@mui/material/Container';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import store from '../../store';
import server from '../../startup/serverConnect';

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

export default function PurchaseItem() {
  const history = useHistory();
  const [type,setType]=useState(1);
  const { t } = useTranslation();
  const [startPolling, setStartPolling] = useState<any>(false);

  // ** subscriptionInfo
  const orgId = localStorage.getItem('orgId');
  const [currentSubscriptionPlan,setCurrentSubscriptionPlan]=useState(null);
  const [subscriptionPlan] = useGetSubscriptionPlanMutation();

  const handleSetSubscriptionPlan = async(orgId)=>{
    let user = store.getState().user.userInfo;
    let result:any = await  subscriptionPlan({orgId,user});
    //console.log('SubscriptionPlan---------------',result?.data);
    setCurrentSubscriptionPlan(result?.data);
  }

  const goPurchase = () => {
    let mode = location.host.indexOf('app.boardx.us')>-1?'livemode':'testmode';
    setStartPolling(true);

    server.call('getPurchaseLink',{mode:mode,type:type}).then(result => {
      if(result){
        window.location.href = result.url+'?client_reference_id=' + store.getState().user.userInfo.userId;
      }
    }).catch(err => {
      console.log(err)
    });

  };
  const handleChangePayType =(e)=>{
    const type = e.target.value;
    console.log('type',type)
    setType(type)
    
  }
  const showBouns=(type)=>{

    if(currentSubscriptionPlan && currentSubscriptionPlan.subscriptionType === 'Pro'){
      if(type === 1){
        return ' + Bouns 6,250';
      }
      if(type === 2){
        return ' + Bouns 20,000';
      }
      if(type === 3){
        return ' + Bouns 50,000';
      }
      if(type === 4){
        return ' + Bouns 125,000';
      }
    }else{
      return ;
    }
    
  }

  useEffect(() => {
    handleSetSubscriptionPlan(orgId);
  }, [orgId]);

  return (
    <ThemeProvider theme={currentTheme}>
      <Container component="main" style={{ marginTop: '10%' }}>
        <Card>
          <CardContent>
            <Box sx={{ mb: 1, textAlign: 'center' }}>
              <Typography variant="h2">
                <svg
                  viewBox="0 0 1024 1024"
                  version="1.1"
                  xmlns="http://www.w3.org/2000/svg"
                  p-id="1655"
                  width="64"
                  height="64"
                >
                  <path
                    d="M640 192c17.664 0 32-14.336 32-32V64c0-35.328-28.672-64-64-64H96C60.672 0 32 28.672 32 64v896c0 35.328 28.672 64 64 64h512c35.328 0 64-28.672 64-64v-96c0-17.664-14.336-32-32-32H96V192h544zM96 64h512v64H96V64z m512 832v64H96v-64h512z m96-672c158.784 0 288 129.216 288 288s-129.216 288-288 288-288-129.216-288-288 129.216-288 288-288z m0 256c52.928 0 96 35.904 96 80 0 34.688-26.816 64.064-64 75.072V672c0 17.664-14.336 32-32 32s-32-14.336-32-32v-36.416a103.32 103.32 0 0 1-28.672-13.12c-14.72-9.792-18.624-29.696-8.832-44.416 9.792-14.656 29.696-18.56 44.416-8.832 6.656 4.416 15.36 6.784 25.088 6.784 19.584 0 32-10.496 32-16s-12.416-16-32-16c-52.928 0-96-35.904-96-80 0-34.752 26.816-64.064 64-75.072V352c0-17.664 14.336-32 32-32s32 14.336 32 32v36.416c10.304 2.944 19.968 7.36 28.672 13.12 14.72 9.792 18.624 29.696 8.832 44.416-9.792 14.72-29.696 18.56-44.416 8.832C722.432 450.368 713.728 448 704 448c-19.584 0-32 10.496-32 16s12.416 16 32 16z m0 256c123.52 0 224-100.48 224-224S827.52 288 704 288 480 388.48 480 512s100.48 224 224 224z"
                    fill="#09bb07"
                    p-id="4739"
                  ></path>
                </svg>
              </Typography>
              <Typography variant="h2">
                {t('components.billing.chooseAProduct')}
              </Typography>
              {/* <Typography
                variant="h3"
                style={{ margin: '10px 0', fontWeight: '400' }}
              >
                {t('components.billing.productInfo')}
              </Typography> */}
              <Box sx={{ my: 3 }}>
                <Select
                  id="demo-simple-select"
                  onChange={handleChangePayType}
                  variant="standard"
                  style={{ fontSize: '20px' }}
                  value={type}
                >
                  <MenuItem value="1">
                    $10 - 25,000 {showBouns(1)} Credits
                  </MenuItem>
                  <MenuItem value="2">
                    $25 - 80,000 {showBouns(2)} Credits
                  </MenuItem>
                  <MenuItem value="3">
                    $50 - 200,000 {showBouns(3)} Credits
                  </MenuItem>
                  <MenuItem value="4">
                    $100 - 500,000 {showBouns(4)} Credits
                  </MenuItem>
                </Select>
                <Button
                  sx={{ marginLeft: '14px' }}
                  color="primary"
                  id="btnBackupBoard"
                  onClick={goPurchase}
                  size="small"
                  variant="contained"
                >
                  {t('components.billing.Purchase')}
                </Button>
              </Box>
            </Box>
          </CardContent>
        </Card>
      </Container>
    </ThemeProvider>
  );
}
