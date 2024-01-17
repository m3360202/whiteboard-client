import React, { useContext, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles'
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import {
  AntTabs,
  TabPanel,
  AntTab,
  a11yProps
} from '../../mui/components/TabPanelObjects';
import ToggleButton from '@mui/material/ToggleButton';
import MenuPopover from '../../mui/components/MenuPopover';
import { MenuStickyNoteDragItem } from './MenuStickyNoteDragItem';
import {
  BoardService,
  WidgetService,
  DrawingService,
  SlideService,
  UtilityService
} from '../../services';
import showMenu from '../widgetMenu/ShowMenu';
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../store';
import { changeMode } from '../../store/mode';
import {handleSetOpenCreateStickyNoteTips} from '../../store/board'
import { stickyNoteColorSeriesOne } from '../../util/stickynoteColor';
import { handleSetMenuFontWeight } from '../../store/widgets';
import Popover from '@mui/material/Popover';

const PencilIcon = () => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 20 20"
      strokeWidth="1"
      className="menuImgSize"
    >
      <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
        <path
          d="M13.629,23.25H2.25a1.5,1.5,0,0,1-1.5-1.5V2.25A1.5,1.5,0,0,1,2.25.75h19.5a1.5,1.5,0,0,1,1.5,1.5V13.629a1.5,1.5,0,0,1-.439,1.06l-8.122,8.122A1.5,1.5,0,0,1,13.629,23.25Z"
          fill="none"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
        <path
          d="M14.25,23.115V15.75a1.5,1.5,0,0,1,1.5-1.5h7.365"
          fill="none"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
};

export const createStickNote = () => {
  canvas.discardActiveObject();
  const cursorNote =
    "data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.6863 0H0.313719C0.1405 0 0 0.1405 0 0.313719V15.6863C0 15.8595 0.1405 16 0.313719 16H11.5815C11.7548 16 16 11.6732 16 11.5V0.313719C16 0.1405 15.8595 0 15.6863 0ZM13.8977 13.5L12.0252 15.3726L15.3725 12.0252L13.8977 13.5ZM11.5815 14.9288V11.5815H14.9288L11.5815 14.9288ZM15.3726 10.954H11.2677C11.0945 10.954 10.954 11.0945 10.954 11.2677V15.3725H0.627437V0.627437H15.3725L15.3726 10.954Z' fill='%23232930'/%3E%3C/svg%3E";

  DrawingService.getInstance().getReadyToDrawWidget(
    `url("${cursorNote}") 0 0, auto`,
    'WBRectNotes',
    canvas
  );
};

function debounce(func, wait) {
  let timeout;
  return function() {
      const context = this;
      const args = arguments;
      clearTimeout(timeout);
      timeout = setTimeout(() => {
          func.apply(context, args);
      }, wait);
  };
}

export const doubleClickToCreateStickyNote = debounce(async (e) => {

  if (
    localStorage.getItem('is_onboard') === 'true' &&
    !localStorage.getItem('openCreateStickyNoteTips')
  ) {
    store.dispatch(handleSetOpenCreateStickyNoteTips(true));
  }

  if (store.getState().mode.type === 'draw' || store.getState().mode.type === 'line' ||
    canvas.isDrawingMode ||
    (canvas.getActiveObject() && canvas.getActiveObject().obj_type === 'WBFile') ||
    canvas.mouse.moved
  ) {
    return;
  }
  const target = e.target;
  if (
    target &&
    (target.obj_type === 'WBRectNotes' ||
      target.obj_type === 'WBCircleNotes' ||
      target.obj_type === 'WBTextbox' ||
      target.obj_type === 'WBText' ||
      target.obj_type === 'WBShapeNotes' ||
      target.type === 'textbox') &&
    target.editable &&
    !target.isPanel
  ) {
    target.enterEditing();
    return;
  }

  if (
    target &&
    (target.obj_type === 'WBRectNotes' ||
      target.obj_type === 'WBCircleNotes' ||
      target.obj_type === 'WBUrlImage' ||
      target.obj_type === 'WBTextbox' ||
      target.obj_type === 'WBText' ||
      target.obj_type === 'WBShapeNotes') 
  ) {
    return;
  }

  const { defaultNote } = canvas;

  const positionOfClick = e.pointerType ? e.srcEvent : e.e;
  const nextObject = await canvas.getNextObjectByPoint(
    { x: positionOfClick.offsetX, y: positionOfClick.offsetY },
    defaultNote.width * defaultNote.scaleX,
    defaultNote.height * defaultNote.scaleY
  );
  let position = {};
  if (!nextObject) {
    position = canvas.getPositionOnCanvas(
      positionOfClick.offsetX,
      positionOfClick.offsetY
    );
  } else {
    position.left = nextObject.left;
    position.top = nextObject.top;
    defaultNote.width = nextObject.width;
    defaultNote.height = nextObject.height;
    defaultNote.scaleX = nextObject.scaleX;
    defaultNote.scaleY = nextObject.scaleY;
    defaultNote.fontSize = nextObject.fontSize;
    defaultNote.fontFamily = nextObject.fontFamily;
    defaultNote.fontWeight = nextObject.fontWeight;
    defaultNote.textAlign = nextObject.textAlign;
    defaultNote.backgroundColor = nextObject.backgroundColor;
    defaultNote.fill = nextObject.fill;
    defaultNote.obj_type = nextObject.obj_type;
    canvas.changeDefaulNote(defaultNote);
  }
  const note = {
    angle: 0,
    width: defaultNote.width,
    height: defaultNote.height,
    scaleX: defaultNote.scaleX,
    scaleY: defaultNote.scaleY,
    fontSize: defaultNote.fontSize,
    fontWeight: defaultNote.fontWeight,
    fontFamily: defaultNote.fontFamily,
    textAlign: defaultNote.textAlign,
    backgroundColor: defaultNote.backgroundColor,
    fill: defaultNote.fill,
    isDraw: canvas.defaultNote.isDraw,
    obj_type: defaultNote.obj_type,
    emoji: [0, 0, 0, 0, 0],
    selectable: true,
    originX: 'center',
    originY: 'center',
    left: position.left,
    top: position.top,
    text: '',
    userId: store.getState().user.userInfo.userId,
    whiteboardId: store.getState().board.board._id,
    timestamp: Date.now(),
    zIndex: Date.now() * 100
  };
  if (defaultNote.obj_type === 'WBCircleNotes') {
    note.radius = 69;
  }
  note._id = UtilityService.getInstance().generateWidgetID();
  store.dispatch(handleSetMenuFontWeight(note.fontWeight));
  const widget = await canvas.createWidgetAsync(note);
  canvas.add(widget);
  canvas.requestRenderAll();

  widget.index = canvas._objects.length;
  note.isDouble = true;
  note.left = widget.left;
  note.top = widget.top;
  // if (widget.obj_type !== '') await canvas.checkIfBindtoPanelNoSaveData(widget);
   WidgetService.getInstance().insertWidget(widget.getObject());
  const newState = await widget.getUndoRedoState('ADDED');
  canvas.pushNewState(newState);
  canvas.setActiveObject(widget);
  canvas.requestRenderAll();
  if (
    !defaultNote.isDraw &&
    (widget.obj_type === 'WBText' ||
      widget.obj_type === 'WBRectNotes' ||
      widget.obj_type === 'WBCircleNotes') &&
    Boardx.Util.getMobileOperatingSystem() !== 'ios'
  ) {
    widget.enterEditing();
  }
  if (
    Boardx.Util.getMobileOperatingSystem() !== 'ios' &&
    Boardx.Util.getMobileOperatingSystem() !== 'android'
  ) {
    showMenu();
  }
  canvas.requestRenderAll();
}, 100);

