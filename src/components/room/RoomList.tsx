//** Import react
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { Link as RouterLink, useHistory } from 'react-router-dom';
import LazyLoad from 'react-lazyload';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleSetBoardList,
  handleSetCurrentBoardList,
  handleSetKeyword
} from '../../store/boardList';
import { handleSetRoomInfo, handleSetRoomId } from '../../store/room';
import {
  useToggleRoomFavoriteMutation,
  useLoadRoomInfoQuery
} from '../../redux/RoomAPISlice';

//** Import Mui
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Box from '@mui/material/Box';
import List from '@mui/material/List';
import Link from '@mui/material/Link';
import FavoriteIcon from '../../mui/icons/FavoriteIcon';
import FavoriteNoIcon from '../../mui/icons/FavoriteNoIcon';

//** Import Services
import { useGetRoomListByOrgIdQuery } from '../../redux/OrgAPISlice';

//** Imort components
import CreateRoomModal from '../room/CreateRoomModal';

//** Import others
import clsx from 'clsx';

const PREFIX = 'RoomList';

const classes = {
  active: `${PREFIX}-active`,
  listLink: `${PREFIX}-listLink`,
  starred: `${PREFIX}-starred`,
  starred2: `${PREFIX}-starred2`,
  divider: `${PREFIX}-divider`,
  noRoomBox: `${PREFIX}-noRoomBox`,
  noRoomTitleTypography: `${PREFIX}-noRoomTitleTypography`,
  noRoomContentTypography: `${PREFIX}-noRoomContentTypography`
};

