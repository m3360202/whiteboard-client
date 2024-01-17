//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleOpenTutorialSideBar,
  handleCloseSideBar,
  handleSetOpenTour,
  handleSetOpenShortcut,
  handSetOpenResourceHelpfulHints
} from '../../store/sideBar';

//** Import Mui
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import Typography from '@mui/material/Typography';
import Divider from '@mui/material/Divider';
import Card from '@mui/material/Card';
import CardActions from '@mui/material/CardActions';
import CardContent from '@mui/material/CardContent';
import MenuList from '@mui/material/MenuList';
import MenuItem from '@mui/material/MenuItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import Button from '@mui/material/Button';
import ContactSupportIcon from '@mui/icons-material/ContactSupport';

//** Import components
import Tutorials from './Tutorials';
import ResourceHelpfulHints from './ResourceHelpfulHints';
import TimerTutorials from './TimerTutorials';
import TutorialsAI from './TutorialsAI';
import CreateStickyNotesTips from './CreateStickyNotesTips';
import { creationMock, collaborationMock } from './LearningCenterContent';

//** Import services
import { handlePreventDefaultEvent } from '../../board/boardMenu/events';
import $ from 'jquery';

const PREFIX = 'SupportResources';

const classes = {
  supportResourcesContainer: `${PREFIX}-supportResourcesContainer`,
  rootDrawer: `${PREFIX}-rootDrawer`,
  paperDrawer: `${PREFIX}-paperDrawer`,
  titleBox: `${PREFIX}-titleBox`,
  titleH3: `${PREFIX}-titleH3`,
  tabList: `${PREFIX}-tabList`,
  rootCard: `${PREFIX}-rootCard`,
  rootCardContent: `${PREFIX}-rootCardContent`,
  eachContentCreationImg: `${PREFIX}-eachContentCreationImg`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.supportResourcesContainer}`]: {
    position: 'fixed',
    bottom: '15px',
    right: '28px',
    cursor: 'pointer'
  },

  [`& .${classes.rootDrawer}`]: {
    position: 'unset'
  },

  [`& .${classes.paperDrawer}`]: {
    width: '488px',
    padding: '20px 16px',
    boxSizing: 'border-box',
    boxShadow:
      '0px 8px 10px -5px rgba(58, 53, 65, 0.2), 0px 16px 24px 2px rgba(58, 53, 65, 0.14), 0px 6px 30px 5px rgba(58, 53, 65, 0.12)'
  },

  [`& .${classes.titleBox}`]: {
    display: 'flex',
    height: '42px',
    alignItems: 'center',
    justifyContent: 'space-between'
  },

  [`& .${classes.titleH3}`]: {
    fontSize: '34px',
    lineHeight: '42px'
  },

  [`& .${classes.tabList}`]: {
    justifyContent: 'space-between'
  },

  [`& .${classes.rootCard}`]: {
    width: '214px',
    height: '188px',
    margin: 0,
    display: 'flex',
    marginTop: '20px',
    flexDirection: 'column',
    justifyContent: 'space-between',
    cursor: 'pointer'
  },

  [`& .${classes.rootCardContent}`]: {
    height: '158px',
    padding: 0,
    width: '212px',
    overflow: 'hidden',
    border: '1px solid rgba(138, 141, 147, 0.5)',
    borderRadius: '8px'
  },

  [`& .${classes.eachContentCreationImg}`]: {
    width: '100%',
    height: '332px',
    border: '1px solid rgba(138, 141, 147, 0.5)',
    borderRadius: '8px',
    overflow: 'hidden'
  }
}));

export default function SupportResources() {
  //use

  const dispatch = useDispatch();
  const { t } = useTranslation();

  const creationMockList = creationMock();
  const collaborationMockList = collaborationMock();

  const creationAndCollaboration = [
    ...creationMockList,
    ...collaborationMockList
  ];

  //slide dom
  const sideBarMode = useSelector(
    (state) => state.sideBar.sideBarMode
  );
  const marginRightSupport = useSelector(
    (state) => state.sideBar.marginRightSupport
  );
  const isOpenDrawer = useSelector(
    (state) => state.sideBar.tutorialSideBar
  );
  const openResourceHelpfulHints = useSelector(
    (state) => state.sideBar.openResourceHelpfulHints
  );

  //dom
  const [isShowLearningCenter, setIsShowLearningCenter] = useState(false);
  const [isShowContentCreation, setIsShowContentCreation] = useState(false);
  const [contentCreationKey, setContentCreationKey] = useState(0);

  // sideBar open & close
  useEffect(() => {
    $('#supportResourcesContainer').css('right', marginRightSupport);
    const ele = document.getElementById('supportResourcesContainer');
    ele.addEventListener('wheel', handlePreventDefaultEvent);

    if (
      localStorage.getItem('openLearningCenter') === 'true' &&
      localStorage.getItem('is_onboard') === 'true'
    ) {
      setIsShowLearningCenter(true);
    }

    return () => {
    ele.removeEventListener('wheel', handlePreventDefaultEvent);

    }
  }, [sideBarMode]);

  const handleCloseLearningCenter = () => {
    dispatch(handleCloseSideBar(true));
    dispatch(handSetOpenResourceHelpfulHints(false));
    localStorage.setItem('openLearningCenter', 'false');
    if (
      localStorage.getItem('is_onboard') === 'true' &&
      !localStorage.getItem('openResourceHelpfulHints')
    ){
      // dispatch(handSetOpenResourceHelpfulHints(true));
      localStorage.setItem('openResourceHelpfulHints', 'true');
    }
  };

  const handleClick = () => {
    if (isOpenDrawer) {
      handleCloseLearningCenter();
      return;
    }
    canvas.hoverCursor = 'default';
    canvas.defaultCursor = 'default';
    setIsShowLearningCenter(false);
    dispatch(handleOpenTutorialSideBar(true));
    dispatch(handleSetOpenTour(false));
  };

  const searchByKeyword = () => {};

  const handleDrawerTitle = () => {

    return (
      <Typography variant="h3" classes={{ h3: classes.titleH3 }}>
        {t('components.boardTutorial.supportResources.learningCenter')}
      </Typography>
    );
  };

  const handleOpenShortcutsTips = () => {
    dispatch(handleSetOpenShortcut(true));
    dispatch(handleCloseSideBar(true));
  };

  const handleOpenTutorial = () => {
    dispatch(handleSetOpenTour(true));
    handleCloseLearningCenter();
  };

  const handleClickContentCreation = e => {
    setIsShowContentCreation(true);
    let index = creationAndCollaboration.findIndex(
      item => item.id === e.target.id
    );
    setContentCreationKey(index);
  };

  const handleEachContentCreationDOM = () => {
    return (
      <Box>
        <Box
          id="goBackLearningCenter"
          onClick={() => setIsShowContentCreation(false)}
          sx={{
            display: 'flex',
            color: '#959298',
            mt: '28px',
            mb: '18px',
            cursor: 'pointer',
            alignItems: 'center'
          }}
        >
          <img
            style={{ height: '16px' }}
            src="/images/tutorial/arrowBack.png"
            alt=""
          />
          {contentCreationKey > creationMockList.length - 1 ? (
            <Typography sx={{ ml: '8px' }}>
              {t(
                'components.boardTutorial.supportResources.collaboration.title'
              )}
            </Typography>
          ) : (
            <Typography sx={{ ml: '8px' }}>
              {t(
                'components.boardTutorial.supportResources.contentCreation.title'
              )}
            </Typography>
          )}
        </Box>
        <Box className={classes.eachContentCreationImg}>
          <img
            style={{ width: '100%', height: '100%' }}
            src={`/gif/${creationAndCollaboration[contentCreationKey].id}.gif`}
            alt=""
          />
        </Box>
        <Box sx={{ mt: '24px', mb: '32px' }}>
          <Typography variant="h3">
            {creationAndCollaboration[contentCreationKey].title}
          </Typography>
          <Typography sx={{ mt: '10px' }} variant="body1">
            {creationAndCollaboration[contentCreationKey].contents}
          </Typography>
        </Box>
        <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
          {contentCreationKey === 0 ||
          contentCreationKey === creationMockList.length ? null : (
            <Box
              onClick={() => setContentCreationKey(contentCreationKey - 1)}
              sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer' }}
            >
              <img
                style={{ height: '16px' }}
                src="/images/tutorial/arrowBack.png"
                alt=""
              />
              <Typography sx={{ ml: '8px' }}>
                {creationAndCollaboration[
                  contentCreationKey - 1
                ].title.toLocaleUpperCase()}
              </Typography>
            </Box>
          )}
          {contentCreationKey === creationMockList.length - 1 ||
          contentCreationKey === creationAndCollaboration.length - 1 ? null : (
            <Button
              onClick={() => setContentCreationKey(contentCreationKey + 1)}
              variant="contained"
            >
              {creationAndCollaboration[
                contentCreationKey + 1
              ].title.toLocaleUpperCase()}
            </Button>
          )}
        </Box>
      </Box>
    );
  };

  const handleContentCreationDOM = () => {
    return creationMockList.map(item => (
      <Card key={item.key} classes={{ root: classes.rootCard }}>
        <CardContent classes={{ root: classes.rootCardContent }}>
          <img
            id={item.id}
            onClick={handleClickContentCreation}
            src={item.img}
            style={{ width: '100%', height: '100%' }}
            alt=""
          />
        </CardContent>
        <CardActions sx={{ p: 0 }}>
          <Typography style={{ fontSize: '14px' }} variant="body1">
            {item.title}
          </Typography>
        </CardActions>
      </Card>
    ));
  };

  const handleCollaborationDOM = () => {
    return collaborationMockList.map(item => (
      <Card key={item.key} classes={{ root: classes.rootCard }}>
        <CardContent classes={{ root: classes.rootCardContent }}>
          <img
            id={item.id}
            onClick={handleClickContentCreation}
            src={item.img}
            style={{ width: '100%', height: '100%' }}
            alt=""
          />
        </CardContent>
        <CardActions sx={{ p: 0 }}>
          <Typography style={{ fontSize: '14px' }} variant="body1">
            {item.title}
          </Typography>
        </CardActions>
      </Card>
    ));
  };

  const handleLearningCenterContentsDOM = () => {
    return (
      <Box id="learningCenterContents">
        <Box
          id="goBackSupportResources"
          onClick={() => setIsShowLearningCenter(false)}
          sx={{
            display: 'flex',
            color: '#959298',
            mt: '28px',
            mb: '18px',
            cursor: 'pointer',
            alignItems: 'center'
          }}
        >
          <img
            style={{ height: '16px' }}
            src="/images/tutorial/arrowBack.png"
            alt=""
          />
          <Typography sx={{ ml: '8px' }}>
            {t(
              'components.boardTutorial.supportResources.learningCenter'
            )}
          </Typography>
        </Box>
        <Typography variant="h3">
          {t(
            'components.boardTutorial.supportResources.contentCreation.title'
          )}
        </Typography>
        <Box
          id="contentCreation"
          sx={{
            width: '100%',
            flexWrap: 'wrap',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {handleContentCreationDOM()}
        </Box>
        <Divider sx={{ mt: '20px', mb: '20px' }} />
        <Typography variant="h3">
          {t(
            'components.boardTutorial.supportResources.collaboration.title'
          )}
        </Typography>
        <Box
          id="collaboration"
          sx={{
            width: '100%',
            flexWrap: 'wrap',
            display: 'flex',
            justifyContent: 'space-between'
          }}
        >
          {handleCollaborationDOM()}
        </Box>
      </Box>
    );
  };

  const handleSupportResourcesContentsDOM = () => {
    return (
      <Box
        id="supportResourcesContents"
        sx={{ display: 'flex', flexDirection: 'column' }}
      >
        {/* <Typography sx={{ mt: '20px', mb: '10px' }} variant="h3">
          {t('components.boardTutorial.supportResources.learningCenter')}
        </Typography> */}
        <MenuList>
          {/* <MenuItem sx={{ height: '50px' }}>
            <ListItemIcon>
              <svg
                width="12"
                height="20"
                viewBox="0 0 12 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M6.09 4.925L3 3.75L6.09 2.575L7.5 0L8.91 2.575L12 3.75L8.91 4.925L7.5 7.5L6.09 4.925ZM7.5 20L8.91 17.425L12 16.25L8.91 15.075L7.5 12.5L6.09 15.075L3 16.25L6.09 17.425L7.5 20ZM2.055 9.2125L0 10L2.055 10.7875L3 12.5L3.945 10.7875L6 10L3.945 9.2125L3 7.5L2.055 9.2125Z"
                  fill="#150D33"
                />
              </svg>
            </ListItemIcon>
            <ListItemText>
              {t('components.boardTutorial.supportResources.newUpdates')}
            </ListItemText>
          </MenuItem> */}
          <MenuItem onClick={handleOpenTutorial} sx={{ height: '50px' }}>
            <ListItemIcon>
              <svg
                width="18"
                height="20"
                viewBox="0 0 18 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.67286 10.1693L9 10.4523L9.32714 10.1693C11.4838 8.30348 14.3394 7.11896 17.5 7.00548V16.2138C14.252 16.3232 11.2936 17.4945 9.00069 19.3483C6.70676 17.4862 3.74755 16.3224 0.5 16.2137V7.00548C3.66057 7.11896 6.51621 8.30348 8.67286 10.1693ZM8.71749 17.9995L8.99932 18.1925L9.28157 18.0002C11.2838 16.6357 13.608 15.7721 16.0619 15.466L16 14.9698H16.5V8.51972V7.92875L15.9172 8.02663C13.7299 8.39395 11.6948 9.33238 10.0331 10.7678L10.0325 10.7683L9.00129 11.6621L7.96893 10.7603L7.96893 10.7603L7.96686 10.7585C6.30523 9.32309 4.27006 8.38467 2.08281 8.01735L1.5 7.91947V8.51044V14.9606V15.4021L1.93812 15.4567C4.39149 15.7627 6.72538 16.6354 8.71749 17.9995ZM12.5 3.7123C12.5 5.45271 10.9697 6.92459 9 6.92459C7.03034 6.92459 5.5 5.45271 5.5 3.7123C5.5 1.97189 7.03034 0.5 9 0.5C10.9697 0.5 12.5 1.97189 12.5 3.7123ZM11.5 3.7123C11.5 2.38078 10.3403 1.35615 9 1.35615C7.65966 1.35615 6.5 2.38078 6.5 3.7123C6.5 5.04381 7.65966 6.06845 9 6.06845C10.3403 6.06845 11.5 5.04381 11.5 3.7123Z"
                  fill="#150D33"
                  stroke="black"
                />
              </svg>
            </ListItemIcon>
            <ListItemText>
              {t('components.boardTutorial.supportResources.tutorial')}
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => setIsShowLearningCenter(true)}
            sx={{ height: '50px' }}
          >
            <ListItemIcon>
              <svg
                width="18"
                height="18"
                viewBox="0 0 18 18"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M8.75363 5.06731L9.10719 5.42086L9.46074 5.06731L13.8862 0.641849C14.0753 0.452717 14.3797 0.452717 14.5688 0.641849L17.3582 3.43117C17.5473 3.6203 17.5473 3.92467 17.3582 4.1138L12.9425 8.5294L12.589 8.88296L12.9425 9.23651L16.7766 13.0706C17.3502 13.6441 17.3502 14.5793 16.7766 15.1528L14.9039 17.0255C14.4489 17.4806 13.5086 17.7124 12.8217 17.0255L8.98764 13.1914L8.63409 12.8379L8.28053 13.1914L3.97195 17.5H0.5V14.0281L4.79873 9.72932L5.15228 9.37577L4.79873 9.02222L0.964642 5.18813C0.391115 4.6146 0.391115 3.67944 0.964642 3.10592L2.83733 1.23323C3.41086 0.659699 4.34602 0.659699 4.91955 1.23323L8.75363 5.06731ZM1.65619 3.78948L1.3045 4.14303L1.65712 4.49565L5.48135 8.31988L5.83491 8.67343L6.18846 8.31988L8.06115 6.44719L8.4147 6.09363L8.06115 5.74008L6.8784 4.55733L6.52485 4.20378L6.17129 4.55733L5.35195 5.37667L4.66784 4.69256L5.4803 3.87321L5.83087 3.51966L5.47881 3.1676L4.22706 1.91585L3.87258 1.56136L3.51903 1.91679L1.65619 3.78948ZM13.4328 11.8287L13.7864 11.4752L13.4328 11.1216L12.2402 9.92899L11.8867 9.57544L11.5331 9.92899L9.66041 11.8017L9.30686 12.1552L9.66041 12.5088L13.4945 16.3429L13.848 16.6964L14.2016 16.3429L16.0743 14.4702L16.4278 14.1166L16.0743 13.7631L14.8225 12.5113L14.469 12.1578L14.1154 12.5113L13.2961 13.3307L12.6135 12.6481L13.4328 11.8287ZM3.36099 16.5287H3.56809L3.71454 16.3823L13.1864 6.91043L13.54 6.55688L13.1864 6.20333L13.078 6.09491L11.7967 4.81359L11.4431 4.46004L11.0896 4.81359L1.6177 14.2855L1.47125 14.4319V14.639V16.0287V16.5287H1.97125H3.36099ZM12.4793 3.414L12.1257 3.76756L12.4793 4.12111L13.869 5.51084L14.2226 5.8644L14.5761 5.51084L15.9659 4.12111L16.3194 3.76756L15.9659 3.414L14.5761 2.02427L14.2226 1.67072L13.869 2.02427L12.4793 3.414Z"
                  fill="#150D33"
                />
              </svg>
            </ListItemIcon>
            <ListItemText>
              {t(
                'components.boardTutorial.supportResources.contentCreationText'
              )}{' '}
              &{' '}
              {t(
                'components.boardTutorial.supportResources.CollaborationTutorials'
              )}
            </ListItemText>
          </MenuItem>
          <MenuItem onClick={handleOpenShortcutsTips} sx={{ height: '50px' }}>
            <ListItemIcon>
              <svg
                width="20"
                height="20"
                viewBox="0 0 20 20"
                fill="none"
                xmlns="http://www.w3.org/2000/svg"
              >
                <path
                  d="M4.88889 18.1818H8.44444C8.44444 19.1818 7.64444 20 6.66667 20C5.68889 20 4.88889 19.1818 4.88889 18.1818ZM3.11111 17.2727H10.2222V15.4545H3.11111V17.2727ZM13.3333 8.63636C13.3333 12.1091 10.9689 13.9636 9.98222 14.5455H3.35111C2.36444 13.9636 0 12.1091 0 8.63636C0 4.87273 2.98667 1.81818 6.66667 1.81818C10.3467 1.81818 13.3333 4.87273 13.3333 8.63636ZM11.5556 8.63636C11.5556 5.88182 9.36 3.63636 6.66667 3.63636C3.97333 3.63636 1.77778 5.88182 1.77778 8.63636C1.77778 10.8818 3.10222 12.1727 3.86667 12.7273H9.46667C10.2311 12.1727 11.5556 10.8818 11.5556 8.63636ZM17.6622 6.7L16.4444 7.27273L17.6622 7.84545L18.2222 9.09091L18.7822 7.84545L20 7.27273L18.7822 6.7L18.2222 5.45455L17.6622 6.7ZM15.5556 5.45455L16.3911 3.58182L18.2222 2.72727L16.3911 1.87273L15.5556 0L14.72 1.87273L12.8889 2.72727L14.72 3.58182L15.5556 5.45455Z"
                  fill="#150D33"
                />
              </svg>
            </ListItemIcon>
            <ListItemText>
              {t(
                'components.boardTutorial.supportResources.shortcutsTips'
              )}
            </ListItemText>
          </MenuItem>
          <MenuItem
            onClick={() => (window.location.href = 'mailto:support@boardx.us')}
            sx={{ height: '50px' }}
          >
            <ListItemIcon sx={{ml: '-3px'}}>
              <ContactSupportIcon sx={{ color: '#150D33' }} />
            </ListItemIcon>
            <ListItemText sx={{ml: '3px'}}>
              {t(
                'components.boardTutorial.supportResources.contactSupport'
              )}
            </ListItemText>
          </MenuItem>
        </MenuList>
        {/* <Divider /> */}
        {/* 暂时隐藏 */}
        {/* <Typography sx={{ mt: '20px', mb: '10px' }} variant="h3">
          {t('components.boardTutorial.supportResources.getHelp')}
        </Typography>
        <Typography sx={{ mt: '20px', mb: '10px' }} variant="h3">
          {t('components.boardTutorial.supportResources.community')}
        </Typography> */}
      </Box>
    );
  };

  return (
    <Root>
      {/* 一分钟教程 */}
      <Tutorials />
      {/* 支持与资源帮助提示 */}
      <ResourceHelpfulHints />
      {/* 创建StickyNotes提示 */}
      <CreateStickyNotesTips />
      {/* Timer教程 */}
      <TimerTutorials />
      {/* AI教程 */}
      <TutorialsAI />
      <Box
        className={classes.supportResourcesContainer}
        id="supportResourcesContainer"
      >
        <img
          onClick={handleClick}
          src="/images/tutorial/supportResources.png"
          alt=""
          style={{ width: '37px', height: '37px' }}
        />
      </Box>
      <Drawer
        anchor="right"
        open={isOpenDrawer}
        classes={{ root: classes.rootDrawer, paper: classes.paperDrawer }}
        variant="persistent"
      >
        <Box id="titleBox" className={classes.titleBox}>
          {handleDrawerTitle()}
          <svg
            width="14"
            height="14"
            viewBox="0 0 14 14"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            onClick={handleCloseLearningCenter}
            style={{ cursor: 'pointer' }}
          >
            <path
              d="M14 1.41L12.59 0L7 5.59L1.41 0L0 1.41L5.59 7L0 12.59L1.41 14L7 8.41L12.59 14L14 12.59L8.41 7L14 1.41Z"
              fill="#3A3541"
              fillOpacity="0.54"
            />
          </svg>
        </Box>
        {isShowLearningCenter
          ? isShowContentCreation
            ? handleEachContentCreationDOM()
            : handleLearningCenterContentsDOM()
          : handleSupportResourcesContentsDOM()}
      </Drawer>
    </Root>
  );
}
