//** Import react
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import PropTypes from 'prop-types';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useRestoreDeletedBoardMutation,
  useDuplicateBoardMutation,
  useFavoriteBoardMutation
} from '../../redux/BoardAPISlice';
import { handleOpenChatUI } from '../../store/sideBar';

//** Import i18n
import { useTranslation } from 'react-i18next';
import i18n from 'i18next';

import Card from '@mui/material/Card';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Avatar from '@mui/material/Avatar';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import Link from '@mui/material/Link';
import SettingsBackupRestoreIcon from '@mui/icons-material/SettingsBackupRestore';
import Typography from '@mui/material/Typography';
import ListItemText from '@mui/material/ListItemText';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

//** Import components
import BoardRenameModal from './BoardRenameModal';
import BoardMoveModal from './BoardMoveModal';
import BoardDeleteBoardModal from './BoardDeleteBoardModal';
import BoardThumbnailUpload from './BoardThumbnailUpload';
import BoardAddDescription from './BoardAddDescription';
import BoardSetCategory from './BoardSetCategory';

//** Import Other
import _ from 'lodash';
import { useGetBoardListInTheRoomQuery, useLoadRoomInfoQuery } from '../../redux/RoomAPISlice';

const PREFIX = 'Board';

const classes = {
  root: `${PREFIX}-root`,
  cardHeaderRoot: `${PREFIX}-cardHeaderRoot`,
  menu: `${PREFIX}-menu`,
  restoreText: `${PREFIX}-restoreText`,
  starred: `${PREFIX}-starred`,
  starred2: `${PREFIX}-starred2`,
  starred3: `${PREFIX}-starred3`,
  media: `${PREFIX}-media`,
  avatar: `${PREFIX}-avatar`,
  title: `${PREFIX}-title`,
  noMargin: `${PREFIX}-noMargin`
};

const StyledCard = styled(Card)((
  {
    theme
  }
) => ({
  [`&.${classes.root}`]: {
    width: '100%',
    display: 'block',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: 'none',
    borderWidth: '0px',
    position: 'relative',
  },

  [`& .${classes.cardHeaderRoot}`]: {
    paddingTop: 8,
    paddingLeft: 0,
    paddingBottom: 0,
    paddingRight: 0,
  },

  [`& .${classes.menu}`]: {
    position: 'absolute',
    top: 0,
    right: 0,
    cursor: 'pointer',
    color: '#F0F0F3',
    transition: 'all .3s ease-in-out',
    margin: '4px 4px 0 4px',
  },

  [`& .${classes.restoreText}`]: {
    position: 'absolute',
    top: 8,
    right: 12,
    cursor: 'pointer',
    color: '#F0F0F3',
    transition: 'all .3s ease-in-out',
  },

  [`& .${classes.starred}`]: {
    position: 'absolute',
    top: 4,
    right: 30,
    cursor: 'pointer',
    background: 'transparent',
    borderWidth: '0px',
    float: 'right',
    fontSize: 20,
    marginTop: 2,
    transition: 'all .3s ease-in-out',
    '&:hover': {
      borderWidth: '0px',
    },
    '&:focus': {
      borderWidth: '0px',
    },
  },

  [`& .${classes.starred2}`]: {
    position: 'absolute',
    top: 4,
    right: 30,
    cursor: 'pointer',
    background: 'transparent',
    borderWidth: '0px',
    float: 'right',
    fontSize: 20,
    marginTop: 2,
    transition: 'all .3s ease-in-out',
    '&:hover': {
      borderWidth: '0px',
    },
    '&:focus': {
      borderWidth: '0px',
    },
  },

  [`& .${classes.starred3}`]: {
    position: 'absolute',
    top: 10,
    right: 75,
    cursor: 'pointer',
    background: 'transparent',
    color: '#F0F0F3',
    borderWidth: '0px',
    float: 'right',
    fontSize: 21,
    transition: 'all .3s ease-in-out',
    '&:hover': {
      borderWidth: '0px',
    },
    '&:focus': {
      borderWidth: '0px',
    },
  },

  [`& .${classes.media}`]: {
    width: '99%',
    overflow: 'hidden',
    //height: '80%',
    minHeight: '200px',
    background: '#F0F0F3',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    cursor: 'pointer',
    borderRadius: 8,
    border: '1px solid #00000029',
  },

  [`& .${classes.avatar}`]: {
    display: 'none',
  },

  [`& .${classes.title}`]: {
    fontWeight: 600,
    paddingRight: 0,
    paddingTop: 0,
    color: '#232930',
  },

  [`& .${classes.noMargin}`]: {
    marginRight: 0,
    order: 1,
  }
}));

