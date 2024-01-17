import React from 'react';
import { useDrag } from 'react-dnd';
import Box from '@mui/material/Box';
import {
  StickyNoteSmallSvg,
  StickyNoteLargeSvg,
  StickyNoteCicleSvg,
  ArrowSvg,
} from '../../svg/widgetToolBarMenuSvg';

import { NoteType } from '../../../definition/widget/widgetType';
import store, { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { EventService } from '../../../services';
import EventNames from '../../../util/EventNames';
import { Tooltip } from '@mui/material';
import { useTranslation } from 'react-i18next';
import StickyNotes from '../sticky-notes';
import { useState } from 'react';

const MenuStickyNoteDragItem = () => {
  const { t } = useTranslation();
  const [anchorEl_notes, setAnchorEl_notes] =
    useState(null);
  const color = useSelector(
    (state) => state.widget.stickNote.backgroundColor,
  );
  const noteType = useSelector(
    (state) => state.widget.stickNote.noteType,
  );
  const objType = useSelector(
    (state) => state.widget.stickNote.obj_type,
  );

  function clickToGenerateNotesListener(e) {
    canvas.lastMousePosition = e.pointer;
    canvas.createWidgetatCurrentLocationByType(objType, { color, noteType });
    EventService.getInstance().unregister(
      EventNames.CANVAS_MOUSE_DOWN,
      clickToGenerateNotesListener,
    );
  }

  const [{ isDragging }, drag] = useDrag(() => ({
    item: { type: 'widget' },
    end: (item, monitor) => {
      canvas.createWidgetatCurrentLocationByType(
        store.getState().widget.stickNote.obj_type,
        {
          color: store.getState().widget.stickNote.backgroundColor,
          noteType: store.getState().widget.stickNote.noteType,
        },
      );
    },
    collect: (monitor) => ({
      isDragging: monitor.isDragging(),
      handlerId: monitor.getHandlerId(),
    }),
  }));

  const cursorNote =
    "data:image/svg+xml,%3Csvg width='16' height='16' viewBox='0 0 16 16' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M15.6863 0H0.313719C0.1405 0 0 0.1405 0 0.313719V15.6863C0 15.8595 0.1405 16 0.313719 16H11.5815C11.7548 16 16 11.6732 16 11.5V0.313719C16 0.1405 15.8595 0 15.6863 0ZM13.8977 13.5L12.0252 15.3726L15.3725 12.0252L13.8977 13.5ZM11.5815 14.9288V11.5815H14.9288L11.5815 14.9288ZM15.3726 10.954H11.2677C11.0945 10.954 10.954 11.0945 10.954 11.2677V15.3725H0.627437V0.627437H15.3725L15.3726 10.954Z' fill='%23232930'/%3E%3C/svg%3E";

  const onClickItem = (e) => {
    if (localStorage.getItem('currentUIType') === 'mobile') {
      canvas.createWidgetatCurrentLocationByType(objType, {
        color,
        noteType,
        useCenterOfScreen: true,
      });

      setTimeout(() => {
        canvas.zoomToObject(canvas.getActiveObject());
      }, 300);
    } else {
      // BoardService.getInstance().resetBoardMenuEvents();
      EventService.getInstance().register(
        EventNames.CANVAS_MOUSE_DOWN,
        clickToGenerateNotesListener,
      );
      canvas.hoverCursor = `url("${cursorNote}") 0 0, auto`;
      canvas.defaultCursor = `url("${cursorNote}") 0 0, auto`;
    }
  };

  return (
    <>
      <Tooltip title={t('board.menu.stickyNotes')} placement="top" arrow>
        <Box
          sx={{
            display: 'inline-flex',
            flexDirection: 'row',
            alignItems: 'center',
            width: '80px',
          }}
        >
          <Box
            data-type={objType}
            draggable
            ref={drag}
            sx={{
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            style={{
              width: noteType === NoteType.RECT ? '5rem' : '3rem',
              height: '2.5rem',
            }}
            onClick={onClickItem}
          >
            {noteType === NoteType.RECT && <StickyNoteLargeSvg color={color} />}
            {noteType === NoteType.SQUARE && (
              <StickyNoteSmallSvg color={color} />
            )}
            {noteType === NoteType.CIRCLE && (
              <StickyNoteCicleSvg color={color} />
            )}
          </Box>
          <Box
            sx={{
              display: 'inline-flex',
              flexDirection: 'row',
              alignItems: 'center',
              height: '45px',
            }}
            style={{ cursor: 'pointer', width: '10px' }}
            onClick={(event) => {
              setAnchorEl_notes(event.currentTarget);
            }}
          >
            <ArrowSvg />
          </Box>
        </Box>
      </Tooltip>
      {anchorEl_notes && (
        <StickyNotes
          anchorEl={anchorEl_notes}
          setAnchorEl={setAnchorEl_notes}
        />
      )}
    </>
  );
};

export default MenuStickyNoteDragItem;
