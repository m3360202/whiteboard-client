//** Import react
import React, { useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useCreatePrivateGroupMutation } from '../../redux/RoomAPISlice';
import { useCheckActionPermissionOfTeamMutation } from '../../redux/PermissionApiSlice';
//** Import Mui
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import Switch from '@mui/material/Switch';
import LoadingButton from '@mui/lab/LoadingButton';
import { Typography, Box } from '@mui/material';
import { Tooltip } from '@mui/material';
import CloseCeateRoomDialogIcon from '../../mui/icons/CloseCeateRoomDialogIcon';
import $ from 'jquery';
//** Imort components
import { KeyCode } from '../../board/canvas/initialize/initializeShortcut';


export default function CreateRoomModal() {
  //use

  const theme = useTheme();
  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  //basic state
  const [flag, setFlag] = useState(false);
  const [publicRoom, setPublicRoom] = useState(false);
  const [createRoomButtonLoading, setCreateRoomButtonLoading] = useState(false);

  //org
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const orgName = useSelector((state: RootState) => state.org.orgInfo.name);

  //dom
  const [open, setOpen] = React.useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));
  const createRoomBtn: any = useRef(null);
  const [handleCheckActionPermissionOfTeam]=useCheckActionPermissionOfTeamMutation();
  //这个的值是传递过来的，还没处理
  const [isTutorialShown, setIsTutorialShown] = React.useState(false);

  const [createPrivateGroup,{error, isError}] = useCreatePrivateGroupMutation();

  const handleOpen = () => {
    setOpen(true);
    setFlag(false);
  };
  const checkActionPermission = async(permissionName)=>{
    let data = {
      permissionName:permissionName,
      role:orgInfo.role
    }
    return await handleCheckActionPermissionOfTeam(data);
  }
  const handleClose = () => {
    setOpen(false);
    setCreateRoomButtonLoading(false);
  };
  const handlePublicRoom = () => {
    if (publicRoom) {
      setPublicRoom(false);
    } else {
      setPublicRoom(true);
    }
  };
  const handleCreateRoom = async () => {
    let roomName = $('#inputRoomName').val().toString().trim();
    if (roomName.length === 0) {
      Boardx.Util.Msg.info(
        t('pages.listPage.roomSettings.roomNameEmpty')
      );
      return;
    }
    setFlag(true);
    setCreateRoomButtonLoading(true);

    const createPrivateGroupResponse:any = await createPrivateGroup({
      name: roomName.trim(),
      members: [],
      readOnly: false,
      publicRoom: publicRoom,
      customFields: { orgId, orgName },
      extraData: {},
      orgId: orgId,
      user:store.getState().user.userInfo
    });
    console.log('createPrivateGroupResponse',createPrivateGroupResponse);
    history.push(createPrivateGroupResponse.data.roomUrl);
    // if (error) {
    //   Boardx.Util.Msg.warning(error.reason);
    //   return;
    // }

    handleClose();
    setFlag(true);
  };

  const handleCreateRoomClick = async () => {
    // let checkRoleOfManageTeam = await checkActionPermission('Create Room');
    // if(checkRoleOfManageTeam && !checkRoleOfManageTeam.data){
    //   Boardx.Util.Msg.info('You have no role to create a room');
    //   return ;
    // }
    await handleOpen();
    document.getElementById('inputRoomName').focus();
  };

  const handleInputRoomFocus = () => {
    const v = document.getElementById('inputRoomName') as HTMLInputElement;
    v.select();
  };

  const handleCreateRoomKeyDown = e => {
    if (e.keyCode === KeyCode.Enter) {
      return handleCreateRoom();
    }
  };

  const skipCloseTutorial = () => {
    setIsTutorialShown(false);
  };

  return (
    <Box
      sx={{
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between'
      }}
    >
      <span style={{ marginLeft: '24px',
    fontStyle: 'normal',
    fontWeight: 'bold',
    fontSize: '12px',
    fontFamily: 'Inter, sans-serif',
    color: 'rgba(35, 41, 48, 0.65)',
    lineHeight: '24px',
    userSelect: 'none'}}>
        {t('pages.listPage.newRoom')}
      </span>
      <Tooltip
        arrow
        placement="right"
        title={t('pages.listPage.createANewRoom')}
      >
        <svg
          // id={DashboardButtonId.CREATE_ROOM_ID}
          id="createRoomIcon"
          onClick={handleCreateRoomClick}
          ref={createRoomBtn}
          className="addRoom"
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          strokeWidth="1"
        >
          <g transform="matrix(1,0,0,1,0,0)">
            <title>add-square</title>
            <line className="a" x1="12" y1="7.5" x2="12" y2="16.5" />
            <line className="a" x1="7.5" y1="12" x2="16.5" y2="12" />
            <rect
              className="a"
              x="0.75"
              y="0.75"
              width="22.5"
              height="22.5"
              rx="3"
              ry="3"
            />
          </g>
        </svg>
      </Tooltip>

      <Dialog
        aria-labelledby="responsive-dialog-title"
        sx={{
          '& .MuiDialog-paper': {
            width: 424,
            height: 'auto',
            padding: '32px',
            backgroundColor: '#FFFFFF',
            boxShadow: '1px 2px 4px rgba(217, 161, 177, 0.54)'
          }
        }}
        fullScreen={fullScreen}
        fullWidth
        onClose={handleClose}
        open={open}
      >
        <DialogTitle
          sx={{
            fontSize: '28px',
            fontWeight: 500,
            lineHeight: '34px',
            padding: 0,
            marginBottom: '24px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            cursor: 'pointer'
          }}
          id="customized-dialog-title"
        >
          {t('pages.listPage.createRoom')}
          <CloseCeateRoomDialogIcon onClick={handleClose} />
        </DialogTitle>

        <DialogContent sx={{ overflow: 'hidden', p: 0 }}>
          <DialogContentText
            sx={{
              fontWeight: 400,
              fontSize: '16px',
              lineHeight: '24px',
              marginBottom: '8px'
            }}
          >
            <span>{t('pages.listPage.roomName')}</span>
          </DialogContentText>
          <TextField

            sx={{
              display: 'block',
              height: '40px',
              width: '100%',
              '& .MuiOutlinedInput-root': {
                height: '40px',
                borderRadius: '2px'
              }
            }}
            defaultValue=""
            id="inputRoomName"
            onFocus={handleInputRoomFocus}
            onKeyDown={handleCreateRoomKeyDown}
            fullWidth={true}
          />
          <Box sx={{ mt: '24px', display: 'flex', justifyContent: 'flex-end' }}>
            <LoadingButton
              sx={{ p: '8px' }}
              loading={createRoomButtonLoading}
              color="primary"
              onClick={handleCreateRoom}
              type="button"
              variant="contained"
              disabled={flag}
            >
              {t('pages.create')}
            </LoadingButton>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
}
