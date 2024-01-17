//** Import react
import React, { useRef, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Mui

import TextField from '@mui/material/TextField';
import { InputAdornment } from '@mui/material';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleSetKeyword,
  handleSetInFavoriteBoardPage,
  handleSetFavoriteBoardList
} from '../../store/boardList';
import { handleSetCurrentRoomList, handleSetInRoom } from '../../store/room';
import { useGetRoomListByOrgIdQuery } from '../../redux/OrgAPISlice';

const PREFIX = 'AutoSearchBoard';

const classes = {
  noBorder: `${PREFIX}-noBorder`,
  delsearch: `${PREFIX}-delsearch`,
  searchBar: `${PREFIX}-searchBar`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.noBorder}`]: {
    border: 'none',
  },

  [`& .${classes.delsearch}`]: {
    width: '15px',
    height: '15px',
    '&:hover': {
      fontWeight: 'bold !important',
      fill: '#444467',
    },
  },

  [`& .${classes.searchBar}`]: {
    display: 'flex',
    backgroundColor: '#F4F4F4',
    height: '40px',
    width: '30%',
    minWidth: '240px',
    maxWidth: '640px',
    position: 'relative',
  }
}));

const Search = styled('div')((theme) => ({
  position: 'relative',
  //borderRadius: theme.shape.borderRadius,
  flexGrow: 1,
  marginRight: 2,
  marginLeft: 0,
  // [theme.breakpoints.down('xl')]: {
  //   marginLeft: 0,
  //   width: 178,
  //   float: 'left',
  // },
}));

export default function AutoSearchBoard() {
  //use
  const dispatch = useDispatch();

  const location = useLocation();
  const { t } = useTranslation();
  const [isSearchContent, setIsSearchContent] = useState(false);
  //org
  const orgId = useSelector((state) => state.org.orgInfo.orgId);
  const orgInfo = useSelector((state) => state.org.orgInfo);
  //search
  const keyWordRef = useRef();

  //room
  const { data: originRoomList = [] } = useGetRoomListByOrgIdQuery(orgId);

  //board
  const originBoardList = useSelector((state) => state.boardList.boardList);
  const originFavoriteBoardList = useSelector(
    (state) => state.boardList.favoriteBoardList
  );

  useEffect(() => {
    document.getElementById('searchField').value = '';
  }, [location]);

  const searchByKeyword = async (e) => {
    if(e.keyCode === 13){
      const search = keyWordRef.current.value;
      if (search.length < 1 || !search) {
        delKeywords();
        return;
      }
      if (search !== '') {
        dispatch(handleSetKeyword(search));
        setIsSearchContent(true);
  
        //deal favorite board search
        if (originFavoriteBoardList.length > 0) {
          const newFavoriteBoardList = originFavoriteBoardList.filter(
            t => t.name.toLowerCase().indexOf(search) > -1
          );
          return dispatch(handleSetFavoriteBoardList(newFavoriteBoardList));
        }
      }
    }
  };

  const delKeywords = () => {
    dispatch(handleSetCurrentRoomList(originRoomList));
    dispatch(handleSetKeyword(''));
    dispatch(handleSetInRoom(true));
    dispatch(handleSetInFavoriteBoardPage(true));
    document.getElementById('searchField').value = '';
    setIsSearchContent(false);
  };

  return (
    <Root>
      <Search id="searchBar" className={classes.searchBar}>
        <TextField
          InputProps={{
            onKeyUp: searchByKeyword,
            startAdornment: (
              <InputAdornment position="start">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  width={15}
                  height={15}
                >
                  <g transform="matrix(1,0,0,1,0,0)">
                    <path
                      d="M0.750 9.812 A9.063 9.063 0 1 0 18.876 9.812 A9.063 9.063 0 1 0 0.750 9.812 Z"
                      fill="none"
                      stroke="#858585"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                      transform="translate(-3.056 4.62) rotate(-23.025)"
                    />
                    <path
                      d="M16.221 16.22L23.25 23.25"
                      fill="none"
                      stroke="#858585"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </InputAdornment>
            ),
            endAdornment: (
              <InputAdornment
                position="end"
                onClick={delKeywords}
                className={classes.delsearch}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  id="delsvg"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  width={15}
                  height={15}
                  style={{ display: isSearchContent ? 'block' : 'none', cursor: 'default' }}
                >
                  <g transform="matrix(1,0,0,1,0,0)">
                    <path
                      d="M0.75 23.249L23.25 0.749"
                      fill="none"
                      stroke="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    ></path>
                    <path
                      d="M23.25 23.249L0.75 0.749"
                      fill="none"
                      stroke="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    ></path>
                  </g>
                </svg>
              </InputAdornment>
            ),
            classes: { notchedOutline: classes.noBorder },
          }}
          id="searchField"
          placeholder={t('pages.listPage.searchBoardOrRoom')}
          style={{
            marginTop: '-8px',
            marginLeft: '4px',
            fontSize: '12px',
            width: '100%',
          }}
          type="text"
          inputRef={keyWordRef}
        />
      </Search>
    </Root>
  );
}
