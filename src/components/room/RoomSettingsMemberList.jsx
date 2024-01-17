//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useSelector, useDispatch } from 'react-redux';
import store, { RootState } from '../../store';
import {
  handleSetRoomMemberRole,
  handleDelMemberFromList
} from '../../store/room';
import {
  useAddRoomModeratorMutation,
  useRemoveRoomModeratorMutation,
  useRemoveUserFromRoomMutation
} from '../../redux/RoomAPISlice';
import { useCheckActionPermissionOfRoomMutation } from '../../redux/PermissionApiSlice';
import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ListItemText from '@mui/material/ListItemText';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import { ThemeProvider } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import lightTheme from '../../mui/theme/lightTheme';
import {useLoadRoomInfoQuery} from '../../redux/RoomAPISlice';

const PREFIX = 'RoomSettingsMemberList';

const classes = {
  dataGridBox: `${PREFIX}-dataGridBox`,
  userNameAvatar: `${PREFIX}-userNameAvatar`,
  userNameText: `${PREFIX}-userNameText`,
  root: `${PREFIX}-root`,
  columnHeader: `${PREFIX}-columnHeader`,
  columnHeaderTitleContainer: `${PREFIX}-columnHeaderTitleContainer`,
  cell: `${PREFIX}-cell`
};

