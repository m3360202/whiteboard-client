// ** React Imports
import React, { Fragment, useState, useEffect } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

// ** MUI Imports
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import TextField from '@mui/material/TextField';
import { styled } from '@mui/material/styles';
import CardHeader from '@mui/material/CardHeader';
import Typography from '@mui/material/Typography';
import CardContent from '@mui/material/CardContent';
import List from '@mui/material/List';
import Item from '@mui/material/ListItem';
import Switch from '@mui/material/Switch';
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  FormHelperText,
  FormGroup,
  Checkbox,
  Avatar,
  RadioGroup,
  Radio,
  Divider
} from '@mui/material';
import { ArrowBackOutlined, ArrowForwardOutlined } from '@mui/icons-material/';

// Invoice data
import { DataGrid, GRID_CHECKBOX_SELECTION_COL_DEF } from '@mui/x-data-grid';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector } from 'react-redux';
import Skeleton from '@mui/material/Skeleton';
import {
  useGetSubscriptionPlanMutation,
  useGetInvoiceMutation
} from '../../redux/PricingApiSlice';
import { useCheckActionPermissionOfTeamMutation } from '../../redux/PermissionApiSlice';

// ** service Import
import { PricingService,UserService } from '../../services';
import { Chip, LinearProgress, ListItem } from '@mui/material';
import { Stack } from '@mui/system';
import moment from 'moment';
import server from '../../startup/serverConnect';
import { ThemeContext } from '@emotion/react';

const PREFIX = 'UserViewBilling';

const classes = {
  saveButton: `${PREFIX}-saveButton`,
  root: `${PREFIX}-root`,
  columnHeader: `${PREFIX}-columnHeader`,
  columnHeaderTitleContainer: `${PREFIX}-columnHeaderTitleContainer`,
  cell: `${PREFIX}-cell`,
  columnHeaderTitle: `${PREFIX}-columnHeaderTitle`,
  backBox: `${PREFIX}-backBox`,
  backTypo: `${PREFIX}-backTypo`,
  userNameAvatar: `${PREFIX}-userNameAvatar`,
  userNameText: `${PREFIX}-userNameText`,
  userEmailText: `${PREFIX}-userEmailText`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  { theme }
) => ({
  [`& .${classes.saveButton}`]: {
    color: '#F21D6B',
    fontSize: '12px',
    border: '1px solid #F21D6B',
    '&:hover': {
      color: '#ffffff'
    }
  },

  [`& .${classes.root}`]: {
    [theme.breakpoints.up('sm')]: {
      width: '676px'
    },
    border: 0,
    fontSize: '16px',
    fontWeight: 400
  },

  [`& .${classes.columnHeader}`]: {
    padding: '0 !important',
    border: '0 !important',
    outline: 'none !important',
    background: '#F9FAFC'
  },

  [`& .${classes.columnHeaderTitleContainer}`]: {
    padding: '0 !important'
  },

  [`& .${classes.cell}`]: {
    padding: '0 !important',
    outline: 'none !important',
    background: '#FFFFFF'
  },

  [`& .${classes.columnHeaderTitle}`]: {
    color: 'rgba(35, 41, 48, 0.65)'
  },

  [`& .${classes.backBox}`]: {
    display: 'flex',
    position: 'absolute',
    marginTop: '24px',
    marginLeft: '0px',
    zIndex: '2'
  },

  [`& .${classes.backTypo}`]: {
    fontSize: '16px',
    fontWeight: 500,
    marginLeft: '12px',
    marginTop: '2px'
  },

  [`& .${classes.userNameAvatar}`]: {
    width: '40px',
    height: '40px',
    float: 'left',
  },

  [`& .${classes.userNameText}`]: {
    marginLeft: '16px',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    textAlign: 'left'
  },

  [`& .${classes.userEmailText}`]: {
    marginLeft: '16px',
    fontFamily: 'Inter',
    fontSize: '14px',
    fontWeight: '400',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    textAlign: 'left'
  }
}));

interface DataType {
  name: string;
  imgSrc: string;
  imgAlt: string;
  cardCvc: string;
  expiryDate: string;
  cardNumber: string;
  cardStatus: string;
  badgeColor: any;
}

// ** Styled <sup> component
const Sup = styled('sup')(({ theme }) => ({
  top: '0.2rem',
  left: '-0.6rem',
  position: 'absolute',
  color: theme.palette.primary.main
}));

// ** Styled <sub> component
const Sub = styled('sub')({
  fontWeight: 300,
  fontSize: '1rem',
  alignSelf: 'flex-end'
});

