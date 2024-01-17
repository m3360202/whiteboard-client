import { useDrag } from 'react-dnd';
import { styled } from '@mui/material/styles';
import React, { useEffect } from 'react';
import TitleIcon from '@mui/icons-material/Title';
import ToggleButton from '@mui/material/ToggleButton';
import { Tooltip } from '@mui/material';
import { BoardService, WidgetService, EventService } from '../../services';
import EventNames from '../../util/EventNames';
import DrawingService from '../../services/DrawingService';
import { useTranslation } from 'react-i18next';
import store from '../../store';
import { handleSetIsPanMode, handleSetBoardPanelClicked, handleSetDrawingEraseMode, handleSetBoardMenuEvents } from '../../store/board';

export const MenuTextDragItem = function MenuTextDragItem({
  name,
  objType,
  fontSize,
  handleClose,
}) {

  const { t } = useTranslation();
  function clickToGenerateTextBoxListener(e) {
    DrawingService.getInstance().drawWBText(canvas, e.pointer);
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_DOWN,
      clickToGenerateTextBoxListener,
    );
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    item: { name, objType, type: 'widget' },
    end: (item, monitor) => {
      handleClose();
      canvas.createWidgetatCurrentLocationByType(item.objType);
      const dropResult = monitor.getDropResult();
      if (item && dropResult) {
        alert(
          `${t('board.filedrop.youDropped')} ${item.name} ${t(
            'board.filedrop.into',
          )} ${dropResult.name}!`,
        );
      }
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const onClickItem = (e) => {
    store.dispatch(handleSetIsPanMode(false));
    store.dispatch(handleSetDrawingEraseMode(false));
    store.dispatch(handleSetBoardPanelClicked(false));
    if (Date.now() - canvas.__lastClickTimeStamp < 500) return;
    canvas.__lastClickTimeStamp = Date.now();
    handleClose();
    BoardService.getInstance().resetBoardMenuEvents();
    EventService.getInstance().register(
      EventNames.CANVAS_MOUSE_DOWN,
      clickToGenerateTextBoxListener,
    );
    canvas.hoverCursor = 'text';
    canvas.defaultCursor = 'text';
    let boardMenuEvents = store.getState().board.boardMenuEvents;
    let newEvent = insertNewEvents(boardMenuEvents, {
      eventName: EventNames.CANVAS_MOUSE_DOWN,
      eventHandler: clickToGenerateTextBoxListener,
    });
    store.dispatch(handleSetBoardMenuEvents(newEvent));
  };
  const rectTextSelected = Boardx.Util.getMenuBarSelected('WBText');
  const [selected, setSelected] = React.useState(false);
  const insertNewEvents = (list, newItem) => {
    let newList = [];
    list.map((item) => {
      newList.push(item);
    });
    newList.push(newItem);
    return newList;
  }
  useEffect(() => {
    const barSelected = Boardx.Util.getMenuBarSelected('WBText');
    setSelected(barSelected);
  }, [rectTextSelected]);

  return (
    <div
      style={{    textAlign: 'center',
      cursor: 'pointer',}}
      data-testid="box-WBTitle"
      data-type={objType}
      draggable
      onClick={onClickItem}
      ref={drag}
      role="Box"
    >
      <Tooltip
        arrow
        placement="top"
        title={t('board.menu.menuTitleText')}
      >
        <div style={{  padding: 14,}}>
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            strokeWidth="1"
            className="menuImgSize svg"
          >
            <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
              <path
                d="M1.5,3.748V3A2.25,2.25,0,0,1,3.75.748h16.5A2.25,2.25,0,0,1,22.5,3v.75"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M12 0.748L12 23.248"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
              <path
                d="M7.5 23.248L16.5 23.248"
                fill="none"
                stroke="#000000"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="1.5"
              />
            </g>
          </svg>
        </div>
      </Tooltip>
    </div>
  );
};
