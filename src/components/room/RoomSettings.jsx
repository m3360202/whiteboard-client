//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';
//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useSelector, useDispatch } from 'react-redux';
import {
  useRenameRoomMutation,
  useDeleteRoomMutation,
  useLoadRoomInfoQuery,
  useGetBoardListInTheRoomQuery
} from '../../redux/RoomAPISlice';

//** Import Mui
import Box from '@mui/material/Box';
import DialogActions from '@mui/material/DialogActions';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import DialogTitle from '@mui/material/DialogTitle';
import Typography from '@mui/material/Typography';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import Dialog from '@mui/material/Dialog';
import IconButton from '@mui/material/IconButton';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, Button, TextField } from '@mui/material';
import LoadingButton from '@mui/lab/LoadingButton';
import lightTheme from '../../mui/theme/lightTheme';
import SettingsOutlinedIcon from '../../mui/icons/SettingsOutlinedIcon';
import { useCheckActionPermissionOfRoomMutation } from '../../redux/PermissionApiSlice'
import BootstrapDialog, {
  BootstrapDialogTitle
} from '../../mui/components/BootstrapDialog';

//** Imort components
import RoomSettingsInviteUsers from './RoomSettingsInviteUsers';
import RoomSettingsMemberList from './RoomSettingsMemberList';
import RoomContextManagementPage from '../roomContextManagement/RoomContextManagementPage';

//** Import others
import { DashboardButtonId } from '../../constants/Tutorial';


export default function RoomSettings() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const history = useHistory();
  const rsBtn = useRef(null);
  const { t } = useTranslation();
  const roomId = useSelector((state) => state.room.roomId);
  const [roomData, setRoomData] = useState({});
  const [role,setRole] = useState(false);
  const [memberLists, setMemberLists] = useState([]);
  const [isRoomAdmin, setIsRoomAdmin] = useState(false);
  const user = useSelector((state) => state.user.userInfo);
  const [handleCheckActionPermissionOfRoom] = useCheckActionPermissionOfRoomMutation();
  //room
  const { data: loadedRoomInfo } = useLoadRoomInfoQuery(roomId);
   
  const checkActionPermission = async (permissionName) => {
    if(!loadedRoomInfo || !loadedRoomInfo.roomInfo) return;
    let data = {
      permissionName: permissionName,
      role: loadedRoomInfo.roomInfo.role 
    }
    return await handleCheckActionPermissionOfRoom(data);
  }
  useEffect(() => {
    if (loadedRoomInfo && user.userId) {
      setIsRoomAdmin(false);
      setRoomData(loadedRoomInfo.roomInfo);
      setMemberLists(loadedRoomInfo.memberList);
      if(loadedRoomInfo && loadedRoomInfo.memberList && loadedRoomInfo.memberList.length > 0){
        loadedRoomInfo.memberList.forEach((item) => {
          if(item._id === user.userId && item.role !== 'member'){
            setIsRoomAdmin(true);
          }
        })
      }
    }
  }, [loadedRoomInfo,user]);

  //boardList
  const { data: boardList = [] } = useGetBoardListInTheRoomQuery({
    startIndex: 0,
    limit: 100,
    searchKey: '',
    roomId: roomId,
  });
  //dom
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [roomName, setRoomName] = useState('');
  const [updateRoomNameButtonLoading, setUpdateRoomNameButtonLoading] = useState(false);

  const [renameRoom] = useRenameRoomMutation();
  const [deleteRoom] = useDeleteRoomMutation();

  const handleClickOpen = async() => {
    let checkRoleOfManageRoom = await checkActionPermission('Enter Room Dashboard');
    if (!isRoomAdmin) {
      Boardx.Util.Msg.info(
        t('pages.listPage.roomSettings.accessRoomSetting')
      );
      return;
    }
    setRoomName(roomData.name);
    setOpenDialog(true);
  };

  const handleDeleteOpen = async () => {
    let checkRoleOfManageRoom = await checkActionPermission('Delete Room');
    if (checkRoleOfManageRoom && !checkRoleOfManageRoom.data) {
      Boardx.Util.Msg.info(
        t('pages.listPage.roomSettings.deleteRoomRole')
      );
      return;
    }
    if (boardList && boardList.length > 0) {
      Boardx.Util.Msg.info(
        t('pages.listPage.roomSettings.deleteRoomNotEmpty')
      );
      return;
    }
    setDeleteOpen(true);
  };

  const handleDeleteClose = () => {
    setDeleteOpen(false);
  };

  const handleDeleteRoom = async () => {
    handleClose();
    await deleteRoom({ roomId: roomData.roomId });
    history.push('/recent');
    // Boardx.Util.Msg.info(error.message);
    Boardx.Util.Msg.info(t('pages.listPage.roomSettings.roomDeleted'));
  };

  const handleClose = () => {
    setOpenDialog(false);
  };