const UserViewBilling = (props: any) => {
  const { orgMemberList } = props;
  let Boardx = window['Boardx'];
  const { t } = useTranslation();
  // ** States
  const [openUpgradePlans, setOpenUpgradePlans] = useState<boolean>(false);
  const [openExplorePlans, setOpenExplorePlans] = useState<boolean>(false);
  const istestLink = location.hostname.indexOf('app.boardx.us') === -1 ? true : false;
  const [currentPlan, setCurrentPlan] = useState<any>('Free');

  const [startPolling, setStartPolling] = useState<any>(false);
  const [openSelectMembers, setOpenSelectMembers] = useState<boolean>(false);
  const [orgMembers, setOrgMembers] = useState(orgMemberList);
  //org
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const settings = useSelector((state: RootState) => state.system.settings);
  // ** subscriptionInfo
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const [rows, setRows] = useState([]);
  const [currentSubscriptionPlan, setCurrentSubscriptionPlan] = useState(null);
  const [invoiceList, setInvoiceList] = useState(null);
  const [subscriptionPlan] = useGetSubscriptionPlanMutation();
  const [setInvoiceListMethod] = useGetInvoiceMutation();
  // ** view hooks
  const [selectMonthly, setSelectMonthly] = useState('monthly');
  const [item, setItem] = useState(null);
  const [remain, setRemain] = useState(0);
  const [handleCheckActionPermissionOfTeam] = useCheckActionPermissionOfTeamMutation();
  // Select member variables
  const [elements, setElements] = useState(null);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [checkedMembers, setcheckedMembers] = React.useState([]);
  const [searchResult, setSearchResult] = React.useState(null);
  const [selectedMemberIds, setSelectedMemberIds] = React.useState<any>([]);
  const [amount, setAmount] = useState<any>(0);

  const handleChangeCheckedMembers = (e, data) => {
    if (e.target.checked) {

      const orgMembersNoSelectUser = orgMembers.filter(item => item.userId !== data.userId);

      setOrgMembers([data, ...orgMembersNoSelectUser]);

      if (selectedMemberIds?.includes(data.userId)) {
        return;
      } else {
        let filteredMembers = [...selectedMemberIds, data.userId];
        setSelectedMemberIds(filteredMembers)
      }
    }
    else {
      let filteredMembers = selectedMemberIds.filter(m => m !== data.userId);
      setSelectedMemberIds(filteredMembers)
    }
  }

  const checkActionPermission = async (permissionName) => {
    let data = {
      permissionName: permissionName,
      role: orgInfo.role
    }
    return await handleCheckActionPermissionOfTeam(data);
  }

  const handleSearch = (e) => {
    if (e.keyCode === 13) {
      const key = e.target.value;
      if (key) {
        let arr = orgMembers;
        let newarr = arr.filter(m => m.user[0].username.indexOf(key) > -1 || m.user[0].name.indexOf(key) > -1);
        setSearchResult(newarr);
      }
      else {
        setSearchResult(orgMembers);
      }

    }
  };

  const handleSetSubscriptionPlan = async (orgId) => {
    let user = store.getState().user.userInfo;
    let result: any = await subscriptionPlan({orgId,user});

    setCurrentSubscriptionPlan(result?.data);
  }
  const handleSetInvoiceList = async (data) => {
    let result: any = await setInvoiceListMethod(data);
    console.log('result invoice------------',data,result)
    setInvoiceList(result?.data);
    setRows(newInvoiceList(result?.data));
  }
  const handleChangeCheckedElement = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    const { value } = event.target;
    if (checkedMembers?.includes(value)) {
      setcheckedMembers(checkedMembers.filter(element => element !== value));
    } else {
      setcheckedMembers([...checkedMembers, value]);
    }
  };
  const error = checkedMembers.length !== 2;


  const polling = () => {
    let mode =
      location.host.indexOf('app.boardx.us') > -1 ? 'livemode' : 'testmode';
      server.call('subscribeCallback', {user:store.getState().user.userInfo}).then(result => {
        if (result && result.data && result.data.length > 0) {
          //console.log('result----------',result.data);
          if (orgMemberList && orgMemberList.length > 0 && currentSubscriptionPlan) {
            let arr = [];
            let arr2 = [];
            orgMemberList?.map(t => {
              let data = null;
              if (currentSubscriptionPlan?.memberList?.includes(t.userId)) {
                data = { ...t, selected: true };
                arr2.push(t.userId)
              }
              else {
                data = t;
              }
              arr.push(data);
            })
            setSelectedMemberIds(arr2)
            setOrgMembers(arr);
          }
          handleSetSubscriptionPlan(orgId);
          setStartPolling(false);
        }
      }).catch(err => {
        console.log(err)
      });

  };

  const handleChangeMonthly = () => {
    if (selectMonthly === 'monthly') {
      setSelectMonthly('year');
    } else {
      setSelectMonthly('monthly');
    }
  }

  const getAmount = () => {
 
    if (!item  && selectMonthly === 'monthly') {
      setAmount((selectedMemberIds?.length * 10).toFixed(2));
    }
    if (item === 'Pro' && selectMonthly === 'monthly') {
      setAmount((selectedMemberIds?.length * 10).toFixed(2));
    }
    if (item === 'Pro' && selectMonthly === 'year') {
      setAmount((selectedMemberIds?.length * 96).toFixed(2));
    }
    if (item === 'Business' && selectMonthly === 'monthly') {
      setAmount((selectedMemberIds?.length * 20).toFixed(2));
    }
    if (item === 'Business' && selectMonthly === 'year') {
      setAmount((selectedMemberIds?.length * 192).toFixed(2));
    }
  }
  useEffect(() => {
  
    if (Array.isArray(orgMemberList) && orgMemberList && orgMemberList.length > 0 && currentSubscriptionPlan) {
      let arr = [];
      let arr2 = [];
      console.log('orgMemberList', orgMemberList)
      setElements(orgMemberList.filter(memberInfo => memberInfo.name.length > 0));
      orgMemberList?.map(t => {
        let data = null;

        if (currentSubscriptionPlan?.memberList?.includes(t.userId)) {
          data = { ...t, selected: true };
          arr2.push(t.userId)
        }
        else {
          data = t;
        }
        arr.push(data);
      })
      arr.sort((a, b) => {
        if (a.selected && !b.selected) {
          return -1; 
        } else if (!a.selected && b.selected) {
          return 1; 
        } else {
          return 0; 
        }
      })
      setSelectedMemberIds(arr2)
      setOrgMembers(arr);
      console.log('arr', arr)
      getAmount();
    }
  }, [orgMemberList, currentSubscriptionPlan])
  const getRemain = () => {
    if (currentSubscriptionPlan) {
      let result;

      if (currentSubscriptionPlan.subscriptionType === 'Pro') {
        result = parseInt(((parseInt(currentSubscriptionPlan.credits) / parseInt(currentSubscriptionPlan.quantity)) / 100000).toFixed(0)) * 100;
        setRemain(result);
      }
      if (currentSubscriptionPlan.subscriptionType === 'Business') {
        result = parseInt(((parseInt(currentSubscriptionPlan.credits) / parseInt(currentSubscriptionPlan.quantity)) / 200000).toFixed(0)) * 100;
        setRemain(result);
      }
    } else {
      setRemain(0);
    }
  }
  useEffect(() => {
    let startPollingCall;
    if (startPolling) {
      startPollingCall = setInterval(() => {
        polling();
      }, 5000);
      setTimeout(() => {
        clearInterval(startPollingCall);
      }, 300000); //1分钟后过期，关闭轮询

    } else {
      clearInterval(startPollingCall);
    }
    return () => {
      if (startPollingCall) {
        clearInterval(startPolling);
      }
    };
  }, [startPolling]);

  useEffect(() => {
    getAmount();
  }, [selectedMemberIds,orgMembers]);

  useEffect(() => {
    handleSetSubscriptionPlan(orgId);
  }, [orgId]);

  useEffect(() => {
    console.log('currentSubscriptionPlan',currentSubscriptionPlan,currentPlan);
    if(currentSubscriptionPlan && currentSubscriptionPlan._id){
    let data = { orgId: orgId, isTest: istestLink,user:store.getState().user.userInfo,planId:currentSubscriptionPlan._id}
    handleSetInvoiceList(data);
    }
    else{
      let data = { orgId: orgId, isTest: istestLink,user:store.getState().user.userInfo}
    handleSetInvoiceList(data);
    }
  }, [orgId, istestLink,currentSubscriptionPlan])

  useEffect(() => {
    if (currentSubscriptionPlan) {
      if (currentSubscriptionPlan.subscriptionType === 'Business' || currentSubscriptionPlan.subscriptionType === 'Pro') {
        if (currentSubscriptionPlan.endTime && currentSubscriptionPlan.endTime > 0) {
          setCurrentPlan('Free');
        } 
        else if(!currentSubscriptionPlan.state){
          setCurrentPlan('Free');
        }
        else {
          setCurrentPlan(currentSubscriptionPlan.subscriptionType);
        }
        getRemain();
      }
    }
  }, [currentSubscriptionPlan]);


  const newInvoiceList = list => {
    let arr = [];
    if (list && list.length > 0) {
      list.forEach(e => {
        arr.push({
          id: e._id,
          editor: e.editor,
          total: '$' + e.amount / 100,
          download: e.receipt_url,
          date: moment.unix(e.created).format('MMM DD, YYYY')
        });
      });
    }
    return arr;
  };

  const displayInvoice = currentPlan => {
    const columns = [
      {
        field: 'date',
        headerName: t('components.billing.inviocedata'),
        width: 225
        //renderCell: params => orgMembersListNameCell(params)
      },
      {
        field: 'editor',
        headerName: t('components.billing.invioceeditor'),
        width: 155
        //renderCell: params => orgMembersListRoleCell(params),
        //sortComparator: (v1, v2) => v1.charCodeAt(4) - v2.charCodeAt(4)
      },
      {
        field: 'total',
        headerName: t('components.billing.inviocetotal'),
        sortable: false,
        width: 165,
        disableClickEventBubbling: true
      },
      {
        field: 'download',
        headerName: t('components.billing.inviocedownload'),
        sortable: false,
        width: 225,
        disableClickEventBubbling: false,
        renderCell: params => {
          return <a href={params.value} target='_blank'>{t('components.billing.inviocedownload')}</a>;
        }
      }
    ];

    switch (currentPlan) {
      case 'Free':
      case 'Pro':
      case 'Business':
        return (
          <div>
            <Card
              sx={{
                width: '716px',
                top: '394px',
                border: '#ccc 1px solid',
                background: '#FFFFFF',
                boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
                borderRadius: '6px',
                marginTop: '10px',
                marginLeft: '10px',
                maxHeight: '450px',
                overflow: 'scroll'
              }}
            >
              <CardHeader
                title={t('components.billing.Invoice')}
                titleTypographyProps={{
                  fontFamily: 'Inter',
                  fontSize: '20px',
                  fontWeight: 500,
                  lineHeight: '32px',
                  letterSpacing: '0.15px',
                  textAlign: 'left',
                }}
              />
              <CardContent>
                <DataGrid
                  autoHeight
                  classes={{
                    root: classes.root,
                    cell: classes.cell,
                    columnHeader: classes.columnHeader,
                    columnHeaderTitle: classes.columnHeaderTitle,
                    columnHeaderTitleContainer:
                      classes.columnHeaderTitleContainer
                  }}
                  columns={columns}
                  disableColumnMenu
                  disableSelectionOnClick
                  // autoPageSize
                  rowHeight={64}
                  rows={rows}
                  pageSize={3}
                  rowsPerPageOptions={[5, 10, 25, 100]}
                  showColumnRightBorder
                  sortingOrder={['desc', 'asc']}
                />
              </CardContent>
            </Card>
          </div>
        );
    }
  };
  // Handle Upgrade Plan dialog
  const handleUpgradePlansClickOpen = async () => {
    if (selectedMemberIds.length === 0) {
      alert('Your shoulde at least choose one member!');
      return;
    }
    if (!selectedMemberIds?.includes(store.getState().user.userInfo.userId)) {
      alert('Your should select yourself!');
      return;
    }
    // TODO: put selected members into this list
    let memberList = selectedMemberIds;

    // memberList.push(store.getState().user.userInfo.userId);   //正式版本去掉这行
    let quantity = selectedMemberIds?.length;
    let planType = selectMonthly === 'monthly' ? 'month' : 'year';

    const newData = {
      orgId: orgId,
      memberList: memberList,
      type: item,
      isTest: istestLink,
      quantity: quantity,
      planType: planType,
      amount: amount * 100,
      user:store.getState().user.userInfo
    };
    //订阅套餐 
    server.call('createSubscriptionRecordLink', newData).then(result => {
      handleCloseExplorePlans();
      if (result.msg === 'success') {
        if (result.data) {
          setStartPolling(true);
          window.open(result.data);

        }
        else {
          alert('Subscription Plan Members has been Change,new invoice will be effected next billing cycle!');
        }
      }
    }).catch(err => {
      console.log(err)
    });

  };

  const handleUpgradePlansClose = () => setOpenUpgradePlans(false);

  // ******* NEW ****** Handle Explore Plan dialog
  const handleExplorePlansClickOpen = async () => {
    let checkRoleOfManageTeam: any = await checkActionPermission('Team Payment ManageMent');
    if (checkRoleOfManageTeam && !checkRoleOfManageTeam.data) {
      Boardx.Util.Msg.info(
        t('components.billing.noRoleToCreateOrChangeSubscriptionPlan')
      );
      return;
    }
    else {
      setOpenExplorePlans(true);
    }
  };

  const handleExplorePlansClose = () => {
    setOpenExplorePlans(false);
    setOpenSelectMembers(false);
  }

  const handleSelectMemberClickOpen = async (t) => {
    let checkRoleOfManageTeam: any = await checkActionPermission(
      'Team Payment ManageMent'
    );
    if (checkRoleOfManageTeam && !checkRoleOfManageTeam.data) {
      Boardx.Util.Msg.info(
        t('components.billing.noRoleToCreateOrChangeSubscriptionPlan')
      );
      return;
    }
    else {
      setItem(t)
      setOpenSelectMembers(true);
      setOpenExplorePlans(false);
    }
  };

  const handleSelectMemberClose = () => {
    let arr2 = [];
    orgMemberList?.map(t => {
      if (currentSubscriptionPlan?.memberList?.includes(t.userId)) {
        arr2.push(t.userId)
      }

    })
    setSelectedMemberIds(arr2)
    setOpenSelectMembers(false);
  }

  const handleStepBack = e => {
    setOpenSelectMembers(false);
    setOpenExplorePlans(true);
  }
  const handleCloseExplorePlans = () => {
    setOpenSelectMembers(false);
    setOpenExplorePlans(false);
  };

  const handleCancelSubscription = async (id) => {
    let checkRoleOfManageTeam: any = await checkActionPermission(
      'Team Payment ManageMent'
    );
    if (checkRoleOfManageTeam && !checkRoleOfManageTeam.data) {
      Boardx.Util.Msg.info(
        t('components.billing.noRoleToCreateOrChangeSubscriptionPlan')
      );
      return;
    } else {
      if (confirm('Are you sure to unsubscribe?') === true) {
        let org = store.getState().org.orgInfo;
        const isTest = istestLink;
        server.call('unSubscriptionRecord',org.orgId, isTest).then((result) => {
          if (result) {
            setCurrentPlan('Free');
            alert(
              t('components.billing.alreadyCalcelThisSubscriptionPlan')
            );
          }
        }
        );
      }
    }
  };

  const upgradePlansPopUp = currentPlan => {
    const orgMembersListNameCell = params => {
      const user = params.row;
      console.log('user of billing',user)
      let username =
        user.user && user.user.length !== 0 ? user.user[0].name : user.username;
      let imgSrc =
        user.userId === store.getState().user.userInfo.userId
          ? userInfo.avatar
          : '';

      return (
        <Fragment>
          <Avatar
            {...UserService.getInstance().stringAvatar(username)}
            alt={username ? username.toUpperCase() : 'member'}
            className={classes.userNameAvatar}
            id="avatar-img"
            src={imgSrc}
          >
          {username?.toUpperCase().charAt(0)}
          </Avatar>
          <Typography className={classes.userNameText} style={{marginLeft:'12px'}}>{username}</Typography>
          {/*<Typography className={classes.userEmailText}> Jerrod98@gmail.com</Typography>*/}
        </Fragment>
      );
    };
    const columns = [
      {
        field: 'name',
        headerName: t('components.billing.NAME'),
        width: 440,
        renderCell: params => orgMembersListNameCell(params)
      },
      {
        field: 'selected',
        headerName: t('components.billing.SELECTED'),
        width: 440,
        renderCell: params => {
          return (
            <Checkbox
              defaultChecked={params.row.selected === true ? true : false}
              onChange={e => {
                handleChangeCheckedMembers(e, params.row);
              }}
            />
          );
        }
      },
    ];
    return (
      <Fragment>
        <Dialog
          maxWidth={'lg'}
          fullWidth={true}
          open={openExplorePlans}
          onClose={handleExplorePlansClose}
          style={{}}
        >
          <Box
            sx={{
              minWidth: '780px',
              minHeight: '800px',
              padding: '36px 48px'
            }}
          >
            <Typography
              style={{
                fontSize: '24px',
                fontFamily: 'Inter',
                fontWeight: '500',
                margin: '0 auto',
                textAlign: 'center'
              }}
            >
              {t('components.billing.Chooseaplan')}
            </Typography>
            <Typography
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '400',
                color: 'rgba(58, 53, 65, 0.68)',
                letterSpacing: '0.15',
                margin: '0 auto',
                textAlign: 'center',
                paddingTop: '12px',
                paddingBottom: '15px'
              }}
            >
              {t('components.billing.fityourneeds')}
              
            </Typography>
            <Box style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
              <Typography>{t('components.billing.Monthly')}</Typography>
              <Switch checked={selectMonthly === 'monthly' ? false : true} onChange={handleChangeMonthly} />
              <Typography>{t('components.billing.Annually')} (save 20%) </Typography>
            </Box>
            <Box
              sx={{
                display: 'flex',
                flexDirection: 'row',
                p: 1,
                m: 1,
                padding: '20px',
                lineHeight: '20px'
              }}
            >
              <Item>
                <Box
                  sx={{ border: 1 }}
                  style={{
                    borderRadius: '6px',
                    border: '1px solid rgba(58, 53, 65, 0.12)',
                    padding: '20px',
                    lineHeight: '20px',
                    width: '100%', height: '545px'
                  }}
                >
                  <Box style={{ textAlign: 'center' }}>
                    <svg
                      width="49"
                      height="85"
                      viewBox="0 0 49 85"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                      style={{ margin: '0 auto', marginTop: '40px' }}
                    >
                      <ellipse
                        opacity="0.68"
                        cx="24.0763"
                        cy="23.9924"
                        rx="24.0763"
                        ry="23.9924"
                        fill="#F21D6B"
                      />
                      <path
                        opacity="0.68"
                        d="M24.0768 47.216C11.1898 47.216 0.772217 36.7577 0.772217 23.9925C0.772217 11.1504 11.267 0.769043 24.0768 0.769043C36.9638 0.769043 47.3814 11.2273 47.3814 23.9925C47.3814 36.8346 36.8866 47.216 24.0768 47.216Z"
                        fill="url(#paint0_linear_7846_13725)"
                      />
                      <path
                        d="M28.8056 22.0753C28.511 21.7649 28.0691 21.7649 27.7745 22.0753L25.2705 24.7138V14.1598C25.2705 13.6942 24.9759 13.3838 24.534 13.3838C24.0921 13.3838 23.7975 13.6942 23.7975 14.1598V34.9573L19.7468 30.6892C19.4522 30.3788 19.0103 30.3788 18.7157 30.6892C18.4211 30.9996 18.4211 31.4652 18.7157 31.7756L23.7975 37.1302V64.2136C23.7975 64.6792 24.0921 64.9896 24.534 64.9896C24.9759 64.9896 25.2705 64.6792 25.2705 64.2136V26.8867L28.8056 23.1617C29.1002 22.8513 29.1002 22.3857 28.8056 22.0753Z"
                        fill="#F21D6B"
                      />
                      <rect
                        x="16.3882"
                        y="59.7236"
                        width="16.8509"
                        height="25.2763"
                        fill="#C6C2D6"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_7846_13725"
                          x1="47.3814"
                          y1="23.9925"
                          x2="0.772217"
                          y2="23.9925"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F21D6B" />
                          <stop offset="1" stopColor="#C6A7FE" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <Typography
                      style={{
                        fontSize: '18px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '0 auto'
                      }}
                    >
                      {t('components.billing.Essential')}
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '8px 0',
                        padding: '8px', minHeight: '80px'
                      }}
                    >{t('components.billing.Pay-as-you-go')}
                      
                    </Typography>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingBottom: '15px'
                        }}
                      >
                        $
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '48px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: '#F21D6B'
                        }}
                      >
                        0
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingTop: '8px'
                        }}
                      >
                        /{selectMonthly === 'monthly' ? t('components.billing.mo.') : t('components.billing.year')}
                      </Typography>
                    </Box>
                    <List
                      sx={{
                        '& .MuiListItem-root': {
                          display: 'list-item'
                        }
                      }}
                      style={{
                        margin: '4px 0',
                        color: 'rgba(58, 53, 65, 0.68)',
                        fontFamily: 'Inter',
                        textAlign: 'left',
                        paddingLeft: '20px', minHeight: '100px'
                      }}
                    >

                      <Typography variant="caption">
                      {t('components.billing.Pay1Info')}
                        
                      </Typography>

                    </List>
                  </Box>
                  <Box style={{ textAlign: 'center', margin: '0 auto' }}>
                    {currentPlan === 'Free' ? (
                      <Button
                        className={classes.saveButton}
                        variant="contained"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#fff',
                        }}
                      >
                        {t('components.billing.currentPlan')}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleCancelSubscription}
                        variant="contained"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#ffffff'
                        }}
                      >
                        {'DownGrade'}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Item>
              <Item>
                <Box
                  sx={{ border: 1 }}
                  style={{
                    borderRadius: '6px',
                    border: '1px solid rgba(58, 53, 65, 0.12)',
                    padding: '20px',
                    lineHeight: '20px',
                    width: '100%', height: '545px'
                  }}
                >
                  <Box style={{ textAlign: 'center' }}>
                    <svg
                      width="33"
                      height="120"
                      viewBox="0 0 33 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.863673"
                        d="M29.0359 48.0418C25.5521 39.0145 22.2794 33.6189 23.5462 22.8276C24.8131 12.0364 27.1356 0 16.1563 0C5.177 0 7.49954 11.9326 8.76639 22.8276C10.0332 33.6189 6.76055 39.0145 3.27673 48.0418C-0.207089 57.0691 -5.69674 81.4532 16.1563 81.4532C37.9038 81.4532 32.5197 57.0691 29.0359 48.0418Z"
                        fill="url(#paint0_linear_7846_13736)"
                      />
                      <path
                        d="M20.2484 40.8636C19.9085 40.5578 19.3421 40.5578 19.0023 40.8636L16.1701 43.4119V13.5454C16.1701 13.1377 15.8303 12.73 15.2639 12.73C14.8107 12.73 14.3576 13.0358 14.3576 13.5454V68.1817L9.71293 64.0025C9.37308 63.6967 8.80666 63.6967 8.4668 64.0025C8.12695 64.3083 8.12695 64.8179 8.4668 65.1237L14.3576 70.4243V100.189C14.3576 100.597 14.6974 101.004 15.2639 101.004C15.717 101.004 16.1701 100.698 16.1701 100.189V45.7564L20.2484 42.0868C20.5882 41.6791 20.5882 41.1694 20.2484 40.8636Z"
                        fill="#F21D6B"
                      />
                      <path
                        d="M23.6754 120H7.2758L4.86035 90.9478H26.0909L23.6754 120Z"
                        fill="#C6C2D6"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_7846_13736"
                          x1="32.2803"
                          y1="40.7266"
                          x2="-1.69136e-07"
                          y2="40.7266"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F21D6B" />
                          <stop offset="1" stopColor="#C6A7FE" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <Typography
                      style={{
                        fontSize: '18px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '0 auto'
                      }}
                    >
                      Pro
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '8px 0',
                        padding: '8px', minHeight: '80px'
                      }}
                    >
                      {t('components.billing.planInfo2')}
                    </Typography>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingBottom: '15px'
                        }}
                      >
                        $
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '48px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: '#F21D6B'
                        }}
                      >
                        {selectMonthly === 'monthly' ? '10' : '8'}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingTop: '8px'
                        }}
                      >
                        {t('components.billing.member')} /{selectMonthly === 'monthly' ? t('components.billing.mo.') : t('components.billing.year')}
                      </Typography>
                    </Box>
                    <List
                      sx={{
                        '& .MuiListItem-root': {
                          display: 'list-item'
                        }
                      }}
                      style={{
                        margin: '4px 0',
                        color: 'rgba(58, 53, 65, 0.68)',
                        fontFamily: 'Inter',
                        textAlign: 'left',
                        minHeight: '100px'
                      }}
                    >

                      <Typography variant="caption">
                      {t('components.billing.planContent2')}
                      </Typography>
                    </List>
                  </Box>
                  <Box style={{ textAlign: 'center', margin: '0 auto' }}>
                    {currentPlan === 'Pro' ? (
                      <Button
                        className={classes.saveButton}
                        variant="contained"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#fff'
                        }}
                      >
                        {t('components.billing.currentPlan')}
                      </Button>
                    ) : (
                      <Button
                        onClick={handleSelectMemberClickOpen.bind(
                          this,
                          'Pro'
                        )}
                        // TODO: move this to the new dialog
                        // onClick={handleUpgradePlansClickOpen.bind(
                        //   this,
                        //   'Pro'
                        // )}
                        variant="contained"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#ffffff'
                        }}
                      >
                        {t('components.billing.Upgradedplans')}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Item>
              <Item>
                <Box
                  sx={{ border: 1 }}
                  style={{
                    borderRadius: '6px',
                    border: '1px solid rgba(58, 53, 65, 0.12)',
                    padding: '20px',
                    lineHeight: '20px',
                    width: '100%', height: '545px'
                  }}
                >
                  <Box style={{ textAlign: 'center' }}>
                    <svg
                      width="56"
                      height="120"
                      viewBox="0 0 56 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.607474"
                        d="M8.41463 0.555099C-15.0611 49.4944 17.4228 82.5738 23.2462 87.9209C23.7012 88.2834 24.4291 88.1928 24.7021 87.649C28.4327 80.6706 48.1778 38.8003 9.96149 0.283214C9.41554 -0.169928 8.68761 -0.0792999 8.41463 0.555099Z"
                        fill="#F21D6B"
                      />
                      <path
                        opacity="0.607474"
                        d="M23.8828 87.1957C21.2441 84.7488 13.1458 76.5922 7.32241 63.9042C1.04401 50.1287 -3.68754 28.0154 9.23322 0.91748C30.5252 22.3058 33.2549 44.691 31.7991 59.826C30.5252 73.6921 25.5207 84.1144 23.8828 87.1957Z"
                        fill="url(#paint0_linear_7846_13670)"
                      />
                      <path
                        d="M21.0622 64.9919L26.0667 58.0135C26.3397 57.5603 26.2487 57.0166 25.8847 56.7447C25.4298 56.4728 24.8838 56.5634 24.6109 56.9259L20.6982 62.4543L18.3325 48.4069V48.4069L15.4207 31.2781L18.1505 27.4717C18.4234 27.1092 18.3325 26.4748 17.9685 26.2029C17.5135 25.931 16.9676 26.0216 16.6946 26.3842L15.0568 28.6499L12.327 12.6086C12.236 12.1555 11.7811 11.793 11.2351 11.8836C10.7802 11.9742 10.4162 12.4274 10.5072 12.9712L13.6009 31.1875V31.1875L16.2397 46.5037L9.77928 41.8816C9.32432 41.6097 8.77837 41.7004 8.5054 42.0629C8.23242 42.516 8.32342 43.0598 8.68738 43.3317L16.6946 48.9506L19.3334 64.8106V64.8106L26.1577 104.868C26.2487 105.322 26.6127 105.593 27.0676 105.593C27.1586 105.593 27.1586 105.593 27.2496 105.593C27.7046 105.503 28.0685 105.05 27.9775 104.506L21.0622 64.9919Z"
                        fill="#F21D6B"
                      />
                      <path
                        d="M52.8024 41.6116C24.7764 60.8286 32.0594 88.8724 33.5345 93.5617C33.6267 93.9295 34.0876 94.1134 34.3642 93.8376C38.5128 91.1711 62.3903 74.6206 53.7243 41.8875C53.6321 41.6116 53.1712 41.4277 52.8024 41.6116Z"
                        fill="#F21D6B"
                      />
                      <path
                        d="M34.088 93.4697C33.4427 91.3549 31.5988 84.3669 32.4286 75.632C33.3505 66.1614 37.6834 52.7372 53.1715 42.0713C57.9655 60.2768 52.5262 73.3333 46.9947 81.0569C41.9242 88.1368 35.9318 92.2744 34.088 93.4697Z"
                        fill="url(#paint1_linear_7846_13670)"
                      />
                      <path
                        d="M50.6817 48.6914C50.4051 48.5994 50.0364 48.6914 49.9442 49.0592L45.8878 59.9089V59.9089L42.4767 69.0117L40.4485 64.5063C40.3563 64.2304 39.9875 64.1385 39.711 64.2304C39.4344 64.3224 39.3422 64.6902 39.4344 64.966L42.0157 70.4828L38.5125 79.8614V79.8614L29.6622 103.676C29.57 103.952 29.6622 104.319 30.0309 104.411C30.1231 104.411 30.1231 104.411 30.2153 104.411C30.4919 104.411 30.6763 104.227 30.7684 104.044L39.5266 80.4131L44.4127 78.2064C44.6893 78.1144 44.7815 77.7466 44.6893 77.4708C44.5971 77.195 44.2283 77.103 43.9518 77.195L40.0797 78.942L43.2142 70.5748V70.5748L46.9941 60.3686L49.6676 59.1733C49.9442 59.0814 50.0364 58.7136 49.9442 58.4378C49.852 58.1619 49.4832 58.07 49.2066 58.1619L47.6394 58.8975L51.1427 49.335C51.1427 49.1511 50.9583 48.8753 50.6817 48.6914Z"
                        fill="#F21D6B"
                      />
                      <rect
                        x="19.3916"
                        y="101.186"
                        width="16.8334"
                        height="18.8138"
                        fill="#C6C2D6"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_7846_13670"
                          x1="32.125"
                          y1="44.0566"
                          x2="1.04004"
                          y2="44.0566"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F21D6B" />
                          <stop offset="1" stopColor="#C6A7FE" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_7846_13670"
                          x1="55.0162"
                          y1="67.7705"
                          x2="32.2178"
                          y2="67.7705"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F21D6B" />
                          <stop offset="1" stopColor="#C6A7FE" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <Typography
                      style={{
                        fontSize: '18px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '0 auto'
                      }}
                    >
                      Team
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '8px 0', padding: '6px', minHeight: '80px'
                      }}
                    >
                      {t('components.billing.planInfo3')}
                    </Typography>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingBottom: '15px'
                        }}
                      >
                        $
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '48px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: '#F21D6B'
                        }}
                      >
                        {selectMonthly === 'monthly' ? '?' : '?'}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingTop: '8px'
                        }}
                      >
                        {t('components.billing.member')} /{selectMonthly === 'monthly' ? t('components.billing.mo.') : t('components.billing.year')}
                      </Typography>
                    </Box>
                    <List
                      sx={{
                        '& .MuiListItem-root': {
                          display: 'list-item'
                        }
                      }}
                      style={{
                        margin: '4px 0',
                        color: 'rgba(58, 53, 65, 0.68)',
                        fontFamily: 'Inter',
                        textAlign: 'left',
                        minHeight: '100px'
                      }}
                    >

                      <Typography variant="caption">
                      {t('components.billing.planContent3')}
                      </Typography>

                    </List>
                  </Box>
                  <Box style={{ textAlign: 'center', margin: '0 auto' }}>
                    {currentPlan === 'Team' ? (
                      <Button
                        className={classes.saveButton}
                        variant="outlined"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#F21D6B'
                        }}
                      >
                        {t('components.billing.currentPlan')}
                      </Button>
                    ) : (
                      <Button
                        //onClick={handleSelectMemberClickOpen.bind(
                        //this,
                        //  'Business'
                        // )}
                        variant="contained"
                        style={{
                          backgroundColor: '#ccc',
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#ffffff'
                        }}
                      >
                        {t('components.billing.comingSoon')}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Item>
              <Item>
                <Box
                  sx={{ border: 1 }}
                  style={{
                    borderRadius: '6px',
                    border: '1px solid rgba(58, 53, 65, 0.12)',
                    padding: '20px',
                    lineHeight: '20px',
                    width: '100%', height: '545px'
                  }}
                >
                  <Box style={{ textAlign: 'center' }}>
                    <svg
                      width="56"
                      height="120"
                      viewBox="0 0 56 120"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg"
                    >
                      <path
                        opacity="0.607474"
                        d="M8.41463 0.555099C-15.0611 49.4944 17.4228 82.5738 23.2462 87.9209C23.7012 88.2834 24.4291 88.1928 24.7021 87.649C28.4327 80.6706 48.1778 38.8003 9.96149 0.283214C9.41554 -0.169928 8.68761 -0.0792999 8.41463 0.555099Z"
                        fill="#F21D6B"
                      />
                      <path
                        opacity="0.607474"
                        d="M23.8828 87.1957C21.2441 84.7488 13.1458 76.5922 7.32241 63.9042C1.04401 50.1287 -3.68754 28.0154 9.23322 0.91748C30.5252 22.3058 33.2549 44.691 31.7991 59.826C30.5252 73.6921 25.5207 84.1144 23.8828 87.1957Z"
                        fill="url(#paint0_linear_7846_13670)"
                      />
                      <path
                        d="M21.0622 64.9919L26.0667 58.0135C26.3397 57.5603 26.2487 57.0166 25.8847 56.7447C25.4298 56.4728 24.8838 56.5634 24.6109 56.9259L20.6982 62.4543L18.3325 48.4069V48.4069L15.4207 31.2781L18.1505 27.4717C18.4234 27.1092 18.3325 26.4748 17.9685 26.2029C17.5135 25.931 16.9676 26.0216 16.6946 26.3842L15.0568 28.6499L12.327 12.6086C12.236 12.1555 11.7811 11.793 11.2351 11.8836C10.7802 11.9742 10.4162 12.4274 10.5072 12.9712L13.6009 31.1875V31.1875L16.2397 46.5037L9.77928 41.8816C9.32432 41.6097 8.77837 41.7004 8.5054 42.0629C8.23242 42.516 8.32342 43.0598 8.68738 43.3317L16.6946 48.9506L19.3334 64.8106V64.8106L26.1577 104.868C26.2487 105.322 26.6127 105.593 27.0676 105.593C27.1586 105.593 27.1586 105.593 27.2496 105.593C27.7046 105.503 28.0685 105.05 27.9775 104.506L21.0622 64.9919Z"
                        fill="#F21D6B"
                      />
                      <path
                        d="M52.8024 41.6116C24.7764 60.8286 32.0594 88.8724 33.5345 93.5617C33.6267 93.9295 34.0876 94.1134 34.3642 93.8376C38.5128 91.1711 62.3903 74.6206 53.7243 41.8875C53.6321 41.6116 53.1712 41.4277 52.8024 41.6116Z"
                        fill="#F21D6B"
                      />
                      <path
                        d="M34.088 93.4697C33.4427 91.3549 31.5988 84.3669 32.4286 75.632C33.3505 66.1614 37.6834 52.7372 53.1715 42.0713C57.9655 60.2768 52.5262 73.3333 46.9947 81.0569C41.9242 88.1368 35.9318 92.2744 34.088 93.4697Z"
                        fill="url(#paint1_linear_7846_13670)"
                      />
                      <path
                        d="M50.6817 48.6914C50.4051 48.5994 50.0364 48.6914 49.9442 49.0592L45.8878 59.9089V59.9089L42.4767 69.0117L40.4485 64.5063C40.3563 64.2304 39.9875 64.1385 39.711 64.2304C39.4344 64.3224 39.3422 64.6902 39.4344 64.966L42.0157 70.4828L38.5125 79.8614V79.8614L29.6622 103.676C29.57 103.952 29.6622 104.319 30.0309 104.411C30.1231 104.411 30.1231 104.411 30.2153 104.411C30.4919 104.411 30.6763 104.227 30.7684 104.044L39.5266 80.4131L44.4127 78.2064C44.6893 78.1144 44.7815 77.7466 44.6893 77.4708C44.5971 77.195 44.2283 77.103 43.9518 77.195L40.0797 78.942L43.2142 70.5748V70.5748L46.9941 60.3686L49.6676 59.1733C49.9442 59.0814 50.0364 58.7136 49.9442 58.4378C49.852 58.1619 49.4832 58.07 49.2066 58.1619L47.6394 58.8975L51.1427 49.335C51.1427 49.1511 50.9583 48.8753 50.6817 48.6914Z"
                        fill="#F21D6B"
                      />
                      <rect
                        x="19.3916"
                        y="101.186"
                        width="16.8334"
                        height="18.8138"
                        fill="#C6C2D6"
                      />
                      <defs>
                        <linearGradient
                          id="paint0_linear_7846_13670"
                          x1="32.125"
                          y1="44.0566"
                          x2="1.04004"
                          y2="44.0566"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F21D6B" />
                          <stop offset="1" stopColor="#C6A7FE" />
                        </linearGradient>
                        <linearGradient
                          id="paint1_linear_7846_13670"
                          x1="55.0162"
                          y1="67.7705"
                          x2="32.2178"
                          y2="67.7705"
                          gradientUnits="userSpaceOnUse"
                        >
                          <stop stopColor="#F21D6B" />
                          <stop offset="1" stopColor="#C6A7FE" />
                        </linearGradient>
                      </defs>
                    </svg>

                    <Typography
                      style={{
                        fontSize: '18px',
                        fontFamily: 'Inter',
                        fontWeight: 'bold',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '0 auto'
                      }}
                    >
                      Team
                    </Typography>
                    <Typography
                      style={{
                        fontSize: '14px',
                        fontFamily: 'Inter',
                        fontWeight: '400',
                        letterSpacing: '0.15',
                        color: 'rgba(58, 53, 65, 0.68)',
                        margin: '8px 0', padding: '8px', minHeight: '80px'
                      }}
                    >
                      {t('components.billing.planInfo4')}
                    </Typography>
                    <Box
                      style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}
                    >
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingBottom: '15px'
                        }}
                      >
                        $
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '48px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: '#F21D6B'
                        }}
                      >
                        {selectMonthly === 'monthly' ? '?' : '?'}
                      </Typography>
                      <Typography
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '400',
                          letterSpacing: '0.15',
                          color: 'rgba(58, 53, 65, 0.68)',
                          paddingTop: '8px'
                        }}
                      >
                        {t('components.billing.member')} /{selectMonthly === 'monthly' ? t('components.billing.mo.') : t('components.billing.year')}
                      </Typography>
                    </Box>
                    <List
                      sx={{
                        '& .MuiListItem-root': {
                          display: 'list-item'
                        }
                      }}
                      style={{
                        margin: '4px 0',
                        color: 'rgba(58, 53, 65, 0.68)',
                        fontFamily: 'Inter',
                        textAlign: 'left',
                        paddingLeft: '20px', minHeight: '100px'
                      }}
                    >

                      <Typography variant="caption">
                      {t('components.billing.planContent3')}
                      </Typography>

                    </List>
                  </Box>
                  <Box style={{ textAlign: 'center', margin: '0 auto' }}>
                    {currentPlan === 'Team' ? (
                      <Button
                        className={classes.saveButton}
                        variant="outlined"
                        style={{
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#F21D6B'
                        }}
                      >
                        {t('components.billing.currentPlan')}
                      </Button>
                    ) : (
                      <Button
                        //onClick={handleSelectMemberClickOpen.bind(
                        //this,
                        //  'Business'
                        // )}
                        variant="contained"
                        style={{
                          backgroundColor: '#ccc',
                          fontSize: '14px',
                          fontFamily: 'Inter',
                          fontWeight: '500',
                          marginTop: '16px',
                          color: '#ffffff'
                        }}
                      >
                        {t('components.billing.comingSoon')}
                      </Button>
                    )}
                  </Box>
                </Box>
              </Item>
            </Box>
          </Box>
        </Dialog>
        <Dialog
          maxWidth={'lg'}
          fullWidth={true}
          open={openSelectMembers}
          onClose={handleSelectMemberClose}
          style={{}}
        >
          <Box
            sx={{
              minWidth: '780px',
              minHeight: '800px',
              padding: '36px 48px',
            }}
          >
            <ArrowBackOutlined onClick={handleStepBack} className={classes.backBox} />
            <Stack
              direction={'row'}
              sx={{
                minWidth: '1060px',
                minHeight: '580px',
                p: 1,
              }}

            >
              <Item>
                <Stack
                  spacing={3}
                  sx={{ width: '580px', minHeight: '580px', margin: '8px' }}
                >
                  {/* TODO: Progress Step Bar from React MUI Stepper
                <Stack direction="row" spacing={1} sx={{marginBottom: '24px'}}>
                  <Item>1 Select Plan</Item>
                  <Item>2 Select Member</Item>
                  <Item>3 Proceed To Payment</Item>
                </Stack> */}
                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: '20px',
                      fontWeight: '500',
                      lineHeight: '24px',
                      letterSpacing: '0em',
                      textAlign: 'left'
                    }}
                  >
                    {t('components.billing.Select your Pro members')}
                  </Typography>
                  <Typography
                    sx={{
                      fontFamily: 'Inter',
                      fontSize: '14px',
                      fontWeight: '400',
                      lineGeight: '20px',
                      letterSpacing: '0em',
                      textAlign: 'left'
                    }}
                  >
                    {t('components.billing.SelectmembersforyourProPlan')}
                  </Typography>
                  <TextField
                    fullWidth
                    id="fullname"
                    inputProps={{ style: { height: '18px', width: '95%' } }}
                    label="Filter"
                    variant="outlined"
                    onKeyDown={handleSearch}
                  />
                  <DataGrid
                    columns={columns}
                    rows={searchResult ? searchResult : orgMembers}
                    rowHeight={64}

                    disableColumnMenu
                    // hideFooterPagination
                    rowsPerPageOptions={[5, 10, 20, 50, 100]}
                    sortingOrder={['desc', 'asc']}
                    pageSize={20}

                  />
                </Stack>
              </Item>
              <Item>
                <Stack>
                  <Card sx={{ p: 1, width: '480px', margin: '16px', border: '#ccc 1px solid' }}>
                    <CardContent>
                      <Stack spacing={5}>
                        <Typography
                          sx={{
                            fontFamily: 'Inter',
                            fontSize: '20px',
                            fontWeight: '500',
                            lineHeight: '32px',
                            letterSpacing: '0.15px',
                            textAlign: 'left'
                          }}
                        >
                          {t('components.billing.SelectedPlan')}
                        </Typography>
                        <Chip
                          label='Pro Plan'
                          sx={{
                            height: '24px',
                            width: 'fit-content',
                            borderRadius: '16px',
                            padding: '3px 4px 3px 4px',
                            background: 'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #F21D6B',


                          }}
                        />
                        <Typography>
                          {selectedMemberIds?.length} {t('components.billing.membersper')} {selectMonthly === 'monthly' ? t('components.billing.mo.') : t('components.billing.year')}
                        </Typography>
                        <Divider></Divider>
                        <Typography>
                        {t('components.billing.Subtotal')} = ${amount}
                        </Typography>
                      </Stack>
                    </CardContent>
                  </Card>
                  <Button
                    variant="contained"
                    fullWidth={true}
                    sx={{
                      background: 'F21D6B',
                      boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
                      borderRadius: '5px',
                      margin: '24px'
                    }}
                    onClick={handleUpgradePlansClickOpen}
                  >
                    <Typography
                      sx={{
                        fontFamily: 'Inter',
                        fontSize: '48px,',
                        fontWeight: '500',
                        letterSpacing: '0.46px',
                      }}>
                        {t('components.billing.ProceedToPayment')}
                    </Typography><ArrowForwardOutlined></ArrowForwardOutlined>
                  </Button>
                </Stack>
              </Item>
            </Stack>
          </Box>
        </Dialog>
      </Fragment>
    );
  };
  const displayPlan = currentPlan => {
    switch (currentPlan) {
      case null:
        return (
          <Card>
            <CardHeader
              title="Current Plan"
              titleTypographyProps={{ variant: 'h5', fontWeight: 600 }}
            />
            <CardContent sx={{ minHeight: 200, textAlign: 'center' }}>
              {/* loading information.... */}
              <Box sx={{ width: 300 }}>
                <Skeleton variant="text" animation="wave" />
                <Skeleton variant="text" animation="wave" />
                <Skeleton
                  variant="rectangular"
                  animation="wave"
                  width={300}
                  height={80}
                />
                <Skeleton variant="text" animation="wave" width={200} />
              </Box>
            </CardContent>
          </Card>
        );
      default:
        return (
          <Fragment>
            <Box style={{ display: 'flex' }}>
              <Card
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  width: '340px',
                  padding: '20px',
                  gap: '24px'
                }}
                style={{
                  marginTop: '10px',
                  borderRadius: '10px',
                  border: '#ccc 1px solid'
                }}
              >
                <Stack direction="row" spacing="90px">
                  <Chip
                    sx={{ borderRadius: '4px' }}
                    style={{
                      backgroundColor: 'rgb(186, 204, 251)',
                      color: '#ffffff'
                    }}
                    label={currentPlan === 'Free' ? 'Basic' : 'Pro'}
                  />
                  {currentPlan !== 'Free' && (<Chip
                    sx={{ borderRadius: '4px', border: 'hidden' }}
                    style={{
                      color: '#F21D6B',
                      fontSize: '16px',
                      fontWeight: 'bold'
                    }}
                    onClick={handleSelectMemberClickOpen.bind(
                      this,
                      currentPlan
                    )}
                    variant="outlined"
                    label='Change Members'
                  />)}
                </Stack>

                <List
                  sx={{
                    '& .MuiListItem-root': {
                      display: 'list-item'
                    }
                  }}
                  style={{
                    margin: '15px 0',
                    color: 'rgba(58, 53, 65, 0.68)',
                    fontFamily: 'Inter',
                    textAlign: 'left'
                  }}
                >
                  <ListItem
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px'
                    }}
                  >
                    <Typography
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#E0E0E0',
                        borderRadius: '50%',
                        marginRight: '8px'
                      }}
                    ></Typography>
                    <Typography variant="caption">{t('components.billing.1room')}</Typography>
                  </ListItem>
                  <ListItem
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px'
                    }}
                  >
                    <Typography
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#E0E0E0',
                        borderRadius: '50%',
                        marginRight: '8px'
                      }}
                    ></Typography>
                    <Typography variant="caption">{t('components.billing.3project')}</Typography>
                  </ListItem>
                  <ListItem
                    style={{
                      display: 'flex',
                      alignItems: 'center',
                      paddingLeft: '8px'
                    }}
                  >
                    <Typography
                      style={{
                        width: '10px',
                        height: '10px',
                        backgroundColor: '#E0E0E0',
                        borderRadius: '50%',
                        marginRight: '8px'
                      }}
                    ></Typography>
                    <Typography variant="caption">{t('components.billing.3editor')}</Typography>
                  </ListItem>
                </List>
                <Box sx={{ height: '48px', paddingBottom: '8px' }}>
                  <Typography variant="h6">{t('components.billing.CreditsBalance')}:</Typography>
                  <Typography variant="h6">{currentSubscriptionPlan?.credits?.toLocaleString("en-US")}</Typography>
                  <LinearProgress
                    variant="determinate"
                    value={remain}
                    style={{ marginTop: '8px', marginBottom: '8px' }}
                  />
                  <Typography
                    variant="caption"
                    style={{ fontSize: '12px', color: 'rgba(58, 53, 65, 0.68)', marginBottom: '8px' }}
                  >
                    {remain}% {t('components.billing.remaining')}
                  </Typography>
                </Box>
                <Typography
                  variant="caption"
                  style={{
                    marginTop: '40px',
                    marginBottom: '15px',
                    color: 'rgba(58, 53, 65, 0.68)'
                  }}
                >
                  {t('components.billing.Upgradeyourplan')}
                  
                </Typography>
                <Button variant="contained" onClick={handleExplorePlansClickOpen}>
                  {currentPlan === 'Free' ? t('components.billing.Upgradedplans') : t('components.billing.Upgradedplans')}
                </Button>
                {currentPlan !== 'Free' && (<Button variant="contained" style={{ backgroundColor: 'rgba(200,72,1,1)', color: '#fff', marginTop: '8px' }} onClick={handleCancelSubscription}>
                  {t('components.billing.Upgradeyourplan')}
                </Button>)}
                {/* TODO: Cancel Plan Button */}
                {upgradePlansPopUp(currentPlan)}
                <Dialog open={openUpgradePlans} onClose={handleUpgradePlansClose}>
                {t('components.billing.Upgradedplans')}

                </Dialog>
              </Card>
            </Box>

            {displayInvoice(currentPlan)}
            <FormControl
              required
              error={error}
              component="fieldset"
              sx={{ m: 3 }}
              variant="standard"
              style={{ display: 'none' }}
            >
              <FormLabel component="legend">Pick two</FormLabel>
              {(elements && elements.length > 0) && (<FormGroup>
                {elements.map((element, index) => (
                  <FormControlLabel
                    key={index}
                    control={
                      <Checkbox
                        checked={checkedMembers?.includes(element)}
                        onChange={handleChangeCheckedElement}
                        value={element}
                      />
                    }
                    label={element.name}
                  />
                ))}
              </FormGroup>)}
              <FormHelperText>You can display an error</FormHelperText>
            </FormControl>
          </Fragment>
        );
    }
  };
  return <Fragment>
    <Box style={{ display: 'flex' }}>
      {displayPlan(currentPlan)}
    </Box>
  </Fragment>;
};

export default UserViewBilling;
