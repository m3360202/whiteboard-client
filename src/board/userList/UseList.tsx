//** import react */
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { useAppSelector, RootState } from '../../store';
import { useSelector } from 'react-redux';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import { Box, Button, Tooltip } from '@mui/material';
import Popover from '@mui/material/Popover';
import { memo } from 'react';
const PREFIX = 'UserListMemo';

const classes = {
  root: `${PREFIX}-root`,
  avatar: `${PREFIX}-avatar`,
  avatarGroup: `${PREFIX}-avatarGroup`,
  userAvatar: `${PREFIX}-userAvatar`,
  paper: `${PREFIX}-paper`,
  padding: `${PREFIX}-padding`,
  circular: `${PREFIX}-circular`,
  icon: `${PREFIX}-icon`,
  onlineUsers: `${PREFIX}-onlineUsers`,
  onlineUserName: `${PREFIX}-onlineUserName`,
  mouseLable: `${PREFIX}-mouseLable`,
  moreStyle: `${PREFIX}-moreStyle`
};

const Root = styled('div')(({ theme }) => ({
  [`& .${classes.root}`]: {
    flexGrow: 1
  },

  [`& .${classes.avatar}`]: {
    width: '20px',
    height: '20px',
    fontSize: '14px',
    '&:last-child': {
      marginRight: 0
    }
  },

  [`& .${classes.avatarGroup}`]: {
    position: 'unset',
    paddingLeft: '4px',
    paddingRight: '4px',
    bottom: 7,
    left: 10
  },

  [`& .${classes.userAvatar}`]: {
    marginRight: 3,
    width: '20px',
    height: '20px',
    fontSize: '14px',
    marginLeft: 5
  },

  [`& .${classes.circular}`]: {
    width: '20px',
    height: '20px',
    fontSize: '14px',
    marginRight: '5px'
  },

  [`& .${classes.icon}`]: {
    width: 16,
    height: 16,
    position: 'absolute',
    right: 20
  },

  [`& .${classes.onlineUsers}`]: {
    overflow: 'visible',
    position: 'absolute',
    left: -1000,
    top: -1000
  },

  [`& .${classes.onlineUserName}`]: {
    position: 'absolute',
    top: '22px',
    fontSize: '14px',
    fontWeight: 600,
    padding: '3px 4px',
    color: '#FFF',
    width: 'auto',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    borderRadius: '1px'
  },

  [`& .${classes.mouseLable}`]: {
    margin: 0,
    position: 'fixed'
  },

  [`& .${classes.moreStyle}`]: {
    display: 'block',
    width: '27px',
    height: '26px',
    fontSize: 14,
    borderRadius: '50%',
    backgroundColor: '#ddd',
    lineHeight: '24px',
    textAlign: 'center',
    marginLeft: '0px',
    zIndex: 2
  }
}));

const StyledPopover = styled(Popover)(({ theme }) => ({
  [`& .${classes.paper}`]: {
    width: '200px',
    maxHeight: '172px',
    marginTop: '20px',
    marginLeft: '100px',
    boxShadow: '0px 1px 3px 2px rgba(222, 222, 222, 0.64)'
  },

  [`& .${classes.padding}`]: {
    padding: '8px 12px'
  },

  [`& .${classes.userAvatar}`]: {
    marginRight: 3,
    width: '20px',
    height: '20px',
    fontSize: '14px',
    marginLeft: 5
  }
}));

