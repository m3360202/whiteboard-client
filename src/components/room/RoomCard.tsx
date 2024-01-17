
//** Import react
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useHistory } from 'react-router-dom';

//** Import Redux kit
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

import Link from '@mui/material/Link';

//** Import others
import _ from 'lodash';
import PropTypes from 'prop-types';

const PREFIX = 'RoomCard';

const classes = {
  border: `${PREFIX}-border`,
  name: `${PREFIX}-name`,
  num: `${PREFIX}-num`
};

const StyledLink = styled(Link)(({ theme }) => ({
  [`& .${classes.border}`]: {
    display: 'flex',
    flexDirection: 'column',
    padding: '16px 10px 16px 16px',
    minHeight: '75px',
    border: '#cccccc 1px solid'
  },

  [`& .${classes.name}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: '500',
    fontSize: '16px',
    lineHeight: '20px',
    color: '#000'
  },

  [`& .${classes.num}`]: {
    marginTop: '20px',
    fontSize: '12px',
    color: '#000'
  }
}));

export function RoomCard({ room }) {
  //use
  const history = useHistory();

  //search
  const keyword = useSelector((state: RootState) => state.boardList.keyword);
  //room
  const roomData = room;
  //boardList
  // const boardList = useSelector((state: RootState) => state.boardList.currentBoardList);
  //dom
  const url = `/room/${roomData.rid}`;
  const [num, setNum] = useState(0);

  return (
    <StyledLink
      // component={RouterLink}
      data-cy={roomData.name}
      onClick={() => { history.push(url); }}
      // to={url}
      underline="none"
    >
      <div className={classes.border}>
        <div className={classes.name}>{roomData.name}</div>
        <div className={classes.num}>{num} boards</div>
      </div>
    </StyledLink>
  );
}

RoomCard.propTypes = {
  room: PropTypes.object.isRequired,
};
