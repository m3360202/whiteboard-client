//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useSelector, useDispatch } from 'react-redux';
import store, { RootState } from '../../store';
import _ from 'lodash';
import {
  useInviteUserToRoomNotificationMutation,
  useAddUsersToRoomMutation,
  useSendInvitationEmailToRoomMutation
} from '../../redux/RoomAPISlice';
import { useCheckIfUserExistsByEmailMutation } from '../../redux/UserAPISlice';
import {
  useGetOrgMemberListQuery,
  useFindOrCreateInviteQuery
} from '../../redux/OrgAPISlice';

//** Import Mui
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Chip from '@mui/material/Chip';
import Popper from '@mui/material/Popper';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import { isEmail } from '../../util/isEmail';
import i18n from '../../i18n';

//** Import Services
import { ClipboardService } from '../../services';
import { useCheckActionPermissionOfRoomMutation } from '../../redux/PermissionApiSlice';
import $ from 'jquery';

const PREFIX = 'RoomSettingsInviteUsers';

const classes = {
  root: `${PREFIX}-root`,
  inviteUserInputBox: `${PREFIX}-inviteUserInputBox`,
  inviteInput: `${PREFIX}-inviteInput`,
  sizeMedium: `${PREFIX}-sizeMedium`,
  roomSettingsInviteBtn: `${PREFIX}-roomSettingsInviteBtn`,
  inviteUserToRoomListPopper: `${PREFIX}-inviteUserToRoomListPopper`,
  inviteUserToRoomList: `${PREFIX}-inviteUserToRoomList`
};

const Root = styled('div')(({ theme }) => ({
  [`&.${classes.root}`]: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  [`& .${classes.inviteUserInputBox}`]: {
    [theme.breakpoints.up('sm')]: {
      width: '590px'
    },
    height: 'auto',
    border: '1px solid rgba(0, 0, 0, 0.16)',
    borderRadius: '2px',
    display: 'flex',
    flexWrap: 'wrap'
  },

  [`& .${classes.inviteInput}`]: {
    // width: '42%',
    flex: 1,
    height: '48px',
    margin: 0,
    overflow: 'hidden',
    minWidth: '200px',
    '& .MuiInputBase-fullWidth': {
      width: '115%'
    },
    '& .MuiInputBase-input': {
      width: '100%',
      height: '48px',
      padding: '3px 3px 3px 12px',
      boxSizing: 'border-box'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0
    }
  },

  [`& .${classes.sizeMedium}`]: {
    margin: '6px 0px 0px 6px',
    backgroundColor: '#D3F4F4',
    cursor: 'pointer',
    '&:focus': {
      backgroundColor: '#2BA9A9'
    }
  },

  [`& .${classes.roomSettingsInviteBtn}`]: {
    left: '16px',
    fontSize: '16px',
    fontWeight: 500,
    height: '50px'
  },

  [`& .${classes.inviteUserToRoomListPopper}`]: {
    maxHeight: '200px',
    width: '400px',
    zIndex: 10000000000,
    background: '#eee',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#eee',
    boxShadow: ' 0px 1px 3px 2px #00000014',
    borderRadius: '8px',
    overflow: 'hidden'
  },

  [`& .${classes.inviteUserToRoomList}`]: {
    height: '200px',
    overflow: 'auto',
    position: 'relative'
  }
}));

