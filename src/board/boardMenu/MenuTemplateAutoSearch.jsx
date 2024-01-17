//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store from '../../store';
import { handleSetSearchTemplateList } from '../../store/resource';

//** Import Mui
import TextField from '@mui/material/TextField';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import SearchOutlinedIcon from '@mui/icons-material/SearchOutlined';
import { InputAdornment } from '@mui/material';

const PREFIX = 'MenuTemplateAutoSearch';

const classes = {
  root: `${PREFIX}-root`,
  searchBar: `${PREFIX}-searchBar`,
  enableListBox: `${PREFIX}-enableListBox`,
  potentialBoards: `${PREFIX}-potentialBoards`,
  list: `${PREFIX}-list`
};

const StyledList = styled(List)((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexWrap: 'wrap',
    '& > *': {
      margin: theme.spacing(0.5),
    },
  },

  [`& .${classes.searchBar}`]: {
    marginTop: '1rem', marginLeft: '0px', flexGrow: 1
  },

  [`& .${classes.enableListBox}`]: {
    width: '250px',
    overflow: 'auto',
    position: 'relative',
    top: '0px',
    background: '#eee',
    borderStyle: 'solid',
    borderWidth: '1px',
    borderColor: '#eee',
    boxShadow: '1px 2px 4px rgba(217, 161, 177, 0.54)',
    borderRadius: '8px',
  },

  [`& .${classes.potentialBoards}`]: {
    height: '200px',
    overflow: 'auto',
    position: 'relative',
  },

  [`&.${classes.list}`]: {
    maxHeight: '200px',
    overflow: 'auto',
  }
}));

const Search = styled('div')((theme ) => ({
  position: 'relative',
  flexGrow: 1,
  borderRadius: theme.shape.borderRadius,
  marginRight: theme.spacing(2),
  marginLeft: 0,
  [theme.breakpoints.down('xl')]: {
    marginLeft: 0,
    width: 178,
    float: 'left',
  },
}));

export default function () {
  const [openState, setOpenState] = useState(false);
  const [potentialBoards, setPotentialBoards] = useState([]);
  const [enableList, setenableList] = useState(false);

  const { t } = useTranslation();

  const searchByKeyword = async (e) => {
    console.log('searchByKeyword');
    const search = e.target.value;

    store.dispatch(handleSetSearchTemplateList([]));
    if (e.keyCode !== 13) {
      return;
    }

    if (search.length < 1) {
      Boardx.Util.Msg.info(t('board.menu.onecharacter'));
      return;
    }

    setenableList(false);

  };

  const onFocus = () => {
    setOpenState(true);
  };

  const onBlur = () => {
    setTimeout(() => {
      setOpenState(false);
      setenableList(false);
    }, 300);
  };

  return (
    <Search sx={{ flexGrow: 1 }}>
      <TextField
        InputProps={{
          onFocus,
          onBlur,
          onKeyDown: searchByKeyword,
          disableUnderline: true,
          startAdornment: (
            <InputAdornment position="start">
              <SearchOutlinedIcon />
            </InputAdornment>
          ),
        }}
        className={classes.searchBar}
        placeholder={t('pages.listPage.searchBoard')}
        type="search"
        variant="outlined"
        fullWidth
      />
      {enableList ? (
        <div
          className={classes.enableListBox}
          style={{ zIndex: openState ? 9 : -1, opacity: openState ? 1 : 0 }}
        >
          <PotentialBoards
            className={classes.potentialBoards}
            potentialBoards={potentialBoards}
          />
        </div>
      ) : null}
    </Search>
  );
}

function PotentialBoards({ potentialBoards }) {

  const { t } = useTranslation();
  const [checked, setChecked] = React.useState([1]);

  const onClick = (e) => {
    const url = `/board/${e._id}`;
    window.open(url);
  };

  return (
    <StyledList className={classes.list} className={classes.root} dense>
      {potentialBoards.length > 0
        ? potentialBoards.map((board) => {
          const labelId = `checkbox-list-secondary-label-${board.name}`;
          return (
            <ListItem
              board={board}
              button
              key={board._id}
              onClick={onClick.bind(this, board)}
            >
              <ListItemAvatar>
                <Avatar
                  alt="Cindy Baker"
                  src={`${board.thumbnail}?x-oss-process=image/resize,w_60`}
                  variant="rounded"
                />
              </ListItemAvatar>
              <ListItemText id={labelId} primary={board.name} />
            </ListItem>
          );
        })
        : t('pages.listPage.noSearchResult')}
    </StyledList>
  );
}