export default function UserList() {

  const MAX_MEMBER = 4;
  const boardId = useSelector((state: RootState) => state.board.board._id);
  const allOnlineUsers = useSelector((state: RootState) => state.user.onlineUsers || []);
 console.log('allOnlineUsers', allOnlineUsers)
  const onlineUsers = allOnlineUsers;
  const [moreUsers, setMoreUsers] = React.useState([]);
  let [others, setOthers] = React.useState([]);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  }
  const handleClose = () => setAnchorEl(null);
  const open = Boolean(anchorEl);
  const id = open ? 'user-popover' : undefined;
  let listHeight;
  let listOverflowY;

  function filterMoreUser(list) {
    let finallist = [];
    if(list && list.length >0){
      list.map((r) => {
        if (r.userId !== store.getState().user.userInfo.userId) {
          //判断当前finalList中是否已经存在该用户
          let flag = false;
          finallist.map((f) => {
            if (f.userId === r.userId) {
              flag = true;
            }
          });
          if (!flag)
          finallist.push(r);

        }
      });
    }
    return finallist;
  }

  useEffect(() => {
    if (!onlineUsers || onlineUsers.length <= 0) return;
    let others = filterMoreUser(onlineUsers);
    setOthers(others.slice(0, MAX_MEMBER));
    if (others.length > MAX_MEMBER) {
      setMoreUsers(others.slice(MAX_MEMBER));

    }
    else{
      setMoreUsers([]);
    }
    listHeight = moreUsers.length > 3 ? '157px' : 'auto';
    listOverflowY = moreUsers.length > 3 ? 'scroll' : 'hidden';

  }, [onlineUsers.length]);

  const OnlineUsersOwnerTooltipDOM = function () {
    if (onlineUsers && onlineUsers.length > 0) {
      return onlineUsers?.filter(
        r => r.userId === store.getState().user.userInfo.userId  && r.userNo === store.getState().user.userInfo.userNo
      ).map(r => {
          return (
            <Tooltip arrow key={r.userId} placement="top" title={r.name}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  key={r.name}
                  {...Boardx.Util.stringAvatar(r.name)}
                  alt={r.name && r.name.toUpperCase()}
                  className={classes.userAvatar}
                  src={r.avatar ? r.avatar : ""}
                  style={{
                    borderColor: r.color,
                    marginRight: '15px'
                  }}
                >
                  {r.name && r.name.toUpperCase().charAt(0)}

                </Avatar>
                {false && (
                  <img
                    src="/boardfiles/unmuted.png"
                    style={{
                      position: 'absolute',
                      right: -10,
                      bottom: -8,
                      width: 16,
                      height: 16
                    }}
                  />
                )}
                {false && (
                  <img
                    src="/boardfiles/muted.png"
                    style={{
                      position: 'absolute',
                      right: -10,
                      bottom: -8,
                      width: 16,
                      height: 16
                    }}
                  />
                )}
              </div>
            </Tooltip>
          );
        });
    } else {
      return null;
    }
  };

  function OnlineUsersMemberTooltipDOM({ others }) {
    if (others.length > 0) {
      return others
        .filter(r => r?.userId !== store.getState().user.userInfo.userId )
        .map(r => {
          return (
            <Tooltip arrow key={r.name} placement="top" title={r.name}>
              <div style={{ position: 'relative' }}>
                <Avatar
                  key={r.name}
                  {...Boardx.Util.stringAvatar(r.name)}
                  alt={r.name && r.name.toUpperCase()}
                  className={classes.userAvatar}
                  src={r.avatar ? r.avatar : ''}
                  style={{ borderColor: r.color }}
                >
                  {r.name && r.name.toUpperCase().charAt(0)}
                </Avatar>
                {/* {status === ConferenceStatus.ONMEETING &&
                participants.indexOf(r.userNo) >= 0 &&
                mutedParticipants.indexOf(r.userNo) == -1 && (
                  <img
                    src="/boardfiles/unmuted.png"
                    style={{
                      position: 'absolute',
                      right: 4,
                      bottom: -8,
                      width: 16,
                      height: 16
                    }}
                  />
                )}
              {status === ConferenceStatus.ONMEETING &&
                participants.indexOf(r.userNo) >= 0 &&
                mutedParticipants.indexOf(r.userNo) >= 0 && (
                  <img
                    src="/boardfiles/muted.png"
                    style={{
                      position: 'absolute',
                      right: 4,
                      bottom: -8,
                      width: 16,
                      height: 16
                    }}
                  />
                )} */}
              </div>
            </Tooltip>
          );
        });
    } else {
      return null;
    }
  };

  function OnlineMoreUsersDOM({ moreUsers }) {
    if (moreUsers.length <= 0) return null;
    return (
      <Box
        onClick={handleClick}
        className={classes.moreStyle}
        id="moreuserListbutton"
      >
        +{moreUsers.length}
      </Box>
    );
  };

  const onlineMoreUsersName = (name) => {
    if (name.length > 15) return name.substring(0, 15) + '...';
    return name;
  };

  // const onlineUsersListDOM = () =>
  //   onlineUsers.map((r) => (
  //     <div key={r.userNo}>
  //       <div
  //         className={classes.mouseLable}
  //         id={r.userId}
  //         style={{ display: r.display }}
  //       >
  //         <Cursor htmlColor={r.color} />
  //         <div
  //           className={classes.onlineUserName}
  //           style={{ backgroundColor: r.color }}
  //         >
  //           {r.name}
  //         </div>
  //       </div>
  //     </div>
  //   ));
 
  return (
    <Root>
      {(
        <AvatarGroup
          classes={{ root: classes.avatarGroup, avatar: classes.avatar }}
          max={8}
          id='avatarGroup'
        >
          <OnlineUsersOwnerTooltipDOM />
          <OnlineUsersMemberTooltipDOM others={others} />
          <OnlineMoreUsersDOM moreUsers={moreUsers} />
        </AvatarGroup>
      )}

      {/* <OnlineUsersClass onlineUsers={onlineUsers} /> */}

      <StyledPopover
        anchorEl={document.getElementById('avatarGroup')}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left'
        }}
        classes={{ paper: classes.paper }}
        id={id}
        onClose={handleClose}
        open={open}
      >
        <List style={{ height: listHeight, overflowY: listOverflowY }}>
          {moreUsers.map((r, index) => {
            return (
              <Tooltip arrow key={r.name} placement="top" title={r.name}>
                <ListItem classes={{ padding: classes.padding }} key={index}>

                  <Avatar
                    key={r.name}
                    {...Boardx.Util.stringAvatar(r.name)}
                    alt={r.name && r.name.toUpperCase()}
                    className={classes.userAvatar}
                    src={r.avatar ? r.avatar : ''}
                    style={{ borderColor: r.color, cursor: 'pointer' }}
                  >
                    {r.name && r.name.toUpperCase().charAt(0)}
                  </Avatar>


                  {onlineMoreUsersName(r.name)}
                  {/* {status === ConferenceStatus.ONMEETING &&
                  r.userNo == dominantSpeaker && (
                    <img
                      src="/boardfiles/speaking.png"
                      className={classes.icon}
                    />
                  )} */}
                  {/* {status === ConferenceStatus.ONMEETING &&
                  r.userNo != dominantSpeaker &&
                  participants.indexOf(r.userNo) >= 0 &&
                  mutedParticipants.indexOf(r.userNo) == -1 && (
                    <img
                      src="/boardfiles/unmuted.png"
                      className={classes.icon}
                    />
                  )} */}
                  {/* {status === ConferenceStatus.ONMEETING &&
                  r.userNo != dominantSpeaker &&
                  participants.indexOf(r.userNo) >= 0 &&
                  mutedParticipants.indexOf(r.userNo) >= 0 && (
                    <img src="/boardfiles/muted.png" className={classes.icon} />
                  )} */}
                </ListItem>
              </Tooltip>
            );
          })}
        </List>
      </StyledPopover>
    </Root>
  );
}