export default function RoomSettingsInviteUsers() {
  //use
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [openState, setOpenState] = useState(false);
  const [potentialUsers, setPotentialUsers] = useState([]);
  const [inviteList, setInviteList] = useState([]);
  const [handleCheckActionPermissionOfRoom] =
    useCheckActionPermissionOfRoomMutation();
  //room
  const memberList = useSelector(
    (state) => state.room.roomMemberList
  );
  const roomData = useSelector((state) => state.room.roomInfo);
  console.log('roomData',roomData)
  //org
  const orgInfo = useSelector((state) => state.org.orgInfo);

  const [InviteUserToRoomNotification] =
    useInviteUserToRoomNotificationMutation();
  const [addUsersToRoom] = useAddUsersToRoomMutation();
  const [sendInvitationEmailToRoom] = useSendInvitationEmailToRoomMutation();
  const [checkIfUserExistsByEmail] = useCheckIfUserExistsByEmailMutation();
  const handleCheckIfUserExistsByEmail = async email => {
    return await checkIfUserExistsByEmail(email);
  };
  const { data: inviteInfo } = useFindOrCreateInviteQuery({
    userId: store.getState().user.userInfo.userId,
    invite: {
      rid: roomData.roomId,
      days: 0,
      maxUses: 0,
      inviteType: 'room'
    }
  });
  // Boardx.Util.Msg.warning(error.message);

  const { data: orgMemberList } = useGetOrgMemberListQuery({
    orgId: orgInfo.orgId
  });

  const handleDelete = user => {
    console.info('You clicked the delete icon.', user);
    setInviteList(_.without(inviteList, user));
  };

  const onFocus = () => {};

  const onBlur = () => {
    setTimeout(() => {
      setOpenState(false);
    }, 300);
  };

  const checkActionPermission = async permissionName => {
    let data = {
      permissionName: permissionName,
      role: roomData.role
    };
    return await handleCheckActionPermissionOfRoom(data);
  };

  const onInvitationClick = async () => {
    const copyText = `${inviteInfo.invitationLink}`;
    ClipboardService.getInstance().clipboardCopy(copyText);
    Boardx.Util.Msg.info(
      t('components.connectionNotification.youHaveCopiedInvitationLink')
    );
  };

  const handleClickInvite = async () => {

    inviteList.forEach(async (user, index) => {
      let isInviteList = memberList.find(member => {
        return member._id === user._id;
      });
      if (isInviteList) {
        Boardx.Util.Msg.info(
          `${isInviteList.name} ${t(
            'pages.listPage.roomSettings.isInviteUser'
          )}`
        );
        inviteList.splice(index, 1);
        return;
      }

      if (user.isNew) {
        // 新用户-判断用户邮件是否注册
        const result = await handleCheckIfUserExistsByEmail(user.name);
        // 已注册通过用户名邀请
        if (result.data && result.data._id) {
          const inviteData = {
            roomName: roomData.name,
            fromUserName: store.getState().user.userInfo.userName,
            toUserName: result.username,
            locationHref: location.href,
            language: i18n.language.slice(0, 2)
          };

          await addUsersToRoom({
            data: { users: [result.data.username], rid: roomData.roomId },
            inviteData: inviteData,
            invitedUsers: user,
            registeredUsersInfo: result
          });
        } else {
          // 未注册通过邮件邀请
          await sendInvitationEmailToRoom({
            roomName: roomData.name,
            currentUserName: store.getState().user.userInfo.userName,
            userName: user.username,
            invitationLink: inviteInfo.invitationLink
          });
        }
      } else {
        // 已注册用户-通过用户名邀请
        const inviteData = {
          roomName: roomData.name,
          fromUserName: store.getState().user.userInfo.userName,
          toUserName: user.username,
          locationHref: location.href,
          language: i18n.language.slice(0, 2)
        };

        await addUsersToRoom({
          data: { users: [user.username], rid: roomData.roomId },
          inviteData: inviteData,
          invitedUsers: user,
          registeredUsersInfo: user
        });
      }
    });

    if (inviteList.length <= 1) {
      Boardx.Util.Msg.info(
        `${inviteList[0].name} ${t(
          'pages.listPage.roomSettings.addedToRoom'
        )}`
      );
    } else {
      Boardx.Util.Msg.info(
        `${inviteList.length} ${t('pages.users')} ${t(
          'pages.memberHasBeenAddedtoRoom'
        )}`
      );
    }
    setInviteList([]);
  };

  const userNameChange = async e => {
    if (e.target.value.length < 3) {
      setOpenState(false);
      return;
    }
    const term = new RegExp(e.target.value, 'i');
    
    let newResult = orgMemberList.filter(item => {
        if (item.userId !== store.getState().user.userInfo.userId) {
          if (item.user[0] && item.user[0].name) {
            return (
              term.test(item.user[0].name) || term.test(item.user[0].username)
            );
          } else {
            return term.test(item.username) || term.test(item.name);
          }
        }
      })
      .slice(0, 10);
      console.log('newResult', newResult);
    let newPotentialUsers = [];

    newResult.map(item => {
      if (item.user[0] && item.user[0].name) {
        newPotentialUsers.push({
          name: item.user[0].name,
          _id: item.userId,
          username: item.username,
          status: item.user[0].status
        });
      } else {
        newPotentialUsers.push({
          name: item.username,
          _id: item.userId,
          username: item.username,
          status: 'offline'
        });
      }
    });

    setPotentialUsers(newPotentialUsers);
    setOpenState(true);
  };

  const keyPress = e => {
    if (e.keyCode === 188 || e.keyCode === 13) {
      e.preventDefault();
      const text = e.target.value;

      if (text === '') {
        Boardx.Util.Msg.warning(
          t('pages.listPage.roomSettings.pleaseEnterEmailAddress')
        );
        return;
      } else if (!isEmail(text)) {
        Boardx.Util.Msg.warning(t('pages.invalidEmail'));
        return;
      }
      if (memberList.find(member => member.username === text.split('@')[0])) {
        Boardx.Util.Msg.info(
          text + t('pages.listPage.roomSettings.isInviteUser')
        );
        return;
      }

      const newList = _.clone(inviteList);
      if (!newList.includes(text)) {
        newList.push({
          _id: text,
          username: text,
          name: text,
          isNew: true
        });
        setInviteList(newList);
        e.target.value = '';
      }
    } else if (e.keyCode === 8 && e.target.value === '') {
      const newList = _.clone(inviteList);
      newList.pop();
      setInviteList(newList);
    }
  };

  const inviteListDuplicateObj = arr => {
    let obj = {};
    arr = arr.reduce((newArr, next) => {
      obj[next._id] ? '' : (obj[next._id] = true && newArr.push(next));
      return newArr;
    }, []);
    return arr;
  };

  const inviteListChipDOM = () => {
    let inviteLists = inviteListDuplicateObj(inviteList);
    return inviteLists.map(user => (
      <Chip
        classes={{ sizeMedium: classes.sizeMedium }}
        key={user._id}
        label={user.name}
        onDelete={handleDelete.bind(this, user)}
      />
    ));
  };

  return (
    <Root className={classes.root}>
      <Box sx={{ flexGrow: 1 }}>
        <Box sx={{ display: 'flex', alignItems: 'flex-end', pr: '16px' }}>
          <Box className={classes.inviteUserInputBox}>
            {inviteListChipDOM()}
            <TextField
              autoComplete="off"
              autoFocus
              className={classes.inviteInput}
              fullWidth
              id="userName"
              margin="dense"
              onBlur={onBlur}
              onChange={userNameChange}
              onFocus={onFocus}
              onKeyDown={keyPress}
              placeholder={t(
                'pages.listPage.roomSettings.addRoomMembers'
              )}
              type="text"
            />
          </Box>

          <Button
            className={classes.roomSettingsInviteBtn}
            color="primary"
            onClick={handleClickInvite}
            size="small"
            variant="contained"
            disabled={inviteList.length > 0 ? false : true}
          >
            {t('pages.listPage.roomSettings.invite')}
          </Button>
        </Box>
        <Button
          color="primary"
          onClick={() => {
            onInvitationClick();
          }}
          sx={{ p: 0 }}
          variant="text"
        >
          {t('pages.listPage.inviteCopyInvitationLink')}
        </Button>
      </Box>

      <Popper
        anchorEl={document.getElementById('userName')}
        style={{maxHeight: '200px',
        width: '400px',
        zIndex: 10000000000,
        background: '#eee',
        borderStyle: 'solid',
        borderWidth: '1px',
        borderColor: '#eee',
        boxShadow: ' 0px 1px 3px 2px #00000014',
        borderRadius: '8px',
        overflow: 'hidden'}}
        open={openState}
        placement="bottom-start"
      >
        <PotentialNames
          className={classes.inviteUserToRoomList}
          inviteList={inviteList}
          potentialUsers={potentialUsers}
          setInviteList={setInviteList}
        />
      </Popper>
    </Root>
  );
}

