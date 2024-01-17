//** Import React */
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { Draggable } from 'react-beautiful-dnd';

//**Import Redux */
import { useDispatch } from 'react-redux';
import store from '../../../store';
//** Import i18n */
import { useTranslation } from 'react-i18next';

import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import MoreHorizOutlined from '@mui/icons-material/MoreHorizOutlined';
import Divider from '@mui/material/Divider';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';
import Box from '@mui/material/Box';
import ListItemText from '@mui/material/ListItemText';
import { useUpdateBoardByIdMutation } from '../../../redux/BoardAPISlice';
//** Import components */
import SlidesCapture from './SlidesCapture';
import _ from 'lodash';
import { handleSetCurrentSlideIndex } from '../../../store/slides';

const PREFIX = 'SlidesItem';

const classes = {
  root: `${PREFIX}-root`,
  bullet: `${PREFIX}-bullet`,
  title: `${PREFIX}-title`,
  pos: `${PREFIX}-pos`,
  typography: `${PREFIX}-typography`,
  appBar: `${PREFIX}-appBar`,
  appBarShift: `${PREFIX}-appBarShift`,
  hide: `${PREFIX}-hide`,
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  drawerHeader: `${PREFIX}-drawerHeader`,
  content: `${PREFIX}-content`,
  contentShift: `${PREFIX}-contentShift`,
  slide: `${PREFIX}-slide`,
  slideImage: `${PREFIX}-slideImage`,
  deleteButton: `${PREFIX}-deleteButton`,
  slideIndex: `${PREFIX}-slideIndex`,
  slideIndex2Box: `${PREFIX}-slideIndex2Box`,
  slideIndex2: `${PREFIX}-slideIndex2`,
  cardContent: `${PREFIX}-cardContent`,
  menu: `${PREFIX}-menu`
};