const StyledThemeProvider = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.dataGridBox}`]: {
    width: '100%',
    overflow: 'hidden'
  },

  [`& .${classes.userNameAvatar}`]: {
    width: '40px',
    height: '40px',
    float: 'left',
    marginTop: 12
  },

  [`& .${classes.userNameText}`]: {
    marginLeft: 54,
    lineHeight: '64px'
  },

  [`& .${classes.root}`]: {
    border: 0,
    height: '267px'
  },

  [`& .${classes.columnHeader}`]: {
    padding: '0 !important',
    border: '0 !important',
    outline: 'none !important'
  },

  [`& .${classes.columnHeaderTitleContainer}`]: {
    padding: '0 !important'
  },

  [`& .${classes.cell}`]: {
    padding: '0 !important',
    outline: 'none !important'
  }
}));

export default function RoomSettingsMemberList() {
  //use
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [anchorElMemberList, setAnchorElMemberList] = useState(null);
  const [currentUser, setCurrentUser] = useState({});
  const [handleCheckActionPermissionOfRoom] = useCheckActionPermissionOfRoomMutation();
  const [
    addRoomModerator,
    {
      isLoading: addRoomModeratorLoading,
      isError: addRoomModeratorError,
      isSuccess: addRoomModeratorSuccess
    }
  ] = useAddRoomModeratorMutation();
  const [
    removeRoomModerator,
    {
      isLoading: removeRoomModeratorLoading,
      isError: removeRoomModeratorError,
      isSuccess: removeRoomModeratorSuccess
    }
  ] = useRemoveRoomModeratorMutation();
  const [
    removeUserFromRoom,
    {
      isLoading: removeUserFromRoomLoading,
      isError: removeUserFromRoomError,
      isSuccess: removeUserFromRoomSuccess
    }
  ] = useRemoveUserFromRoomMutation();

  //user
  const userInfo = useSelector((state) => state.user.userInfo);

  //room
  const [roomData, setRoomData] = useState({});
  const roomInfo = useSelector((state) => state.room.roomInfo);
  const roomId = useSelector((state) => state.room.roomId);
 
  const [memberList, setMemberList] = useState([]);
  const [currentUserInRoomRole, setCurrentUserInRoomRole] = useState([]);
  //room
  let { data: loadedRoomInfo } = useLoadRoomInfoQuery(roomId);

  const checkActionPermission = async (permissionName) => {
    if(!roomInfo) return;
    let data = {
      permissionName: permissionName,
      role: roomInfo.role
    }
    return await handleCheckActionPermissionOfRoom(data);
  }
  useEffect(() => {
    if (loadedRoomInfo) {
      setRoomData(loadedRoomInfo.roomInfo);
  
      setCurrentUserInRoomRole( memberList.find(
        item => item._id === store.getState().user.userInfo.userId
      ));
      const roomMembers = loadedRoomInfo.memberList?loadedRoomInfo.memberList:[];
      const roomMemberList = roomMembers.filter(u=>u.username && u.username.indexOf('_vistor') === -1);

      setMemberList(roomMemberList);
    }
  }, [loadedRoomInfo]);


  //current signIn user role


  const roomMembersListNameCell = params => {
    const user = params.row;
    let imgSrc =
      user._id === store.getState().user.userInfo.userId
        ? userInfo.avatar
        : '';

    return (
      <div>
        <Avatar
          alt={user.name && user.name.toUpperCase()}
          {...Boardx.Util.stringAvatar(user.name)}
          className={classes.userNameAvatar}
          src={imgSrc}
        />
        <div className={classes.userNameText}>{user.name}</div>
      </div>
    );
  };

  const roomMembersListRoleCell = params => {
    const user = params.row;
    if (user.role === 'owner') {
      return <p>{t('pages.listPage.roomMembers.owner')}</p>;
    }
    if (user.role === 'member') {
      return <p>{t('pages.listPage.roomMembers.member')}</p>;
    }
    return <p>{t('pages.listPage.roomMembers.administrator')}</p>;
  };

  const roomMembersListMenuCell = params => {
    const user = params.row;

    const onDelete = room => {
      handleClose();

      if (currentUser.role === 'owner') {
        Boardx.Util.Msg.warning(
          `${currentUser.name} ${t('pages.ownerNotRemovableRoom')}`
        );
      } else if (
        currentUser.role === 'administrator' &&
        currentUserInRoomRole.role === 'administrator'
      ) {
        Boardx.Util.Msg.info(t('pages.adminRemoveUser'));
      } else {
        handleDelete(currentUser.username, room, currentUser.name);
      }
    };

    const handleDelete = async (username, roomData, name) => {
      let checkRoleOfManageRoom = await checkActionPermission('Edit Room');
      if (checkRoleOfManageRoom && !checkRoleOfManageRoom.data) {
        Boardx.Util.Msg.info(
          t('pages.listPage.roomSettings.deleteMemberFromRoom')
        );
        return;
      }
      await removeUserFromRoom({
        roomId: roomData.roomId,
        currentUserName: username,
        currentUser: currentUser
      });

      // if (error) {
      //   Boardx.Util.Msg.warning(error.message);
      //   return;
      // }
      // Boardx.Util.Msg.info(
      //   `${name} ${t('pages.listPage.roomMembers.removedFromRoom')}`
      // );
    };

    const onSetModerator = async roomData => {
      handleClose();
      await addRoomModerator({
        roomId: roomData.roomId,
        currentUserId: currentUser._id
      });

      // if (error) {
      //   Boardx.Util.Msg.warning(error.message);
      //   return;
      // } else {
      //   Boardx.Util.Msg.info(
      //     `${currentUser.name} ${t(
      //       'pages.listPage.roomMembers.setasModerator'
      //     )}`
      //   );
      // }
    };

    const onSetUser = async(roomData) => {
      handleClose();
      let checkRoleOfManageRoom = await checkActionPermission('Edit Room');
      if (checkRoleOfManageRoom && !checkRoleOfManageRoom.data) {
        Boardx.Util.Msg.info(t('pages.listPage.roomSettings.noRoleEdit'));
        return;
      }
      if (
        currentUser.role === 'administrator' &&
        currentUserInRoomRole.role === 'administrator'
      ) {
        Boardx.Util.Msg.info(t('pages.adminOperateInfo'));
        return;
      }

      await removeRoomModerator({
        roomId: roomData.roomId,
        userId: currentUser._id
      });
      // if (error) {
      //   Boardx.Util.Msg.warning(error.message);
      //   return;
      // } else {
      //   Boardx.Util.Msg.info(
      //     `${currentUser.name} ${t(
      //       'pages.listPage.roomMembers.setasUser'
      //     )}`
      //   );
      // }
    };

    const handleClose = () => {
      setAnchorElMemberList(null);
    };

    const handleMenuClick = event => {
      const { api } = params;
      const fields = api
        .getAllColumns()
        .map(c => c.field)
        .filter(c => c !== '__check__' && !!c);
      const thisRow = params.row;
      setCurrentUser(thisRow);
      setAnchorElMemberList(event.currentTarget);
    };

    return (
      <div>
        <IconButton
          color="primary"
          component="span"
          onClick={handleMenuClick}
          size="large"
        >
          <MoreHorizOutlinedIcon style={{ color: '#757575' }} />
        </IconButton>
        <Menu
          anchorEl={anchorElMemberList}
          className="abccc"
          id={user.username}
          keepMounted
          onClose={handleClose}
          open={
            Boolean(anchorElMemberList) &&
            currentUser.username === user.username
          }
        >
          <MenuItem
            onClick={onSetModerator.bind(this, roomData)}
            style={{
              display: currentUser.role === 'member' ? 'block' : 'none'
            }}
          >
            <ListItemText
              primary={t('pages.listPage.roomMembers.setasModerator')}
            />
          </MenuItem>
          <MenuItem
            onClick={onSetUser.bind(this, roomData)}
            style={{
              display: currentUser.role === 'administrator' ? 'block' : 'none'
            }}
          >
            <ListItemText
              primary={t('pages.listPage.roomMembers.setasUser')}
            />
          </MenuItem>
          <MenuItem onClick={onDelete.bind(this, roomData)}>
            <ListItemText
              primary={t('pages.listPage.roomMembers.remove')}
            />
          </MenuItem>
        </Menu>
      </div>
    );
  };

  const columns = [
    {
      field: 'name',
      headerName: t('pages.listPage.roomMembers.name'),
      width: 450,
      renderCell: params => roomMembersListNameCell(params)
    },
    {
      field: 'role',
      headerName: t('pages.listPage.roomMembers.role'),
      width: 300,
      renderCell: params => roomMembersListRoleCell(params),
      sortComparator: (v1, v2) => v1.charCodeAt(4) - v2.charCodeAt(4)
    },
    {
      field: ' ',
      headerName: ' ',
      width: 110,
      sortable: false,
      disableClickEventBubbling: true,
      renderCell: params => roomMembersListMenuCell(params)
    }
  ];

  return (
    <StyledThemeProvider theme={lightTheme}>
      <CssBaseline />
      <div className={classes.dataGridBox}>
        <DataGrid
          autoHeight={true}
          classes={{
            root: classes.root,
            cell: classes.cell,
            columnHeader: classes.columnHeader,
            columnHeaderTitleContainer: classes.columnHeaderTitleContainer
          }}
          columns={columns}
          disableColumnMenu={true}
          disableSelectionOnClick
          // hideFooter={true}
          pageSize={25}
          rowHeight={64}
          rows={memberList}
          rowsPerPageOptions={[10]}
          showColumnRightBorder={true}
          sortingOrder={['desc', 'asc']}
        />
      </div>
    </StyledThemeProvider>
  );
}