function PotentialNames({
  potentialUsers,
  inviteList,
  setInviteList,
  openState
}) {

  const [checked, setChecked] = React.useState([1]);

  const handleToggle = value => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    setChecked(newChecked);
  };

  const onClick = (e, user) => {
    if (!inviteList.includes(e)) {
      inviteList.push(e);
      setInviteList(inviteList);
      $('#userName').val('');
    }
  };

  return (
    <List
      dense
      style={{ maxHeight: '200px', overflow: 'auto',display: 'flex',
      flexWrap: 'wrap' }}
    >
      {potentialUsers.map(user => {
    
        const labelId = `checkbox - list - secondary - label - ${user.username} `;
        return (
          <ListItem
            sx={{ cursor: 'pointer' }}
            key={user.username}
            onClick={onClick.bind(this, user)}
            // user={user.user[0]}
          >
            <ListItemAvatar>
              <Avatar
                alt={user.name && user.name.toUpperCase()}
                {...Boardx.Util.stringAvatar(user.name)}
                src={`${user.head_url?user.head_url:''} `}
                style={{ width: '24px', height: '24px' }}
              >
                {user.name && user.name.toUpperCase().charAt(0)}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              id={labelId}
              primary={`${user.name} (${user.username})`}
            />
          </ListItem>
        );
      })}
    </List>
  );
}
