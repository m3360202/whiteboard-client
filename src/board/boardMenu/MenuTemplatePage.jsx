//** Import react
import React, { useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenTour } from '../../store/sideBar';
import { handleSetPTagList,handleSetIsAllTemplate, handleSetOpenTemplate,handleSetTemplateList } from '../../store/resource';
import { useGetWhiteboardByRoomIdQuery } from '../../redux/BoardAPISlice';
//** Import Mui
import { Theme } from '@mui/material/styles';
import { MenuTemplateBoard } from './MenuTemplateBoard';
import MenuTemplateAutoSearch from './MenuTemplateAutoSearch';
import Toolbar from '@mui/material/Toolbar';
import Drawer from '@mui/material/Drawer';
import Button from '@mui/material/Button';
import List from '@mui/material/List';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Link from '@mui/material/Link';
import Divider from '@mui/material/Divider';
import clsx from 'clsx';

//** Import Services
import { BoardService } from '../../services';

const PREFIX = 'MenuTemplatePage';

const classes = {
  typography: `${PREFIX}-typography`,
  root: `${PREFIX}-root`,
  padding: `${PREFIX}-padding`,
  demo1: `${PREFIX}-demo1`,
  content: `${PREFIX}-content`,
  contentButton: `${PREFIX}-contentButton`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  main: `${PREFIX}-main`,
  boardListHeader: `${PREFIX}-boardListHeader`,
  headerContainer: `${PREFIX}-headerContainer`,
  roomList: `${PREFIX}-roomList`,
  listName: `${PREFIX}-listName`,
  listLink: `${PREFIX}-listLink`,
  categoryName: `${PREFIX}-categoryName`,
  divider: `${PREFIX}-divider`,
  shortDivider: `${PREFIX}-shortDivider`,
  active: `${PREFIX}-active`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.typography}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.root}`]: {
    display: 'flex',
    flexWrap: 'wrap',
    overflow: 'hidden',
    backgroundColor: theme.palette.background.paper,
    height: '100%'
  },

  [`& .${classes.padding}`]: {
    padding: theme.spacing(3)
  },

  [`& .${classes.demo1}`]: {
    backgroundColor: theme.palette.background.paper,
    width: '100%',
    height: '100%'
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: '1rem',
    paddingTop: 8,
    paddingLeft: '24px',
    paddingRight: '24px',
    marginLeft: '240px',
    overflowX: 'hidden',
    display: 'grid',
    position: 'relative'
  },

  [`& .${classes.contentButton}`]: {
    position: 'absolute',
    color: '#F21D6B',
    height: '40px',
    fontSize: '14px',
    border: '1px solid #F21D6B',
    bottom: '6px',
    right: '56px',
    '&:hover': {
      color: '#FFFFFF'
    }
  },

  [`& .${classes.drawerPaper}`]: {
    width: '240px',
    borderStyle: 'none',
    position: 'absolute'
  },

  [`& .${classes.main}`]: {
    height: '100%',
    width: '100%'
  },

  [`& .${classes.boardListHeader}`]: {
    marginLeft: '240px'
  },

  [`& .${classes.headerContainer}`]: {
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'space-between',
    height: '100%',
    background: '#F7F6F3',
    borderStyle: 'none'
  },

  [`& .${classes.roomList}`]: {
    marginTop: '24px',
    overflowY: 'auto',
    height: `calc(100% - ${50}px)`
  },

  [`& .${classes.listName}`]: {
    float: 'left',
    fontWeight: 400,
    fontSize: '18px'
  },

  [`& .${classes.listLink}`]: {
    boxShadow: '0px 1px 3px 2px #00000014',
    lineHeight: '1em',
    display: 'flex',
    flexDirection: 'row',
    alignItems: 'center',
    padding: '8px',
    height: '26px',
    cursor: 'pointer',
    left: '20px',
    width: '180px',
    textDecoration: 'none',
    position: 'relative',
    fontSize: '16px',
    color: '#232930',
    ' &:hover': {
      background: '#D3F4F4',
      backgroundsize: 'auto',
      color: '#232930',
      borderRadius: '10px',
      width: '180px'
    },
    ' &$active': {
      background: '#f21d6b',
      color: '#FFFFFF',
      borderRadius: '10px',
      width: 'auto'
    }
  },

  [`& .${classes.categoryName}`]: {
    float: 'left',
    fontWeight: 400,
    fontSize: 28,
    marginTop: 24,
    marginLeft: '8px'
  },

  [`& .${classes.divider}`]: {
    marginBottom: '12px',
    width: '97%',
    marginLeft: '8px',
    marginRight: '8px'
  },

  [`& .${classes.shortDivider}`]: {
    marginBottom: '12px',
    width: '80%',
    marginLeft: '8px',
    marginRight: '8px'
  },

  [`& .${classes.active}`]: {
    background: '#D3F4F4'
  }
}));

const templateRoomId = 'pEjM37SPro3QyJsn4';

const { t } = useTranslation();


const pTagList = [
  {
    tagName: 'Featured',
    tagTitle: t('board.menu.templates.featured'),
    templateListbyTag: []
  },
  {
    tagName: 'Basics',
    tagTitle: t('board.menu.templates.basics'),
    templateListbyTag: []
  },
  {
    tagName: 'Workshop & Meeting',
    tagTitle: t('board.menu.templates.workshopMeeting'),
    templateListbyTag: []
  },
  {
    tagName: 'Project Management',
    tagTitle: t('board.menu.templates.projectManagement'),
    templateListbyTag: []
  },
  {
    tagName: 'Design Thinking',
    tagTitle: t('board.menu.templates.designThinking'),
    templateListbyTag: []
  },
  {
    tagName: 'Strategy & Planning',
    tagTitle: t('board.menu.templates.strategyPlanning'),
    templateListbyTag: []
  },
  {
    tagName: 'Lean Manufacturing',
    tagTitle: t('board.menu.templates.leanManufacturing'),
    templateListbyTag: []
  },
  {
    tagName: 'Education',
    tagTitle: t('board.menu.templates.education'),
    templateListbyTag: []
  },
  {
    tagName: 'Storytelling',
    tagTitle: t('board.menu.templates.storytelling'),
    templateListbyTag: []
  },
  {
    tagName: 'Games',
    tagTitle: t('board.menu.templates.games'),
    templateListbyTag: []
  }
];

const getBoardListbyTags = tags => {
  const templateListAll = store.getState().resource.templateList;

  let tagTemplateList = [];
  if (templateListAll) {
    templateListAll.forEach(t => {
      if (t.tags) {
        if (t.tags.length > 1) {
          t.tags.forEach(tag => {
            if (tag === tags) {
              tagTemplateList.push(t);
            }
          });
        } else {
          if (t.tags[0] === tags) {
            tagTemplateList.push(t);
          }
        }
      }
    });
    return tagTemplateList;
  }
};

function initTagList() {
  for (let i = 0; i < pTagList.length; i++) {
    pTagList[i].templateListbyTag = getBoardListbyTags(pTagList[i].tagName);
  }
  store.dispatch(handleSetPTagList(pTagList))
}

// BoardService.getInstance().setCurrentCategory(null);
store.dispatch(handleSetPTagList(true))

export default function menuTemplateDialog({ handleClose }) {

  const dispatch = useDispatch();
  const openTempalte = useSelector((state) => state.resource.openTempalte);

  const templateList = useSelector((state) => state.resource.templateList);
  const {data: getWhiteboardByRoomId } = useGetWhiteboardByRoomIdQuery(store.getState().board.board.roomId);

  const getBoardList = async (roomId) => {
    const result =  await getWhiteboardByRoomId(roomId);
        if (!result) return [];
        else{
        result.sort((a, b) => b.lastUpdateTime - a.lastUpdateTime);
        result.sort((a, b) => {
          let aa, bb;
          if (!a.favorite) {
            a.favorite = false;
          }
          if (!b.favorite) {
            b.favorite = false;
          }
          if (a.favorite === true) {
            aa = true;
          } else {
            aa = false;
          }
          if (b.favorite === true) {
            bb = true;
          } else {
            bb = false;
          }
          if (aa > bb) return -1;
          if (aa < bb) return 1;
          return 0;
        });
        let templateArr = [];
        //只列出官方模板，分享的模板，以及自己创建的未分享模板
        if (result && result.length > 0) {
          result.map(t => {
            if (!t.onlyMe) {
              templateArr.push(t);
            } else {
              if (t.onlyMe && t.userId === store.getState().user.userInfo.userId) {
                templateArr.push(t);
              }
            }
          });
        }
        store.dispatch(handleSetTemplateList(templateArr));
      }
  };
  React.useEffect(() => {
    getBoardList(templateRoomId);
  }, []);
  useEffect(()=>{
    initTagList();
  },[templateList]);
  const handleGetSelectedTagList=()=>{
    let selectedTagList = [];
    if (selectedTag) {
      pTagList.map(p => {
        if (p.tagName === selectedTag) {
          selectedTagList = p.templateListbyTag;
        }
      });
    }
    return selectedTagList;
  }
  const isAllTemplate = useSelector((state) => state.resource.isAllTemplate);

  const searchTemplateList = useSelector((state) => state.resource.searchTemplateList);
  const selectedTag = useSelector((state) => state.resource.selectedTag);
  const pTagList = useSelector((state) => state.resource.pTagList);
  const selectedTagList = handleGetSelectedTagList();


  const templateListbyCategory = pTagList.map((t, idx) => {
    let curTemplateList = t.templateListbyTag;
    return (
      <Box
        key={idx}
        sx={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gridTemplateAreas:
            '"header header sidebar" "divider divider divider" "main main main" ',
          marginBottom: '64px'
        }}
      >
        <Box sx={{ gridArea: 'header' }}>
          <Typography className={classes.categoryName}>{t.tagTitle}</Typography>
        </Box>
        <Box sx={{ gridArea: 'main' }}>
          <List>
            {curTemplateList
              .map(b => {
                return (
                  <MenuTemplateBoard
                    key={b._id}
                    board={b}
                    width="268px"
                    height="172px"
                    margin="24px 8px 0px 8px"
                    fontSize="16px"
                    fontWeight="900"
                  />
                );
              })
              .slice(0, 3)}
          </List>
        </Box>
        <Box
          sx={{
            gridArea: 'sidebar',
            float: 'right',
            paddingLeft: '150px',
            paddingTop: '36px'
          }}
        >
          <Button
            type="button"
            onClick={() => handleOpenRoom(t)}
            variant="text"
            size="large"
          >
            {t('board.menu.templates.more')}
          </Button>
        </Box>
        <Box sx={{ gridArea: 'divider' }}>
          <Divider className={classes.divider} />
        </Box>
      </Box>
    );
  });

  const displayTemplate = isAllTemplate ? (
    templateListbyCategory
  ) : (
    <div>
      {selectedTagList
        ? selectedTagList.map(d => {
            return (
              <MenuTemplateBoard
                key={d._id}
                board={d}
                width="268px"
                height="172px"
                margin="24px 8px 0px 8px"
                fontSize="16px"
                fontWeight="900"
              />
            );
          })
        : null}
    </div>
  );

  const handleClickContentButton = () => {
    handleClose();
    dispatch(handleSetOpenTour(true));
    dispatch(handleSetOpenTemplate(false));
  };

  const TemplatePage = (
    <div style={{ height: 'auto', width: '100%' }}>
      <Box>
        <Toolbar className={classes.boardListHeader}>
          <MenuTemplateAutoSearch roomId={templateRoomId} />
        </Toolbar>
      </Box>
      <Box
        sx={{ display: 'flex', flexDirection: 'column' }}
        style={{ height: '600px' }}
        id="templateDisplay"
        className={classes.content}
      >
        {searchTemplateList && searchTemplateList.length > 0
          ? searchTemplateList.map(d => {
              return (
                <div>
                  <MenuTemplateBoard
                    key={d._id}
                    board={d}
                    width="268px"
                    height="172px"
                    margin="24px 8px 0px 8px"
                    fontSize="16px"
                    fontWeight="900"
                  />
                </div>
              );
            })
          : displayTemplate}
      </Box>
      {openTempalte ? (
        <Button
          onClick={handleClickContentButton}
          className={classes.contentButton}
          variant="outlined"
        >
          {t('board.menu.templates.userRoleInterestSelectionsButton')}
        </Button>
      ) : null}
    </div>
  );

  const openRoom = e => {
    let category = e.target.id;
    if (category) {
      if (category === 'All templates') {
        // BoardService.getInstance().setCurrentCategory(null);

         store.dispatch(handleSetIsAllTemplate(true));
      } else {
         store.dispatch(handleSetIsAllTemplate(false));
        // BoardService.getInstance().setCurrentCategory(category);
      }
    }
  };

  const handleOpenRoom = e => {
    let category = e.tagName;
    if (category) {
      if (category === 'All templates') {
        store.dispatch(handleSetIsAllTemplate(true));
        // BoardService.getInstance().setCurrentCategory(null);
       } else {
         store.dispatch(handleSetIsAllTemplate(false));
        // BoardService.getInstance().setCurrentCategory(category);
      }
    }
  };

  const DrawerContent = (
    <div className={classes.headerContainer}>
      <div className={classes.roomList}>
        <div
          style={{
            overflow: 'hidden',
            background: 'rgba(243, 247, 247, 0.64)'
          }}
        >
          <Link
            to="#"
            id="All templates"
            title={t('board.menu.templates.allTemplates')}
            className={classes.listLink}
            onClick={e => openRoom(e)}
            style={{ display: 'inline-block' }}
          >
            <Typography id="All templates" className={classes.listName}>
              {t('board.menu.templates.allTemplates')}
            </Typography>
          </Link>

          <Divider className={classes.shortDivider} />

          <Box style={{ width: '100%' }}>
            {(pTagList || []).map((list, index) => {
              if (list) {
                return (
                  <Link
                    to="#"
                    key={index}
                    id={list.tagName}
                    title={list.tagName}
                    className={
                      selectedTag === list.tagName
                        ? clsx(classes.listLink, classes.active)
                        : classes.listLink
                    }
                    onClick={e => openRoom(e)}
                    style={{ display: 'inline-block' }}
                  >
                    <Typography id={list.tagName} className={classes.listName}>
                      {list.tagTitle}
                    </Typography>
                  </Link>
                );
              }
              return null;
            })}
          </Box>
          <Divider className={classes.shortDivider} />
        </div>
      </div>
    </div>
  );

  return (
    <Root className={classes.root}>
      <div id="templateLeftDrawer" style={{ float: 'right' }}>
        <Drawer
          sx={{ display: { sm: 'block', xs: 'none' } }}
          classes={{ paper: classes.drawerPaper }}
          variant="permanent"
          anchor="left"
        >
          {DrawerContent}
        </Drawer>
      </div>
      <div id="templateBoard" className={classes.main}>
        {TemplatePage}
      </div>
    </Root>
  );
}