const StyledDraggable = styled(Draggable)(({ theme }) => ({
  [`& .${classes.root}`]: {
    width: 240,
    display: 'flex',
    backgroundColor: '#F2F2F3',
    paddingLeft: 4,
    paddingTop: 4,
    paddingRight: 4,
    paddingBottom: 4,
    borderRadius: 0
  },

  [`& .${classes.bullet}`]: {
    display: 'inline-block',
    margin: '0 2px',
    transform: 'scale(0.8)'
  },

  [`& .${classes.title}`]: {
    fontSize: 14,
    flexGrow: 1
  },

  [`& .${classes.pos}`]: {
    marginBottom: 12
  },

  [`& .${classes.typography}`]: {
    padding: theme.spacing(2)
  },

  [`& .${classes.appBar}`]: {
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    zIndex: 100
  },

  [`& .${classes.appBarShift}`]: {
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: drawerWidth
  },

  [`& .${classes.hide}`]: {
    display: 'none'
  },

  [`& .${classes.drawer}`]: {
    width: drawerWidth,
    flexShrink: 0,
    position: 'fixed'
  },

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth,
    zIndex: 100
  },

  [`& .${classes.drawerHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    padding: theme.spacing(0, 1),
    // necessary for content to be below app bar
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    zIndex: 100
  },

  [`& .${classes.content}`]: {
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginRight: -drawerWidth
  },

  [`& .${classes.contentShift}`]: {
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    }),
    marginRight: 0
  },

  [`& .${classes.slide}`]: {
    position: 'relative',
    height: 116,
    background: 'fff',
    cursor: 'pointer',
    border: '0px',
    borderRadius: 8
  },

  [`& .${classes.slideImage}`]: {
    width: '204px',
    height: '116px',
    borderRadius: 8
  },

  [`& .${classes.deleteButton}`]: {
    position: 'absolute',
    top: 3,
    right: 1,
    width: 10,
    height: 10,
    background: 'transparent'
  },

  [`& .${classes.slideIndex}`]: {
    position: 'absolute',
    top: 2,
    left: 2
  },

  [`& .${classes.slideIndex2Box}`]: {
    width: 20
  },

  [`& .${classes.slideIndex2}`]: {
    fontSize: 16,
    top: 12,
    left: 4
  },

  [`& .${classes.cardContent}`]: {
    backgroundColor: '#FFF',
    paddingLeft: 4,
    paddingTop: 4,
    paddingBottom: 4,
    paddingRight: 4,
    borderRadius: 8
  },

  [`& .${classes.menu}`]: {
    position: 'absolute',
    top: 0,
    right: 0,
    cursor: 'pointer',
    color: 'rgb(117, 117, 117)',
    background: 'rgba(255,255,255,0.2)',
    transition: 'all .3s ease-in-out'
  }
}));

const drawerWidth = 240;

function SlidesItem({ id, keyValue, index, src, DraggableId, currentIndex }) {
  const dispatch = useDispatch();

  const [anchorEl, setAnchorEl] = useState(null);
  const open = Boolean(anchorEl);
  const [updateBoardById] = useUpdateBoardByIdMutation();
  const { t } = useTranslation();

  const handleClick = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handelRemoveSlide = e => {
    e.preventDefault();
    e.stopPropagation();

    const key = index;
    const board = store.getState().board.board;
    const { slides } = board;
    const slide = slides[key - 1];
    const newSlides = _.without(slides, slide);
    updateBoardById({ id: board._id, data: { slides: newSlides } });
  };

  const moveSlideToBeginning = e => {
    e.preventDefault();
    e.stopPropagation();
    const key = index;
    const board = store.getState().board.board;
    const { slides } = board;
    const slide = slides[key - 1];
    const newSlides = _.without(slides, slide);
    newSlides.unshift(slide);
    updateBoardById({ id: board._id, data: { slides: newSlides } });
    setAnchorEl(null);
  };
  const getItemStyle = (isDragging, draggableStyle) => ({
    // some basic styles to make the items look a bit nicer
    userSelect: 'none',

    // styles we need to apply on draggables
    ...draggableStyle
  });

  const zoomToSlide = async e => {
    if (!canvas) return;
    if (e.target.tagName === 'IMG') {
      const key = e.currentTarget.dataset.id;
      const board = store.getState().board.board;
      const { slides } = board;
      const slide = slides.filter(r => r.key === key)[0];

      store.dispatch(
        handleSetCurrentSlideIndex(parseInt(e.currentTarget.dataset.index, 10))
      );

      let slideVpt = [];
      let i = 0;
      slide.vpt.map(item => {
        slideVpt.push(item);
        i++;
      });

      canvas.animateToRectForSlide(
        slide.width,
        slide.height,
        slideVpt,
        slide.vpCenter
      );
      canvas.updateViewport();
      canvas.requestRenderAll();
      // dispatch(handleSetShowIcon(true));
    }
  };

  const moveSlideToEnd = e => {
    e.preventDefault();
    e.stopPropagation();
    const key = index;
    const board = store.getState().board.board;
    const { slides } = board;
    const slide = slides[key - 1];
    const newSlides = _.without(slides, slide);
    newSlides.push(slide);
    updateBoardById({ id: board._id, data: { slides: newSlides } });

    setAnchorEl(null);
  };

  const handleSlideIndex2 = () => (currentIndex === index ? '#F21d6b' : '#333');

  return (
    <Draggable draggableId={DraggableId} index={index} key={id}>
      {(provided, snapshot) => (
        <Card
          sx={{
            width: '240px',
            display: 'flex',
            backgroundColor: '#F2F2F3',
            paddingLeft: '4px',
            paddingTop: '4px',
            paddingRight: '4px',
            paddingBottom: '4px',
            borderRadius: 0
          }}
          data-id={keyValue}
          data-index={index}
          id={index}
          key={keyValue}
          onClick={zoomToSlide}
          ref={provided.innerRef}
          {...provided.draggableProps}
          {...provided.dragHandleProps}
          style={getItemStyle(
            snapshot.isDragging,
            provided.draggableProps.style
          )}
        >
          <Box sx={{ width: '20px' }}>
            <span
              style={{
                fontSize: '16px',
                top: '12px',
                left: '4px',
                color: currentIndex === index ? '#F21D6B' : '#333'
              }}
            >
              {index}
            </span>
          </Box>

          <CardContent
            sx={{
              backgroundColor: '#FFF',
              paddingLeft: '4px',
              paddingTop: '4px',
              paddingBottom: '4px',
              paddingRight: '4px',
              borderRadius: '8px'
            }}
          >
            <Box
              sx={{
                position: 'relative',
                height: '116px',
                background: 'fff',
                cursor: 'pointer',
                border: '0px',
                borderRadius: '8px'
              }}
            >
              <img
                style={{
                  width: '204px',
                  height: '116px',
                  borderRadius: '8px'
                }}
                src={src}
              />
              <MoreHorizOutlined
                sx={{
                  position: 'absolute',
                  top: 0,
                  right: 0,
                  cursor: 'pointer',
                  color: 'rgb(117, 117, 117)',
                  background: 'rgba(255,255,255,0.2)',
                  transition: 'all .3s ease-in-out'
                }}
                onClick={handleClick}
              />
              <Menu
                anchorEl={anchorEl}
                keepMounted
                onClose={handleClose}
                open={open}
              >
                <SlidesCapture
                  handleClose={handleClose}
                  index={index - 1}
                  type="insertBefore"
                />
                <SlidesCapture
                  handleClose={handleClose}
                  index={index}
                  type="insertAfter"
                />
                <MenuItem onClick={moveSlideToBeginning}>
                  <ListItemText
                    primary={t('board.header.slides.moveSlideToBeginning')}
                  />
                </MenuItem>
                <MenuItem onClick={moveSlideToEnd}>
                  <ListItemText
                    primary={t('board.header.slides.moveSlideToEnd')}
                  />
                </MenuItem>
                <Divider variant="middle" />
                <MenuItem onClick={handelRemoveSlide}>
                  <ListItemText primary={t('board.header.slides.delete')} />
                </MenuItem>
              </Menu>
            </Box>
          </CardContent>
        </Card>
      )}
    </Draggable>
  );
}

export default React.memo(SlidesItem);