export default function CustomizedTabs() {
  const { t } = useTranslation();
  const noteColors = stickyNoteColorSeriesOne.slice(
    0,
    stickyNoteColorSeriesOne.length - 1
  );

  const [value, setValue] = React.useState(0);
  const [open, setOpen] = useState(false);
  const modeType = useSelector((state) => state.mode.type);

  const handleClose = () => {
    setOpen(false);
  };

  const anchEl = document.getElementById('stickNoteBtn');

  return (
    <div>
      <Tooltip title={t('board.menu.stickyNotes')} placement="top" arrow>
        <ToggleButton
          selected={modeType === 'stickNote'}
          value="note"
          data-tut="reactour__note"
          aria-label="note"
          onClick={() => setOpen(!open)}
        >
          <div id="stickNoteBtn" style={{ width: '40px', paddingTop: '7px' }}>
            <PencilIcon />
          </div>
        </ToggleButton>
      </Tooltip>
      <Popover
        open={open}
        anchorEl={anchEl}
        onClose={handleClose}
        anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
        transformOrigin={{ vertical: 275, horizontal: 'center' }}
        sx={{'.divPadding7':{    textAlign: 'end'}}}
      >
        <div style={{ flexGrow: 1,
    width: '280px'}}>
          <div style={{ backgroundColor: theme.palette.background.paper}}>
            <AntTabs
              value={value}
              onChange={(e, idx) => setValue(idx)}
              aria-label="ant example"
            >
              <AntTab label="5X3" {...a11yProps(0)} />
              <AntTab label="3X3" {...a11yProps(1)} />
              <AntTab
                label={t('board.menu.stickyNotesRound')}
                {...a11yProps(2)}
              />
            </AntTabs>
            <div className={'divPadding7'}>
              <TabPanel value={value} index={0} width={260} height={201}>
                {noteColors.map(r => (
                  <MenuStickyNoteDragItem
                    key={r}
                    color={r}
                    objType="WBRectNotes"
                    noteType="rect"
                    handleClose={handleClose}
                  />
                ))}
              </TabPanel>
            </div>
            <div className={'divPadding7'}>
              <TabPanel value={value} index={1} width={260} height={201}>
                {noteColors.map(r => (
                  <MenuStickyNoteDragItem
                    key={r}
                    color={r}
                    objType="WBRectNotes"
                    noteType="square"
                    handleClose={handleClose}
                  />
                ))}
              </TabPanel>
            </div>
            <div className={'divPadding7'}>
              <TabPanel value={value} index={2} width={260} height={201}>
                {noteColors.map(r => (
                  <MenuStickyNoteDragItem
                    key={r}
                    color={r}
                    objType="WBCircleNotes"
                    noteType="circle"
                    handleClose={handleClose}
                  />
                ))}
              </TabPanel>
            </div>
          </div>
        </div>
      </Popover>
    </div>
  );
}
