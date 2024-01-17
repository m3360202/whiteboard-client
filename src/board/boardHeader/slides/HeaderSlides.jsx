//** Import React
import React, { useState, useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { DragDropContext, Droppable } from 'react-beautiful-dnd';

//** Import Redux toolkit
import { useSelector, useDispatch } from 'react-redux';
import {
  handleOpenSlideSideBar,
  handleCloseSideBar
} from '../../../store/sideBar';
import store from '../../../store';
//** Import i18n
import { useTranslation } from 'react-i18next';

import Drawer from '@mui/material/Drawer';
import Divider from '@mui/material/Divider';
import IconButton from '@mui/material/IconButton';
import { Tooltip } from '@mui/material';
import pptxgen from 'pptxgenjs';
import Box from '@mui/material/Box';

//** Import components
import SlidesPresentation from './SlidesPrensentation';
import SlidesCapture from './SlidesCapture';
import SlidesItem from './SlidesItem';
import SlideIcon from '../../../mui/icons/SlideIcon';

import { useUpdateBoardByIdMutation } from '../../../redux/BoardAPISlice';
import { handleSetSlidesMode, handleSetSlides } from '../../../store/slides';
import $ from 'jquery';

const PREFIX = 'HeaderSlides';

const classes = {
  root: `${PREFIX}-root`,
  bullet: `${PREFIX}-bullet`,
  title: `${PREFIX}-title`,
  pos: `${PREFIX}-pos`,
  typography: `${PREFIX}-typography`,
  appBar: `${PREFIX}-appBar`,
  appBarShift: `${PREFIX}-appBarShift`,
  hide: `${PREFIX}-hide`,
  slidesIconImg: `${PREFIX}-slidesIconImg`,
  drawer: `${PREFIX}-drawer`,
  drawerPaper: `${PREFIX}-drawerPaper`,
  drawerHeaderBox: `${PREFIX}-drawerHeaderBox`,
  drawerHeader: `${PREFIX}-drawerHeader`,
  slidesIntroIconBox: `${PREFIX}-slidesIntroIconBox`,
  slidesIntroIcon: `${PREFIX}-slidesIntroIcon`,
  droppable: `${PREFIX}-droppable`,
  content: `${PREFIX}-content`,
  contentShift: `${PREFIX}-contentShift`,
  slides: `${PREFIX}-slides`,
  img: `${PREFIX}-img`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root}`]: {
    minWidth: 275,
    display: 'flex',
    paddingBottom: 5
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

  [`& .${classes.slidesIconImg}`]: {
    paddingLeft: 12,
    paddingRight: 12,
    width: 50,
    '& .iconImg': {
      fontSize: '1.7142857142857142rem',
      width: '1em',
      height: '1em'
    }
  },

  [`& .${classes.drawer}`]: {
    width: drawerWidth,
    flexShrink: 0,
    position: 'fixed',
    zIndex: 100
  },

  [`& .${classes.drawerPaper}`]: {
    width: drawerWidth
  },

  [`& .${classes.drawerHeaderBox}`]: {
    display: 'flex',
    position: 'fixed',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: 245,
    background: '#fff',
    zIndex: '999'
  },

  [`& .${classes.drawerHeader}`]: {
    display: 'flex',
    alignItems: 'center',
    ...theme.mixins.toolbar,
    justifyContent: 'flex-start',
    zIndex: 100,
    height: 48
  },

  [`& .${classes.slidesIntroIconBox}`]: {
    paddingLeft: 8,
    position: 'fixed',
    top: 48
  },

  [`& .${classes.slidesIntroIcon}`]: {
    height: 125,
    width: 222
  },

  [`& .${classes.droppable}`]: {
    padding: 0
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

  [`& .${classes.slides}`]: {
    overflowY: 'scroll',
    marginTop: 48,
    //position: 'fixed',
    overflowX: 'hidden'
    //height: '100%',
  },

  [`& .${classes.img}`]: {
    display: 'block',
    overflow: 'hidden',
    width: '100%',
    height: '100%'
  }
}));

const drawerWidth = 270;

// a little function to help us with reordering the result
const reorder = (list, startIndex, endIndex) => {
  const result = Array.from(list);
  const [removed] = result.splice(startIndex - 1, 1);
  result.splice(endIndex - 1, 0, removed);
  return result;
};

const getListStyle = isDraggingOver => ({
  background: isDraggingOver ? 'lightblue' : 'lightgrey',
  width: 270
});

function Slides() {
  //use

  const dispatch = useDispatch();
  const [updateBoardById] = useUpdateBoardByIdMutation();
  const { t } = useTranslation();
  
  //slide dom
  const slideMode =
    useSelector((state) => state.mode.type) === 'slide'
      ? true
      : false;
  const slideSideOpen = useSelector((state) => state.slides.slidesMode);

  const slideSideBar = useSelector(
    (state) => state.sideBar.slideSideBar
  );
  const board = useSelector((state) => state.board.board);
  const slidesEmpty = !board || !board.slides || board.slides.length === 0;
  const [openSlides, setOpenSlides] = useState(0);

  const currentIndex = useSelector((state) => state.slides.currentSlideIndex);

  const slides = useSelector((state) => state.slides.slides);

  const [slidesList, setSlidesList] = useState([]);
  //copy slides to emutable list for slidesList

  useEffect(() => {
    if (!board) return;
    let slidesTemp = [];
    slides.forEach(slide => {
      slidesTemp.push({ ...slide });
    });
    setSlidesList(slidesTemp);
  }, [slides]);

  // data source from Store to React
  const slidesMode = useSelector((state) => state.slides.slidesMode);

  const onDragEnd = result => {
    // dropped outside the list
    if (!result.destination) {
      return;
    }

    const items = reorder(
      slidesList,
      result.source.index,
      result.destination.index
    );

    for (let i = 0; i < items.length; i++) {
      items[i].index = i;
    }
    updateBoardById({
      id: store.getState().board.boardId,
      data: { slides: items }
    });
  };

  const downloadSlide = () => {
    let pptx = null;
    const zoom = canvas.getZoom();

    canvas.setZoom(1);
    pptx = new pptxgen();
    canvas.showBackgroundDots=false;
    canvas.backgroundColor="#fff";
    canvas.requestRenderAll();

    if (!slides || slides.length == 0) return;
    $('#loader').show();
    for (const sl of slides) {
      const data = canvas.toDataURL({
        left:
          (sl.vpCenter.x - sl.width / sl.vpt[0] / 2) * canvas.getZoom() -
          canvas.getPositionOnCanvas(0, 0).left * canvas.getZoom(),
        top:
          (sl.vpCenter.y - sl.height / sl.vpt[0] / 2) * canvas.getZoom() -
          canvas.getPositionOnCanvas(0, 0).top * canvas.getZoom(),
        width: (sl.width / sl.vpt[0]) * canvas.getZoom(),
        height: (sl.height / sl.vpt[0]) * canvas.getZoom(),
        multiplier: sl.vpt[0] < 0.3 ? 2 : 3
      });
      pptx.addSlide().background = { data };
    }
    canvas.showBackgroundDots=true;
    canvas.setZoom(zoom);
    pptx.writeFile({ fileName: document.title });
    $('#loader').hide();
  };

  const handleClick = e => {
    e.preventDefault();
    if (!slideSideBar) {
      dispatch(handleSetSlidesMode(true));
      dispatch(handleOpenSlideSideBar(true));
      setOpenSlides(1);
    } else {
      dispatch(handleCloseSideBar(true));
      setOpenSlides(2);
      setTimeout(() => {
        dispatch(handleSetSlidesMode(false));
      }, 1000)
    }
  };

  const handleDrawerClose = () => {

    dispatch(handleCloseSideBar(true));
    canvas.unlockObjectsInCanvas();
    setOpenSlides(2);
    setTimeout(() => {
      dispatch(handleSetSlidesMode(false));
    }, 1000)
  };

  const handleMouseEnter = () => {
    if (slidesMode) return;
  };

  const handleMouseLeave = () => {
   
  };
  useEffect(() => {

    if (slideSideOpen == true) {
      dispatch(handleOpenSlideSideBar(true));
      setOpenSlides(1);
    }
  }, [slideSideOpen])

  useEffect(() => {
    return () => {
      dispatch(handleCloseSideBar(true));
      setOpenSlides(2);
      setTimeout(() => {
        dispatch(handleSetSlidesMode(false));
      }, 1000)
    }
  }, []);
  const handleIconBjImage = () => {
    if (slidesMode) {
      return "url(\"data:image/svg+xml,%0A%3Csvg width='27.42' height='27.42' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='21' r='1' fill='rgb(242,29,107)'/%3E%3Cpath d='M4 7H20V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z' stroke='rgb(242,29,107)' strokewidth='2'/%3E%3Crect x='1' y='3' width='22' height='2' fill='rgb(242,29,107)'/%3E%3Cpath d='M10 16V9L15 12.5L10 16Z' fill='rgb(242,29,107)'/%3E%3C/svg%3E%0A\")";
    }
    return "url(\"data:image/svg+xml,%0A%3Csvg width='27.42' height='27.42' viewBox='0 0 24 24' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='12' cy='21' r='1' fill='rgba(0,0,0,0.54)'/%3E%3Cpath d='M4 7H20V17C20 18.1046 19.1046 19 18 19H6C4.89543 19 4 18.1046 4 17V7Z' stroke='rgba(0,0,0,0.54)' strokewidth='2'/%3E%3Crect x='1' y='3' width='22' height='2' fill='rgba(0,0,0,0.54)'/%3E%3Cpath d='M10 16V9L15 12.5L10 16Z' fill='rgba(0,0,0,0.54)'/%3E%3C/svg%3E%0A\")";
  };

  const handleSlidesIntroIconDOM = () => {
    if (slidesEmpty) {
      return (
        <div className={classes.slidesIntroIconBox}>
          <img
            alt="emptySlide"
            className={classes.slidesIntroIcon}
            src={slides_intro_icon}
          />
        </div>
      );
    }
    return null;
  };

  const handleSlidesContainerDOM = () => {
    if (!slidesEmpty) {
      return (
        <div className={classes.slides} id="slidesContainer">
          <DragDropContext onDragEnd={onDragEnd}>
            <Droppable className={classes.droppable} droppableId="droppable">
              {(provided, snapshot) => (
                <div
                  {...provided.droppableProps}
                  ref={provided.innerRef}
                  style={getListStyle(snapshot.isDraggingOver)}
                >
                  {(slidesList || []).map((r, index) => (
                    <SlidesItem
                      DraggableId={r.key}
                      currentIndex={currentIndex}
                      index={index + 1}
                      key={r.key}
                      keyValue={r.key}
                      src={r.src}
                      id={index + 1}
                    />
                  ))}
                </div>
              )}
            </Droppable>
          </DragDropContext>
        </div>
      );
    }
    return null;
  };

  const slides_intro_icon = `/boardfiles/${t(
    'board.header.slides.slidesIntro'
  )}`;
  const id = slidesMode ? 'slides-popover' : undefined;

  const renderSlide = () => {
    if (openSlides === 1) {
      return (<Drawer
        anchor="right"
        className={classes.drawer}
        classes={{ paper: classes.drawerPaper }}
        open={slideSideBar}
        variant="persistent"
      >
        <div>
          <div className={classes.drawerHeaderBox}>
            <div className={classes.drawerHeader}>
              <SlidesPresentation />
              <SlidesCapture
                index={-1}
                type="default"
                openSlides={openSlides} />
              <Tooltip
                arrow
                placement="bottom"
                title={t('board.header.slides.slidesDownload')}
              >
                <IconButton
                  onClick={() => {
                    downloadSlide();
                  }}
                  size="large"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    version="1.1"
                    id="Layer_1"
                    x="0px"
                    y="0px"
                    viewBox="0 0 32 32"
                    enableBackground="new 0 0 32 32"
                    className="menuImgSize"
                  >
                    <image
                      id="image0"
                      width="32"
                      height="32"
                      x="0"
                      y="0"
                      href="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAACAAAAAgCAQAAADZc7J/AAAABGdBTUEAALGPC/xhBQAAACBjSFJN AAB6JgAAgIQAAPoAAACA6AAAdTAAAOpgAAA6mAAAF3CculE8AAAAAmJLR0QA/4ePzL8AAAAJcEhZ cwAACxMAAAsTAQCanBgAAAAHdElNRQfmBBUHHTk7qKHDAAAAwklEQVRIx+2TPQ6CQBCFPziBmrjR w+gRPIKdV9DEzoNRbUewkcJ7sI0W5FkgP4kKLHSGmW6y75t9s7MwRVdY7DiAUPuBcOwVJ8DfAiwJ 5qNqSPpuZYxI34hyEw0pIu4HWHJD3FlXgLKy6musRgj5y5sIoSHy2nWR6ZehNmZuOxC/5Rbb/uMN DtfSXShAQODrrwIQ4oDZIPkCyEKuwH4Q4AAksEM8ODL37H7iSc4G4EJePZhP5pxL3pYI5yXOiIru U8ALB9l6VnOHV3QAAAAldEVYdGRhdGU6Y3JlYXRlADIwMjItMDQtMjFUMDc6Mjk6NTcrMDA6MDDl vQd/AAAAJXRFWHRkYXRlOm1vZGlmeQAyMDIyLTA0LTIxVDA3OjI5OjU3KzAwOjAwlOC/wwAAAABJ RU5ErkJggg=="
                    />
                  </svg>
                </IconButton>
              </Tooltip>
            </div>

            <Tooltip
              arrow
              placement="bottom"
              title={t('board.header.slides.slidesClose')}
            >
              <IconButton onClick={handleDrawerClose} size="large">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox="0 0 24 24"
                  strokeWidth="1"
                  className="menuImgSize"
                >
                  <g transform="matrix(1,0,0,1,0,0)">
                    <path
                      d="M0.75 23.249L23.25 0.749"
                      fill="none"
                      stroke="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                    <path
                      d="M23.25 23.249L0.75 0.749"
                      fill="none"
                      stroke="#000000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="1.5"
                    />
                  </g>
                </svg>
              </IconButton>
            </Tooltip>
          </div>
          <Divider />

          {handleSlidesIntroIconDOM()}
          {handleSlidesContainerDOM()}
        </div>
      </Drawer>
      );
    } else { return null; }
  };

  return (
    <Root>
      <Box
      >
        <Tooltip
          arrow
          placement="bottom"
          title={t('board.header.slides.slides')}
        >
          <IconButton
            aria-describedby={id}
            aria-label="show 17 new notifications"
            className={classes.slidesIconImg}
            color="inherit"
            onClick={handleClick}
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
          >
            <SlideIcon sx={{ width: '20px', height: '20px' }} />
          </IconButton>
        </Tooltip>

        {renderSlide()}
      </Box>
    </Root>
  );
}


export default React.memo(Slides);