useEffect(()=>{
  const deal = async()=>{
  if(!loadedRoomInfo) return;
  let checkRoleOfManageRoom = await checkActionPermission('Edit Room');
  if(checkRoleOfManageRoom && checkRoleOfManageRoom.data){
    setRole(checkRoleOfManageRoom.data);
  }

  }
  deal();
},[loadedRoomInfo])
  const onSubmit = async (e) => {
    let checkRoleOfManageRoom = await checkActionPermission('Edit Room');
    if (checkRoleOfManageRoom && !checkRoleOfManageRoom.data) {
      Boardx.Util.Msg.info(t('pages.listPage.roomSettings.editRoomRole'));
      return;
    }
    const newName = roomName.trim();
    const roomDataName = !roomData ? '' : roomData.name;

    if (newName === roomDataName) return;

    if (newName === '') {
      Boardx.Util.Msg.info(
        t('pages.listPage.roomSettings.roomNameEmpty')
      );
      return;
    }
    setUpdateRoomNameButtonLoading(true);
    await renameRoom({ roomId: roomData.roomId, newRoomName: newName });
    setUpdateRoomNameButtonLoading(false);

  };

  const handleDeleteRoomButtonDOM = () => (
    <Button
      // className={classes.deleteRoomBtn}
      color={isRoomAdmin ? 'primary' : 'second'}
      onClick={handleDeleteOpen}
      size="small"
      sx={{
        p: 0,
        justifyContent: 'left',
        width: '98px',
        margin: '10px 0',
        fontSize: '16px',
        fontWeight: '500px'
      }}
      variant="text"
    >
      {t('pages.listPage.roomSettings.deleteRoom')}
    </Button>
  );

  return (
    <Box theme={lightTheme}>
      <div sx={{  [theme.breakpoints.up('sm')]: {
      float: 'left'}}}>

        <div style={{    padding: '0 5px',}}>
          <div id="id_roomSetting" ref={rsBtn}>
            {isRoomAdmin && (
              <IconButton
                color="primary"
                id="id_roomsetting"
                onClick={handleClickOpen}
                size="small"
                // variant="contained"
                sx={{ pt: '5px' }}
              >
                <SettingsOutlinedIcon />
              </IconButton>
            )}
          </div>

          <Dialog
            aria-labelledby="responsive-dialog-title"
            // classes={{
            //   container: classes.container,
            //   paper: classes.paperWidthSm
            // }}
            sx={{
              '& .MuiDialog-container': {
                height: '100%'
              },
              '& .MuiDialog-paper': {
                width: '980px',
                maxWidth: 'unset',
                paddingBottom: '33px'
              }
            }}
            fullScreen={fullScreen}
            onClose={handleClose}
            open={openDialog}
          >
            <BootstrapDialogTitle
              // className={classes.roomSettingsTitle}
              sx={{
                width: '196px',
                padding: '0',
                height: '34px',
                fontSize: '28px',
                fontWeight: 500,
                fontStyle: 'normal',
                lineHeight: '34px',
                margin: '35px 0px 20px 38px'
              }}
              id="responsive-dialog-title"
              onClose={handleClose}
            >
              {t('pages.listPage.inviteRoomSettings')}
            </BootstrapDialogTitle>

            <DialogContent
              // className={classes.roomSettingsContent}
              sx={{ width: '100%', height: '575px', padding: '0 29px 0 39px' }}
            >
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'flex-start'
                }}
              >
                <Box>
                  <DialogContentText
                    // className={classes.roomNameLabel}
                    sx={{ color: '#232930' }}
                    id="roomNameLabel"
                  >
                    {t('pages.listPage.roomSettings.roomName')}
                  </DialogContentText>
                </Box>
                <Box
                  sx={{
                    display: 'flex',
                    width: '100%',
                    mt: 1,
                    alignItems: 'center'
                  }}
                >
                  <TextField
                    // classes={{ root: classes.root }}
                    sx={{
                      flex: 1,
                      minWidth: '125px',
                      marginRight: '16px',
                      '& .MuiInputBase-fullWidth': {
                        height: '40px'
                      },
                      '& .MuiOutlinedInput-input': {
                        padding: '5px',
                        width: '100%',
                        height: '100%'
                      }
                    }}
                    fullWidth
                    id="roomName"
                    onChange={e => setRoomName(e.target.value)}
                    type="text"
                    value={roomName}
                  />

                  <LoadingButton
                    loading={updateRoomNameButtonLoading}
                    // className={classes.UpdateRoomNameBtn}
                    sx={{ boxSizing: 'border-box', marginRight: '455px' }}
                    color="primary"
                    onClick={onSubmit}
                    size="small"
                    variant="contained"
                  >
                    {t('pages.listPage.roomSettings.update')}
                  </LoadingButton>
                </Box>

                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <RoomContextManagementPage />

                  {isRoomAdmin ? (
                    <Box>
                      {handleDeleteRoomButtonDOM()}
                      <Dialog
                        aria-labelledby="responsive-dialog-title"
                        // classes={{ paperFullWidth: classes.paperFullWidth }}
                        sx={{
                          '& .MuiDialog-paperFullWidth': {
                            width: '350px',
                            height: '200px'
                          }
                        }}
                        fullScreen={fullScreen}
                        fullWidth
                        onClose={handleDeleteClose}
                        open={deleteOpen}
                      >
                        <DialogTitle id="deleteRoomTitle">
                          {t('pages.listPage.roomSettings.deleteRoom')}
                        </DialogTitle>
                        <DialogContent sx={{ overflow: 'hidden' }}>
                          <DialogContentText>
                            <span>
                              {t(
                                'pages.listPage.roomSettings.deleteRoomConfirm'
                              )}
                            </span>
                          </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                          <Button
                            color="primary"
                            onClick={handleDeleteRoom}
                            type="button"
                            variant="contained"
                          >
                            {t('pages.listPage.roomSettings.deleteRoom')}
                          </Button>
                          <Button
                            color="primary"
                            onClick={handleDeleteClose}
                            size="small"
                            variant="text"
                          >
                            {t('pages.cancel')}
                          </Button>
                        </DialogActions>
                      </Dialog>
                    </Box>
                  ) : (
                    <Box>{handleDeleteRoomButtonDOM()}</Box>
                  )}
                </Box>
              </Box>

              <Divider />

              <Box sx={{ flexGrow: 1 }}>
                <Box>
                  <Typography
                    // className={classes.inviteRoomMembersText}
                    sx={{
                      marginTop: '16px',
                      marginBottom: '4px',
                      fontSize: '20px'
                    }}
                    variant="h4"
                  >
                    {t('pages.listPage.inviteRoomMembers')}
                  </Typography>
                </Box>
                <Box>
                  <DialogContentText
                    // className={classes.roomLabel}
                    sx={{ fontSize: '14px', marginBottom: '8px' }}
                    id="roomLabel"
                  >
                    {memberLists?.length}{' '}
                    {memberLists?.length > 1
                      ? t('pages.listPage.inviteMembersCanAccess')
                      : t('pages.listPage.inviteMemberCanAccess')}
                  </DialogContentText>
                </Box>
              </Box>

              <RoomSettingsInviteUsers />
              <RoomSettingsMemberList />
            </DialogContent>
          </Dialog>
        </div>
      </div>
    </Box>
  );
}
