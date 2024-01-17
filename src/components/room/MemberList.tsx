//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import { useSelector, useDispatch } from 'react-redux';
import store, { RootState } from '../../store';

//** Import Mui
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import Box from '@mui/material/Box';
import { useTheme } from '@mui/material';
import useMediaQuery from '@mui/material/useMediaQuery';
import Tooltip from '@mui/material/Tooltip';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import RoomInviteMembersModal from './RoomInviteMembersModal';
import { useLoadRoomInfoQuery } from '../../redux/RoomAPISlice';

const PREFIX = 'MemberList';

const classes = {
  root: `${PREFIX}-root`,
  menuButton: `${PREFIX}-menuButton`,
  title: `${PREFIX}-title`,
  avatar: `${PREFIX}-avatar`,
  format: `${PREFIX}-format`,
  moreUsersMenuItem: `${PREFIX}-moreUsersMenuItem`,
  moreUsersName: `${PREFIX}-moreUsersName`,
  moreUsersAvatar: `${PREFIX}-moreUsersAvatar`
};

const StyledBox = styled(Box)(({ theme }) => ({
  [`& .${classes.root}`]: {
    flexGrow: 1
  },

  [`& .${classes.menuButton}`]: {
    marginRight: theme.spacing(2)
  },

  [`& .${classes.title}`]: {
    flexGrow: 1
  },

  [`& .${classes.avatar}`]: {
    width: '28px',
    height: '28px',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center',
  },

  [`& .${classes.format}`]: {
    marginRight: 16,
    marginTop: 0,
    float: 'none',
    [theme.breakpoints.down('xl')]: {
      marginRight: 2,
      marginTop: 8,
      float: 'left'
    }
  },

  [`& .${classes.moreUsersAvatar}`]: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    width: '28px !important',
    height: '28px !important',
    fontSize: 16,
    borderRadius: '50%',
    backgroundColor: '#ddd',
    lineHeight: '28px',
    textAlign: 'center',
    marginLeft: '-8px',
    cursor: 'pointer',
    zIndex: 2,
    transition: 'all .2s',
    '&:hover': {
      backgroundColor: '#c6c6c6'
    }
  }
}));

const StyledMenu = styled(Menu)(({ theme }) => ({
  [`& .${classes.moreUsersMenuItem}`]: {
    cursor: 'default',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  [`& .${classes.avatar}`]: {
    width: '28px',
    height: '28px',
    fontSize: 16,
    display: 'flex',
    alignItems: 'center'
  },

  [`& .${classes.moreUsersName}`]: {
    flex: 1,
    marginLeft: '8px'
  }
}));

export default function MemberList({ roomData }) {
  //use
  const dispatch = useDispatch();
  const [moreUsers, setMoreUsers] = useState([]);
  const ITEM_HEIGHT = 40;

  const theme = useTheme();
  const [anchorEl, setAnchorEl] = useState(null);
  const smallScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const roomId = useSelector((state: RootState) => state.room.roomId);
  //user
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [memberList, setMemberList] = useState([]);
  //room
  let { data: loadedRoomInfo } = useLoadRoomInfoQuery(roomId);
  const settings = useSelector((state: RootState) => state.system.settings)?.uploadSettings;
  const [showAddMember, setShowAddMember] = useState(false);

  const open = Boolean(anchorEl);

  useEffect(() => {
    setMoreUsers([]);
    setShowAddMember(false);
    let newMemberList = loadedRoomInfo?.memberList || [];
    setMemberList(newMemberList);

    if (newMemberList?.length > 5) {
      setMoreUsers(newMemberList.slice(4));
      setMemberList(newMemberList.slice(0, 4));
    }
    if (loadedRoomInfo && userInfo.userId) {
      if(loadedRoomInfo && loadedRoomInfo.memberList && loadedRoomInfo.memberList.length > 0){
        loadedRoomInfo.memberList.forEach((item) => {
          if(item._id === userInfo.userId && item.role !== 'member'){
            setShowAddMember(true);
          }
        })
      }
    }
  }, [loadedRoomInfo,userInfo]);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <StyledBox sx={{ display: 'flex' }}>
      <AvatarGroup
        classes={{ avatar: classes.avatar }}
        max={smallScreen ? 3 : 5}
        spacing="medium"
        sx={{alignItems: 'center'}}
      >
        {memberList && memberList.length > 1
          ? memberList.map(user => (
              <Tooltip arrow title={user.name} key={user._id}>
                <Avatar
                  {...Boardx.Util.stringAvatar(
                    user.name?.toUpperCase()
                  )}
                  alt={user.name}
                  aria-label="user"
                  key={user.username}
                  src={
                    user._id === store.getState().user.userInfo.userId
                      ? userInfo.avatar
                      : user.head_url
                      ? user.head_url
                      : null
                  }
                >
                  {user.name?.toUpperCase().charAt(0)}
                </Avatar>
              </Tooltip>
            ))
          : null}
        {moreUsers.length > 0 ? (
          <div className={classes.moreUsersAvatar} onClick={handleClick}>
            +{moreUsers.length}
          </div>
        ) : null}
      </AvatarGroup>

      <StyledMenu
        PaperProps={{
          style: {
            maxHeight: ITEM_HEIGHT * 5 + 8,
            width: '20ch',
            overflow: 'auto'
          }
        }}
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'right'
        }}
        disableAutoFocusItem={true}
        onClose={handleClose}
        open={open}
        id='111'
      >
        {moreUsers.map((user, index) => {
          return (
            <MenuItem
              className={classes.moreUsersMenuItem}
              disableRipple
              id={user.username}
              key={user.username}
            >
              <Avatar
                {...Boardx.Util.stringAvatar(
                  user.name?.toUpperCase()
                )}
                aria-label="user"
                className={classes.avatar}
                key={user.username}
                src={user.head_url ? user.head_url : ''}
              >
                {user.name?.toUpperCase().charAt(0)}
              </Avatar>
              <div className={classes.moreUsersName}>{user.name}</div>
            </MenuItem>
          );
        })}
      </StyledMenu>
      {showAddMember ? <RoomInviteMembersModal /> : null}
    </StyledBox>
  );
}
