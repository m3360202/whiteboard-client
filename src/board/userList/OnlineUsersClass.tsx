import React from 'react';
import { styled } from '@mui/material/styles';
//** Import Redux toolkit
import store from '../../store';
import Cursor from '../../mui/icons/Cursor';
import { useSelector } from 'react-redux';
import   { useAppSelector, RootState } from '../../store';
const PREFIX = 'OnlineUsersClass';

const classes = {
  onlineUsers: `${PREFIX}-onlineUsers`,
  onlineUserName: `${PREFIX}-onlineUserName`,
  mouseLable: `${PREFIX}-mouseLable`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.onlineUsers}`]: {
    overflow: 'visible',
    position: 'absolute',
    left: -1000,
    top: -1000,
  },

  [`& .${classes.onlineUserName}`]: {
    position: 'absolute',
    top: '22px',
    fontSize: '14px',
    fontWeight: 500,
    padding: '3px 4px',
    color: '#FFF',
    width: 'auto',
    display: 'inline-block',
    whiteSpace: 'nowrap',
    borderRadius: '1px',
  },

  [`& .${classes.mouseLable}`]: {
    margin: 0,
    position: 'fixed',
  }
}));

export default function OnlineUsersClass() {

  const onlineUsers = useSelector((state:RootState) => state.user.onlineUsers);
  console.log('onlineUsers', onlineUsers);
  const onlineUsersListDOM = () =>
    onlineUsers?.map((r) => (
      <div key={r.userNo}>
        <div
          className={classes.mouseLable}
          id={r.userNo}
          // style={{ display: r.display }}
        >
          <Cursor htmlColor={r.color} />
          <div
            className={classes.onlineUserName}
            style={{ backgroundColor: r.color }}
          >
            {r.name}
          </div>
        </div>
      </div>
    ));

  return (
    <Root className={classes.onlineUsers} id="onlineUsers">
      {onlineUsersListDOM()}
    </Root>
  );
}
