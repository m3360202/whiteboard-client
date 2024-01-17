//** Import react
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory, useLocation } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

//** Import i18n

import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useGetOrgListQuery } from '../../redux/OrgAPISlice';
import { useCheckActionPermissionOfTeamMutation } from '../../redux/PermissionApiSlice';
import {
  handleSetCaptureThumbnail,
  handleSetCaptureThumbnailBoardName
} from '../../store/board';
import { useGetPendingDeletedBoardQuery } from '../../redux/BoardListAPISlice';

//** Import Mui
import { Drawer } from '@mui/material';
import Divider from '@mui/material/Divider';
import ArrowRight from '@mui/icons-material/ArrowRight';
import MenuList from '@mui/material/MenuList';
import Popper from '@mui/material/Popper';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import DashboardArrow from '../../mui/svg/DashboardArrow';
import Box from '@mui/material/Box';
//** Import Services
import { BoardService, OrgService } from '../../services';

//** Imort components
import RoomList from './RoomList';
import OrganizationCreateOrgModal from '../org/OrganizationCreateOrgModal';
import draw from 'store/widget/draw';

import {memo} from 'react';



const drawerWidth = 240;

 function RoomLeftDrawer({ parentComponent }) {
  //use
  const dispatch = useDispatch();

  const history = useHistory();
  const { t } = useTranslation();

  //org setting
  const isOrgAdmin = useSelector((state) => state.org.orgInfo.role) !== 'member' ? true : false;
  const orgInfo = useSelector((state) => state.org.orgInfo);
  const [handleCheckActionPermissionOfTeam] = useCheckActionPermissionOfTeamMutation();
  //user
  const userInfo = useSelector((state) => state.user.userInfo);

  //orgList
  const [switchOrgList, setSwitchOrgList] = useState(false);
  console.log('userInfo.userId', userInfo.userId);
  const { data: orgList = [], isLoading, isError } = useGetOrgListQuery({ userId: userInfo.userId });
  const orgName = useSelector((state) => state.org.orgInfo.name);

  //react dom
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [openCreateOrg, setOpenCreateOrg] = useState(false);
  const [roleForManage, setRoleForManage] = useState(false);
  const open2 = Boolean(anchorEl);

  const { data: deletedBoardList = [] } = useGetPendingDeletedBoardQuery({
    orgId: orgInfo.orgId
  });

  const checkActionPermission = async (permissionName) => {
    let data = {
      permissionName: permissionName,
      role: orgInfo.role
    }
    return await handleCheckActionPermissionOfTeam(data);
  }

  // //load Org List, pull orgId from localstorage as the current orgId, if not exist, pull the first orgId from orgList
  // useEffect(() => {

  //   let orgId=localStorage.getItem('orgId');
  //   if(!orgId) orgId=orgList[0]?.orgId;
  //   if(orgList && orgList.length > 0 && userInfo && userInfo.userId && orgId){
  //     console.log('orglist',orgList);
  //     OrgService.getInstance().loadOrganization(orgId);
  //   }

  // },[orgList,userInfo]);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
    setSwitchOrgList(false);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setSwitchOrgList(false);
  };

  const handleCloseCreateOrg = () => {
    setOpenCreateOrg(false);
  };

  const handleClickOpenManageOrgMenu = async () => {
    if (!roleForManage) {
      Boardx.Util.Msg.info(
        t(
          'pages.listPage.roomSettings.youHaveNoRoleToEnterTeamManageDashboard'
        )
      );
      return;
    }
    handleClose();
    history.push('/teamsetting');
  };

  useEffect(() => {
    const deal = async () => {
      let checkRoleOfManageTeam = await checkActionPermission('Edit Team');
      setRoleForManage(checkRoleOfManageTeam && checkRoleOfManageTeam.data);
    };
    deal();
  }, [orgInfo]);

  useEffect(() => {
    if (!orgInfo?.orgId) return;

    OrgService.getInstance().loadRoomListByOrgId(orgInfo.orgId);
  }, [orgInfo]);

  useEffect(() => {
    const deal = async () => {
      let imageData = store.getState().board.captureThumbnail;
      if (imageData) {
        await BoardService.getInstance().updateWhiteboardThumbnailOutSide();
        store.dispatch(handleSetCaptureThumbnail(null));
        store.dispatch(handleSetCaptureThumbnailBoardName(null));
      }
    }
    deal();

  }, [])


  //切换org名称
  const switchOrg = (orgId, orgNameSwitch, role) => {
    OrgService.getInstance().loadOrganization(orgId, orgNameSwitch, role)
    history.push('/recent');
    handleClose();
  };

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };
  window.setMobileOpen = setMobileOpen;


  const handleCreateOrgListDOM = () => {
    return orgList.map(obj => (
      <MenuItem
        disableRipple
        id={obj.orgId}
        key={obj.orgId}
        onClick={switchOrg.bind(
          this,
          obj.orgId,
          obj.name,
          obj.role
        )}
      >
        {obj.name}
      </MenuItem>
    ));
  };

  const handleSwitchOrgMenu = () => {
    setSwitchOrgList(!switchOrgList);
  };

  const DrawerContent = (
    <Box
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        height: '100%',
        backgroundColor: '#F7FAFA',
        borderStyle: 'none'
      }}
    >
      <div style={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'flex-end',
        boxShadow: '0px 1px 12px rgba(68, 68, 103, 0.07)',
        marginBottom: '10px',
        minHeight: '60px',
        background: 'white'
      }}>
        <div>
          <Button
            aria-controls="demo-customized-menu"
            aria-expanded={open2 ? 'true' : undefined}
            aria-haspopup="true"
            disableElevation
            endIcon={<DashboardArrow />}
            id="demo-customized-button"
            onClick={handleClick}
            sx={{
              color: '#232930',
              width: 230,
              fontSize: '16px',
              backgroundColor: 'white',
              justifyContent: 'flex-start',
              paddingLeft: '18px',
              '&:hover': {
                backgroundColor: '#Efeff0'
              }
            }}
            variant="contained"
          >
            {orgName}
          </Button>
          <Menu
            MenuListProps={{
              'aria-labelledby': 'demo-customized-button'
            }}
            anchorEl={anchorEl}
            id="demo-customized-menu"
            onClose={handleClose}
            open={open2}
          >
            {roleForManage && (
              <MenuItem
                disableRipple
                onClick={handleClickOpenManageOrgMenu}
              >
                {t('pages.manageOrganization')}
              </MenuItem>
            )}

            {isOrgAdmin && <Divider sx={{ my: 0.5 }} />}

            {orgList.length > 1 && (
              <MenuItem
                id="switchOrgMenu"
                onClick={handleSwitchOrgMenu}
                onMouseEnter={() => setSwitchOrgList(true)}
                onMouseLeave={() => setSwitchOrgList(false)}
              >
                {t('pages.switchOrganization')}
                <ArrowRight />
              </MenuItem>
            )}

            <Popper
              anchorEl={document.getElementById('switchOrgMenu')}
              sx={{
                width: '180px',
                backgroundColor: '#FFFFFF',
                zIndex: 99999,
                borderRadius: '8px',
                boxShadow: 'rgb(0 0 0 / 8%) 0px 1px 3px 2px',
                maxHeight: '232px',
                overflow: 'auto',
                marginBottom: '-42px !important'
              }}
              placement="right-end"
              onMouseEnter={() => setSwitchOrgList(true)}
              onMouseLeave={() => setSwitchOrgList(false)}
              open={switchOrgList}
            >
              <MenuList>{handleCreateOrgListDOM()}</MenuList>
            </Popper>

            <MenuItem
              disableRipple
              onClick={() => {
                setOpenCreateOrg(true);
                handleClose();
              }}
            >
              {t('pages.createOrganization')}
            </MenuItem>
          </Menu>
          <LazyLoad once>
            <OrganizationCreateOrgModal
              handleClose={handleCloseCreateOrg}
              openCreateOrg={openCreateOrg}
              setOpenCreateOrg={setOpenCreateOrg}
            />
          </LazyLoad>
        </div>
      </div>
      <div style={{
        overflowY: 'auto',
        height: `calc(100% - ${50}px)`
      }}>
        <RoomList parentComponent={parentComponent} />
      </div>
    </Box>
  );

  return (
    <Box id="leftDrawer"
      sx={{
        display: {
          sm: 'block',
          xs: 'none',
          width: drawerWidth,
          borderStyle: 'none', 
          height: '100%'
        },
        flexShrink: 0,
      }}>
      <Drawer
        id="mobile"
        onClose={handleDrawerToggle}
        open={mobileOpen}
        sx={{
          display: { sm: 'none', xs: 'block' },
          '& .MuiDrawer-paper': {
            width: drawerWidth,
            borderStyle: 'none'
          }
        }}
        variant="temporary"
      >
        {DrawerContent}
      </Drawer>
      <Drawer
        id="laptop"
        open
        sx={{
          display: {
            sm: 'block',
            xs: 'none',
            '& .MuiDrawer-paper': {
              width: drawerWidth,
              borderStyle: 'none'
            }
          }
        }}
        variant="permanent"
      >
        {DrawerContent}
      </Drawer>
    </Box>
  );
}

export default memo(RoomLeftDrawer);