const Root = styled('div')(() => ({
  [`& .${classes.active}`]: {
    backgroundColor: '#D3F3F3',
    width: '240px',
    lineHeight: '1.5em',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px',
    position: 'absolute',
    height: '40px'
  },

  [`& .${classes.listLink}`]: {
    boxShadow: 'rgba(255,255,255,.15) 0 1px 0 0',
    lineHeight: '1em',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '0px 0 0px 8px',
    height: '40px',
    cursor: 'pointer',
    marginLeft: '16px',
    marginRight: '16px',
    width: '208px',
    textDecoration: 'none',
    position: 'relative',
    fontSize: '14px',
    color: '#232930',
    userSelect: 'none',
    '&:focus, &$active': {
      background: '#D3F3F3',
      color: '#232930',
      borderRadius: '4px'
    },
    '&:hover': {
      background: '#Efeff0',
      color: '#232930',
      borderRadius: '4px'
    }
  },

  [`& .${classes.starred}`]: {
    fontSize: 16,
    float: 'right',
    width: 16,
    height: 16,
    cursor: 'pointer',
    background: 'transparent',
    borderWidth: '0px',
    marginRight: '10px',
    marginTop: '2px',
    '&:hover': {
      borderWidth: '0px'
    },
    '&:focus': {
      borderWidth: '0px'
    }
  },

  [`& .${classes.starred2}`]: {
    fontSize: 16,
    float: 'right',
    width: 16,
    height: 16,
    cursor: 'pointer',
    background: 'transparent',
    borderWidth: '0px',
    marginRight: '10px',
    marginTop: '2px',
    visibility: 'hidden',
    '&:hover': {
      borderWidth: '0px',
      visibility: 'visible'
    },
    '&:focus': {
      borderWidth: '0px'
    }
  },

  [`& .${classes.divider}`]: {
    marginBottom: 10,
    width: '80%',
    marginLeft: 23,
    marginTop: 12
  },

  [`& .${classes.noRoomBox}`]: {
    padding: '12px',
    border: '1px solid rgba(0, 0, 0, 0.16)',
    borderRadius: '4px',
    marginLeft: '24px',
    marginRight: '20px',
    boxSizing: 'border-box'
  },

  [`& .${classes.noRoomTitleTypography}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '20px',
    color: 'rgba(35, 41, 48, 0.65)',
    marginBottom: '16px'
  },

  [`& .${classes.noRoomContentTypography}`]: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    color: 'rgba(58, 53, 65, 0.68)'
  }
}));



function RoomList({ parentComponent }) {
  //use

  const history = useHistory();
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [openRoomId, setOpenRoomId] = useState('');
  const [roomList, setRoomList] = useState([]);
  //org
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);
  const roomInfo = useSelector((state: RootState) => state.room.roomInfo);
  //search
  const keywords = useSelector((state: RootState) => state.boardList.keyword);

  //room
  const { data } = useGetRoomListByOrgIdQuery(orgInfo.orgId);
  const { data: loadedRoomInfo } = useLoadRoomInfoQuery(openRoomId);
  const [toggleRoomFavorite] = useToggleRoomFavoriteMutation();

  const currentRoomId = useSelector((state: RootState) => state.room.roomId);

  //board
  const boardList = useSelector(
    (state: RootState) => state.boardList.currentBoardList
  );
  const checkRoomList = (l) => {
    let arr = [];
    var list = l;
    if (list?.length > 0) {
      list.forEach(item => {
        if (item.rid) {
          arr.push(item);
        } else {
          let a = { ...item, rid: item._id };
          arr.push({ ...item, rid: item._id });
        }
      });
    }
    return arr;
  }

  const deletedBoardList = useSelector(
    (state: RootState) => state.boardList.pendingDeleteBoardList
  );

  //functions
  const onHover = (e, favorite) => {
    if (favorite === false && e.target.lastElementChild) {
      e.target.lastElementChild.style.visibility = 'visible';
    }
  };

  const onLeave = (e, favorite) => {
    if (favorite === false && e.target.lastElementChild) {
      e.target.lastElementChild.style.visibility = 'hidden';
    }
  };

  const openRoom = list => {
    console.log('openRoom', list);
    let roomId = list.rid ? list.rid : list._id;
    setOpenRoomId(roomId);
    localStorage.setItem('roomId', roomId);
    history.push(`/room/${roomId}`);

    dispatch(handleSetKeyword(''));
    dispatch(handleSetRoomId(roomId));
    dispatch(handleSetCurrentBoardList([]));
    dispatch(handleSetRoomInfo({ ...roomInfo, roomId: list.rid, name: list.name }));
    (window as any).setMobileOpen(false);
  };
  //undone
  const toggleFavorite = async (e, roomId, value) => {
    if (e.type === 'click') {
      // error
      await toggleRoomFavorite({
        roomId: roomId,
        value: value,
        orgId: orgInfo.orgId
      });
      // Boardx.Util.Msg.warning(error.message);
    }
  };

  const handleClickRecentLink = () => {
    // window.setMobileOpen(false);
    dispatch(handleSetKeyword(''));
    history.push('/recent');
  };

  const handleClickFavoritesLink = () => {
    history.push('/favorite');
    dispatch(handleSetKeyword(''));
  };

  const handleClickAiAssistantLink = () => {
    history.push('/aiassistant');
    dispatch(handleSetKeyword(''));
  };

  const handleClickAppsStoreLink = () => {
    history.push('/appsStore');
    dispatch(handleSetKeyword(''));
  }

  const handleClickCommunityLink = () => {
    history.push('/community');
    dispatch(handleSetKeyword(''));
  };

  const handleClickPromptLink = () => {
    history.push('/prompt');
    dispatch(handleSetKeyword(''));
  };

  const handleClickDeletedLink = () => {
    history.push('/delete');
    dispatch(handleSetKeyword(''));
  };

  const handleDeletedLinkDOM = () => {
    if (deletedBoardList.length !== 0) {
      return (
        <>
          <Divider className={classes.divider} />
          <Link
            component={RouterLink}
            className={
              parentComponent === 'deletePage'
                ? clsx(classes.listLink, classes.active)
                : classes.listLink
            }
            onClick={handleClickDeletedLink}
            to="#"
            sx={{ mb: '10px' }}
          >
            {t('pages.listPage.deletedBoards')}
          </Link>
        </>
      );
    }
    return null;
  };

  useEffect(() => {
    if (data) {
      setRoomList(checkRoomList(data));
    }
  }, [data]);

  return (
    <Root style={{ overflow: 'hidden' }}>
      <Box sx={{ backgroundColor: '#F7FAFA', zIndex: 999 }}>
        <Link
          component={RouterLink}
          className={
            parentComponent === 'recentPage'
              ? clsx(classes.listLink, classes.active)
              : classes.listLink
          }
          onClick={handleClickRecentLink}
          to="#"
        >
          {t('pages.listPage.recent')}
        </Link>

        <Link
          sx={{ mt: '6px' }}
          component={RouterLink}
          className={
            parentComponent === 'favoritesBoardPage'
              ? clsx(classes.listLink, classes.active)
              : classes.listLink
          }
          onClick={handleClickFavoritesLink}
          to="#"
        >
          {t('pages.listPage.favorites')}
        </Link>

        <Link
          sx={{ mt: '6px' }}
          component={RouterLink}
          className={
            parentComponent === 'AIAssistantPage'
              ? clsx(classes.listLink, classes.active)
              : classes.listLink
          }
          onClick={handleClickAiAssistantLink}
          to="#"
        >
          {t('pages.listPage.aiAssistant')}
        </Link>

        <Link
          sx={{ mt: '6px' }}
          component={RouterLink}
          className={
            parentComponent === 'AppsStorePage'
              ? clsx(classes.listLink, classes.active)
              : classes.listLink
          }
          onClick={handleClickAppsStoreLink}
          to="#"
        >
          {t('pages.listPage.aiAgent')}
        </Link>

        {/* <Link
          sx={{ mt: '6px' }}
          component={RouterLink}
          className={
            parentComponent === 'communityPage'
              ? clsx(classes.listLink, classes.active)
              : classes.listLink
          }
          onClick={handleClickCommunityLink}
          to="#"
        >
          {t('pages.listPage.community')}
        </Link> */}

        {/* <Link
          sx={{ mt: '6px' }}
          component={RouterLink}
          className={
            parentComponent === 'promptPage'
              ? clsx(classes.listLink, classes.active)
              : classes.listLink
          }
          onClick={handleClickPromptLink}
          to="#"
        >
          {t('pages.listPage.prompt')}
        </Link> */}

        <Divider className={classes.divider} />

        <CreateRoomModal />
      </Box>

      <Box sx={{ width: '100%', mt: '10px' }}>
        {roomList.map(list => {
          if (!list.prid) {
            return (
              <Link
                component={RouterLink}
                className={
                  currentRoomId === list.rid && parentComponent === 'roomPage'
                    ? clsx(classes.listLink, classes.active)
                    : classes.listLink
                }
                key={list.rid}
                onClick={() => openRoom(list)}
                onMouseEnter={e => onHover(e, list.f)}
                onMouseLeave={e => onLeave(e, list.f)}
                style={{
                  display: 'flex',
                  flexDirection: 'row',
                  alignItems: 'center',
                  justifyContent: 'space-between'
                }}
                title={list.name}
                to="#"
              >
                <Typography
                  style={{ float: 'left', fontWeight: 400, fontSize: 14 }}
                >
                  {list.name.length > 20
                    ? `${list.name.substring(0, 19)}...`
                    : list.name}
                </Typography>
                {list.f ? (
                  <FavoriteIcon
                    className={classes.starred}
                    onClick={e => toggleFavorite(e, list.rid, false)}
                  />
                ) : (
                  <FavoriteNoIcon
                    className={classes.starred2}
                    onClick={e => toggleFavorite(e, list.rid, true)}
                  />
                )}
              </Link>
            );
          }
          return null;
        })}
        {roomList && roomList.length === 0 ? (
          <Box className={classes.noRoomBox}>
            <Typography className={classes.noRoomTitleTypography}>
              {t('components.noCreateRoomContent.noCreateRoomTitle')}
            </Typography>
            <Typography className={classes.noRoomContentTypography}>
              {t('components.noCreateRoomContent.noCreateRoomContentOne')}
              <br />
              <br />
              {t('components.noCreateRoomContent.noCreateRoomContentTwo')}
              <br />
              <br />
              {t('components.noCreateRoomContent.noCreateRoomContentThree')}
            </Typography>
          </Box>
        ) : null}
      </Box>
      {handleDeletedLinkDOM()}
    </Root>
  );
}

export default RoomList;