export function Board(props) {
  //use
  const dispatch = useDispatch();
  const history = useHistory();

  const { t } = useTranslation();
  //props
  const { board, isAll, type } = props;
  const { _id, roomId: boardRoomId } = board;
  const roomId = useSelector((state) => state.room.roomId);
  const orgInfo = useSelector((state) => state.org.orgInfo);

  //board
  const { data: boardList = [] } = useGetBoardListInTheRoomQuery({
    startIndex: 0,
    limit: 100,
    searchKey: '',
    roomId,
  });
 
  const {data: loadedRoomInfo} = useLoadRoomInfoQuery(roomId);

  const [roomInfo, setRoomInfo] = useState(null);
  const [currentRoomMemberList, setCurrentRoomMemberList] = useState(null);

  const deletedBoardList = useSelector(
    state => state.boardList.pendingDeleteBoardList
  );

  const [favoriteBoard] = useFavoriteBoardMutation();
  
 useEffect(() => {
    if (!loadedRoomInfo || !loadedRoomInfo.roomInfo ) return;
    setRoomInfo(loadedRoomInfo.roomInfo);
    setCurrentRoomMemberList(loadedRoomInfo.memberList);
  }, [loadedRoomInfo]);

  //dom
  const [isOpenMenu, setIsOpenMenu] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [displayTopBar, setDisplayTopBar] = useState(false);
  const [recentRoomMemberList, setRecentRoomMemberList] = useState([]);

  const [restoreDeletedBoard] = useRestoreDeletedBoardMutation();
  const [duplicateBoardMutation] = useDuplicateBoardMutation();

  //判断用户是否可以修改board
  // 1、自己创建的board-----可以修改
  // 2、react、room----- owner、admin可以修改全部board，member只能修改自己创建的board
  const getUserIsRevisionBoard = () => {
    if (board.createdBy === store.getState().user.userInfo.userId) {
      return true;
    }
    if (location.pathname === '/recent') {
      if (board.roomId !== 'none') {
        const currentUserRoomRole = recentRoomMemberList.filter((member) => {
          return member._id === store.getState().user.userInfo.userId;
        })
        if (currentUserRoomRole[0].role === 'member' && board.createdBy !== store.getState().user.userInfo.userId) {
          return false;
        }
        return true;
      }
    } else {
      const currentUserRoomRole = currentRoomMemberList.filter((member) => {
        return member._id === store.getState().user.userInfo.userId;
      })
      if (currentUserRoomRole[0].role === 'member' && board.createdBy !== store.getState().user.userInfo.userId) {
        return false;
      }
      return true;
    }
  }

  const handleClick = (event) => {
    setIsOpenMenu(true);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setIsOpenMenu(false);
    setAnchorEl(null);
  };

  //收藏白板
  const handleFavoriteBoard = async (e, boardId, favorite) => {
    if (e.type === 'click') {
      await favoriteBoard({
        boardId: boardId,
        favorite: favorite,
        boardList: boardList
      });
      // if (err) return Boardx.Util.Msg.info(err.message);
    }
  }

  //复制白板
  const duplicateBoard = async () => {
    Boardx.Util.Msg.info(t('pages.autoPageUpdateInfo.duplicateBoard'), {
      timeout: 10000,
    });
    handleClose();

    await duplicateBoardMutation({ boardId: board._id });

    Boardx.Util.Msg.info(
      t('pages.autoPageUpdateInfo.duplicateBoardSucceed')
    );

  };

  const handleDuplicateBoard = () => {
    duplicateBoard()
    handleClose();
  }

  window.oncontextmenu = () => { };

  const handelOpenInNewTab = (url) => {
    let pageFrom =
      location.pathname.indexOf('recent') > -1
        ? 'recent'
        : location.pathname.indexOf('teamsetting') > -1
        ? 'teamsetting'
        : 'room';
    localStorage.setItem('pageFrom', pageFrom);
    window.open(url);
    handleClose();
  };

  const fetchLastUpdateTime = (lastUpdateTime) => {
    const pdate = new Date(lastUpdateTime || board.lastUpdateTime);
    const dd = String(pdate.getDate()).padStart(2, '0');
    const mm = String(pdate.getMonth() + 1).padStart(2, '0');

    return `${mm}/${dd}`;
  };

  const fetchLastUpdateInfo = (board) => {
    let userName = '';
    if (board.lastUpdateByName) {
      if (board.lastUpdateByName.length >= 13) {
        userName = `${board.lastUpdateByName.substring(0, 9)}...`;
      } else {
        userName = board.lastUpdateByName;
      }
    } else {
      if (store.getState().user.userInfo&& store.getState().user.userInfo.userName){
        userName = store.getState().user.userInfo.userName;
      }

    }

    return i18n.language === 'zh-CN'
      ? `${userName} ${t(
          'components.board.lastSeen'
        )}${fetchLastUpdateTime(board.lastUpdateTime)}`
      : ` ${t('components.board.lastSeen')} ${fetchLastUpdateTime(
          board.lastUpdateTime
        )} ${userName}`;
  };

  const fetchRoomNameinRecentBoard = (board) => {
    let { roomName } = board;
    let roomNameReset;
    if (roomName && roomName.length > 0) {
      if (roomName.length <= 13) {
        roomNameReset = `${roomName} ·`;
      } else {
        roomNameReset = `${roomName.substring(0, 9)}... ·`;
      }
    } else {
      roomNameReset = '';
    }

    return roomNameReset;
  };

  const mediaDisplay = () => {
    if (board.thumbnail2) {
      return <CardMedia className={classes.media} image={board.thumbnail2} />;
    }
    if (board.thumbnail) {
      return <CardMedia className={classes.media} image={board.thumbnail} />;
    }
    return (
      <CardMedia
        className={`${classes.media} logo2`}
        image="/images/boardbg.png"
      />
    );
  };

  const handleOnMouseLeave = (e) => {
    e.currentTarget.lastElementChild.lastElementChild.lastElementChild.style.color =
      '#F21D6B';
    e.currentTarget.lastElementChild.lastElementChild.firstElementChild.style.color =
      '#F21D6B';
    e.currentTarget.lastElementChild
      .getElementsByClassName('MuiCardHeader-content')
      .item(0).lastElementChild.lastElementChild.style.color =
      'rgba(35, 41, 48, 0.48)';
    setDisplayTopBar(true);
  };

  const handleOnMouseEnter = (e) => {
    e.currentTarget.lastElementChild.lastElementChild.lastElementChild.style.color =
      '#F0F0F3';
    if (
      e.currentTarget.lastElementChild.lastElementChild.firstElementChild.getAttribute(
        'data-testid',
      ) === 'StarBorderIcon' ||
      'SettingsBackupRestoreIcon'
    ) {
      e.currentTarget.lastElementChild.lastElementChild.firstElementChild.style.color =
        '#F0F0F3';
    }

    e.currentTarget.lastElementChild
      .getElementsByClassName('MuiCardHeader-content')
      .item(0).lastElementChild.lastElementChild.style.color = '#FFFFFF';
    setDisplayTopBar(false);
    if (isOpenMenu) {
      setIsOpenMenu(false);
      setAnchorEl(null);
    }
  };

  const handleClickRestore = async (e, boardId) => {
    await restoreDeletedBoard({boardId: boardId});
    if(deletedBoardList && deletedBoardList.length <= 1) {
      history.push('/recent');
    }
    // if (err) {
    //   Boardx.Util.Msg.info(err.message);
    //   return;
    // }
  };

  const handleCardHeaderContentDOM = () => {
    if (!board.deletedInfo) {
      if (board.favoriteBoard && board.favoriteBoard.favorite) {
        return (
          <>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              strokeWidth="1"
              className={classes.starred}
              width={16}
              height={16}
              style={{
                display: displayTopBar ? 'block' : 'block'
              }}
              onClick={e => handleFavoriteBoard(e, board._id, false)}
            >
              <g transform="matrix(1,0,0,1,0,0)">
                <path
                  d="M23.56,8.73a1.51,1.51,0,0,0-1.41-1H16.06a.5.5,0,0,1-.47-.33l-2.18-6.2A1.52,1.52,0,0,0,12,.25a1.49,1.49,0,0,0-1.4,1v0L8.41,7.42a.5.5,0,0,1-.47.33H1.85a1.5,1.5,0,0,0-1.41,1A1.52,1.52,0,0,0,.89,10.4l5.18,4.3a.5.5,0,0,1,.16.54L4.05,21.77a1.5,1.5,0,0,0,2.31,1.69l5.34-3.92a.49.49,0,0,1,.59,0l5.35,3.92A1.5,1.5,0,0,0,20,21.77l-2.18-6.53a.5.5,0,0,1,.16-.54l5.19-4.31A1.51,1.51,0,0,0,23.56,8.73Z"
                  style={{ fill: '#F21D6B' }}
                />
              </g>
            </svg>
            <MoreHorizOutlined
              style={{
                display:
                  displayTopBar && type !== 'recentPageBoard'
                    ? 'block'
                    : displayTopBar && boardRoomId === 'none'
                    ? 'block'
                    : 'none',
                width: 20,
                height: 20
              }}
              className={classes.menu}
              onClick={handleClick}
            />
          </>
        );
      }
      return (
        <>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            strokeWidth="1"
            className={classes.starred2}
            width={16}
            height={16}
            style={{
              display: displayTopBar ? 'block' : 'none'
            }}
            onClick={e => handleFavoriteBoard(e, board._id, true)}
          >
            <g transform="matrix(1,0,0,1,0,0)">
              <path
                d="M12.729,1.2l3.346,6.629,6.44.638a.805.805,0,0,1,.5,1.374l-5.3,5.253,1.965,7.138a.813.813,0,0,1-1.151.935L12,19.934,5.48,23.163a.813.813,0,0,1-1.151-.935L6.294,15.09.99,9.837a.805.805,0,0,1,.5-1.374l6.44-.638L11.271,1.2A.819.819,0,0,1,12.729,1.2Z"
                fill="none"
                stroke="#F21D6B"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </g>
          </svg>
          <MoreHorizOutlined
            style={{
              display:
                displayTopBar && type !== 'recentPageBoard'
                  ? 'block'
                  : displayTopBar && boardRoomId === 'none'
                  ? 'block'
                  : 'none',
              width: 20,
              height: 20
            }}
            className={classes.menu}
            onClick={handleClick}
          />
        </>
      );
    }
    return (
      <>
        <SettingsBackupRestoreIcon
          className={classes.starred3}
          onClick={(e) => handleClickRestore(e, board._id)}
        />
        <Typography
          className={classes.restoreText}
          onClick={(e) => handleClickRestore(e, board._id)}
        >
          {t('pages.autoPageUpdateInfo.restore')}
        </Typography>
      </>
    );
  };

  const enterBoard = (url) => {
    let pageFrom =
      location.pathname.indexOf('recent') > -1
        ? 'recent'
        : location.pathname.indexOf('teamsetting') > -1
        ? 'teamsetting'
        : 'room';

    localStorage.setItem('pageFrom', pageFrom);
 
    dispatch(handleOpenChatUI(false));
    // window.location.href = url;
    history.push(url);
  };

  const url = board.deletedInfo ? undefined : `/board/${_id}`;

  return (
    <StyledCard
      className={classes.root}
      data-id={board._id}
      onMouseEnter={e => handleOnMouseLeave(e)}
      onMouseLeave={e => handleOnMouseEnter(e)}
    >
      <Link
        component={RouterLink}
        data-cy={board.name}
        onClick={enterBoard.bind(this, url)}
        to="#"
        underline="none"
      >
        {mediaDisplay()}
      </Link>
      <CardHeader
        action={
          <>
            {handleCardHeaderContentDOM()}
            <Menu
              anchorEl={anchorEl}
              keepMounted
              onClose={handleClose}
              open={isOpenMenu}
            >
              <MenuItem>
                <BoardRenameModal
                  board={board}
                  getUserIsRevisionBoard={getUserIsRevisionBoard}
                  handleClose={handleClose}
                />
              </MenuItem>

              {type !== 'teamsTemplate' && (
                <MenuItem onClick={handleDuplicateBoard}>
                  <ListItemText primary={t('components.board.duplicate')} />
                </MenuItem>
              )}

              <MenuItem>
                <BoardThumbnailUpload
                  board={board}
                  getUserIsRevisionBoard={getUserIsRevisionBoard}
                  handleClose={handleClose}
                />
              </MenuItem>

              {roomId === 'pEjM37SPro3QyJsn4' || type === 'teamsTemplate' ? (
                <MenuItem>
                  <BoardSetCategory board={board} handleClose={handleClose} />
                </MenuItem>
              ) : null}

              {roomId === 'pEjM37SPro3QyJsn4' || type === 'teamsTemplate' ? (
                <MenuItem>
                  <BoardAddDescription
                    board={board}
                    handleClose={handleClose}
                  />
                </MenuItem>
              ) : null}

              <MenuItem
                onClick={() => {
                  handelOpenInNewTab(url);
                }}
              >
                <ListItemText primary={t('components.board.openInNewTab')} />
              </MenuItem>

              {type !== 'teamsTemplate' && (
                <MenuItem>
                  <BoardMoveModal
                    board={board}
                    handleClose={handleClose}
                    getUserIsRevisionBoard={getUserIsRevisionBoard}
                    isAll={isAll}
                  />
                </MenuItem>
              )}

              {/*<MenuItem>
                <BoardCreateTemplate
                  board={board}
                  handleClose={handleClose}
              />
              </MenuItem>*/}
              <MenuItem>
                <BoardDeleteBoardModal
                  board={board}
                  handleClose={handleClose}
                  getUserIsRevisionBoard={getUserIsRevisionBoard}
                />
              </MenuItem>
            </Menu>
          </>
        }
        avatar={<Avatar aria-label="user" className={classes.avatar} />}
        classes={{ avatar: classes.noMargin, root: classes.cardHeaderRoot }}
        subheader={
          <span
            onClick={() => {
              history.push(url);
            }}
            style={{ color: '#FFFFFF' }}
          >
            {isAll === true ? fetchRoomNameinRecentBoard(board) : null}{' '}
            {fetchLastUpdateInfo(board)}
          </span>
        }
        title={
          <span
            className={classes.title}
            onClick={() => {
              history.push(url);
            }}
            title={board.name}
          >
            {_.truncate(board.name, {
              length: 45,
              separator: /,? +/
            })}
          </span>
        }
      />
    </StyledCard>
  );
}

Board.propTypes = {
  board: PropTypes.object.isRequired,
  isAll: PropTypes.bool,
  type: PropTypes.string,
};
