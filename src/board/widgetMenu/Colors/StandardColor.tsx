import React from 'react';
import { styled } from '@mui/material/styles';
import { BoardService, WidgetService } from '../../../services';
import { useTranslation } from 'react-i18next';
import {
  stickyNoteColorSeriesOne,
  stickyNoteColorSeriesTwo,
} from '../../../util/stickynoteColor';
import store from '../../../store';
import { handleSetCursorColorOfPen } from '../../../store/board';
import {
  handleSetObjectWidgetStatusChange,
  handleSetArrowStroke
} from '../../../store/widgets';
import $ from 'jquery';

const PREFIX = 'StandardColor';

const classes = {
  roundColorSelection: `${PREFIX}-roundColorSelection`,
  noColorSelection: `${PREFIX}-noColorSelection`,
  noColor: `${PREFIX}-noColor`,
  selectedCircle: `${PREFIX}-selectedCircle`,
  palette: `${PREFIX}-palette`,
  palette2: `${PREFIX}-palette2`
};

const Root = styled('ul')((
  { theme }
) => ({
  [`& .${classes.roundColorSelection}`]: {
    width: '28px',
    height: '28px',
    margin: '8px',
    position: 'relative',
    borderRadius: '50%',
    border: '1px solid rgba(0,0,0,.15)',
    listStyle: 'none',
    display: 'inline-block'
  },

  [`& .${classes.noColorSelection}`]: {
    width: '28px',
    height: '28px',
    margin: '8px',
    borderRadius: '50%',
    position: 'relative',
    listStyle: 'none',
    backgroundImage:
      "url(\"data:image/svg+xml,%0A%3Csvg width='28' height='28' viewBox='0 0 28 28' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='14' cy='14' r='14' fill='white'/%3E%3Ccircle cx='14' cy='14' r='13.5' stroke='black' strokeOpacity='0.16'/%3E%3Cline x1='4.74703' y1='23.5459' x2='23.747' y2='4.54589' stroke='black' strokeOpacity='0.16'/%3E%3C/svg%3E%0A\")",
    display: 'inline-block'
  },

  [`& .${classes.noColor}`]: {
    backgroundColor: 'rgba(255, 255, 255, .15)',
    top: '50%',
    left: '50%',
    width: '130%',
    height: '130%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #f21d6b',
    borderRadius: '50%',
    display: 'none'
  },

  [`& .${classes.selectedCircle}`]: {
    backgroundColor: 'rgba(255, 255, 255, .15)',
    top: '50%',
    left: '50%',
    width: '130%',
    height: '130%',
    position: 'absolute',
    transform: 'translate(-50%, -50%)',
    border: '2px solid #f21d6b',
    borderRadius: '50%',
    display: 'none'
  },

  [`&.${classes.palette}`]: {
    display: 'inline-block',
    padding: '0px 4px 0px 4px',
    overflow: 'hidden',
    marginBottom: '0px'
  },

  [`& .${classes.palette2}`]: {
    padding: '12px 20px 8px 8px'
  }
}));

export default function StandardColor (props) {

  const { t } = useTranslation();
  const type = props.objectType;
  let opacity = props.opacityValue;
  let colorSelections = [];

  const colorSeries = objectType => {
    if (
      objectType === 'drawColor' ||
      objectType === 'fontColor' ||
      objectType === 'strokeColor'
    ) {
      return stickyNoteColorSeriesTwo.slice(
        0,
        stickyNoteColorSeriesTwo.length - 1
      );
    }

    if (
      objectType === 'backgroundColor' &&
      canvas.getActiveObject().obj_type === 'WBText'
    ) {
      return stickyNoteColorSeriesOne;
    }

    if (
      (objectType === 'shapeBorderColor' &&
        canvas.getActiveObject().obj_type === 'WBShapeNotes') ||
      (objectType === 'backgroundColor' &&
        canvas.getActiveObject().obj_type === 'WBShapeNotes')
    ) {
      return stickyNoteColorSeriesTwo;
    }

    if (canvas.getActiveObject()._objects && canvas.getActiveObject()._objects.length > 1) {
     let noWBShapeNotes = canvas
        .getActiveObject()
        ._objects.filter(item => item.obj_type !== 'WBShapeNotes');

      if (objectType === 'shapeBorderColor' && noWBShapeNotes.length === 0) {
        return stickyNoteColorSeriesTwo;
      }
      if (objectType === 'backgroundColor' && noWBShapeNotes.length === 0) {
        return stickyNoteColorSeriesTwo;
      }
    }

    return stickyNoteColorSeriesOne.slice(
      0,
      stickyNoteColorSeriesOne.length - 1
    );
  };

  const stickyNoteColorSeries = colorSeries(type);

  stickyNoteColorSeries.map((item, index) => {
      colorSelections.push({ _id: index, color: item });
  })

  const setCursorForDrawing = color => {
    const cursorPen = `data:image/svg+xml,%3Csvg width='18' height='20' viewBox='0 0 18 20' fill='none' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M18 14.66C18 14.41 17.9 14.15 17.71 13.96L15.88 12.13L12.13 15.88L13.96 17.71C14.35 18.1 14.98 18.1 15.37 17.71L17.71 15.37C17.91 15.17 18 14.92 18 14.66ZM11.98 11.06L11.06 11.98L2 2.92V2H2.92L11.98 11.06ZM3.75 0L14.81 11.06L11.06 14.81L0 3.75V0L3.75 0Z' style='fill:${color}'/%3E%3Cpath fill-rule='evenodd' clip-rule='evenodd' d='M11.98 11.06L11.06 11.98L2.00001 2.92V2H2.92001L11.98 11.06Z' style='fill:white'/%3E%3C/svg%3E`;
    return `url("${cursorPen}") 0 0, auto`;
  };

  const hexifyColor = colors => {
    if (!colors) return;

    if (colors.slice(0, 1) === '#') {
      return colors.toLocaleUpperCase();
    }

    if (colors === 'rgba(0, 0, 0, 0)') {
      return '#HHHHHH';
    }

    var values = colors
      .replace(/rgba?\(/, '')
      .replace(/\)/, '')
      .replace(/[\s+]/g, '')
      .split(',');
    var a = parseFloat(values[3] || 1),
      r = Math.floor(a * parseInt(values[0]) + (1 - a) * 255),
      g = Math.floor(a * parseInt(values[1]) + (1 - a) * 255),
      b = Math.floor(a * parseInt(values[2]) + (1 - a) * 255);

    var hex =
      '#' +
      ('0' + r.toString(16)).slice(-2) +
      ('0' + g.toString(16)).slice(-2) +
      ('0' + b.toString(16)).slice(-2);

    return hex.toLocaleUpperCase();
  };

  // Function onClickStandardColor()
  //
  // Object Fields:
  //
  // 1. backgroundColor: backgroundColor, shapeBackgroundColor
  // 2. fill : fillColor, fontColor, oldShapeBackgroundColor
  // 3. stroke : strokeColor, shapeBorderColor
  // 4. canvas.notesDrawCanvas.freeDrawingBrush.color
  // 5. canvas.freeDrawingBrush.color

  // a. WBTitle/WBText: backgroundColor--1, fontColor--2
  // b. WBCircleNote/WBRectNote: backgroundColor--1, fontColor--2
  // c. WBRectNoteDraw: backgroundColor--1, noteDrawColor--4
  // d. WBPath: background--1, fillColor--2, strokeColor--3, drawColor--5
  // e. (OLD New) WBTriangle/WBRectPanel/WBCircle(Shapes): oldShapeBackgroundColor--2, shapeBorderColor--3
  // e. (Stop using) WBTriangle/WBRectPanel/WBCircle(Shapes): shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
  // e. (New)WBShapeNotes:: shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
  // f. WBArrow: strokeColor--3
  // ----------------------------------------------
  // g. WBPolygon (onClickStandardPolylineArrowColor--color assigned to both stroke & fill) & WBModel:No longer in use.

  const onClickStandardColor = e => {
    if (type === 'backgroundColor' || type === 'shapeBackgroundColor') {
      // backgroundColor --1
      onClickStandardBackgroundColor(e);
    } else if (
      type === 'fontColor' ||
      type === 'fillColor' ||
      type === 'oldShapeBackgroundColor'
    ) {
      // fill --2
      onClickStandardFillColor(e);
    } else if (type === 'strokeColor' || type === 'shapeBorderColor') {
      // stroke --3
      onClickStandardStrokeColor(e);
    } else if (type === 'noteDrawColor') {
      // canvas.notesDrawCanvas.freeDrawingBrush.color --4
      onClickStandardNoteDrawColor(e);
    } else if (type === 'drawColor') {
      // canvas.freeDrawingBrush.color --5
      onClickStandardDrawColor(e);
    }

    if (store.getState().widgets.objectWidgetStatusChange) {
      store.dispatch(handleSetObjectWidgetStatusChange(false));
    } else {
      store.dispatch(handleSetObjectWidgetStatusChange(true));
    }

    if (type !== 'drawColor') {
      props.clickMe();
    }
  };

  // Color -- 5
  const onClickStandardDrawColor = e => {
    $('.roundColorSelection').children().hide();

    $(e.currentTarget).siblings('.selected').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data('color');
    props.clickMe(inputColor);
    if (inputColor === '#HHH') {
      // abort drawing if color is null
      Boardx.Util.Msg.info(t('board.color.transparentNotAallowed'));
      return;
    }
    if (!opacity) {
      opacity = 100;
    }
    const strokeColor = Boardx.Util.hexToRgbA(inputColor, opacity / 100);
    store.dispatch(handleSetCursorColorOfPen(strokeColor));

    const object = canvas.getActiveObject();
    if (canvas && canvas.freeDrawingBrush) {
      canvas.freeDrawingBrush.color = strokeColor;
    }

    canvas.freeDrawingCursor = setCursorForDrawing(strokeColor);
    canvas.requestRenderAll();
  };

  // Color -- 4
  const onClickStandardNoteDrawColor = e => {
    $('.roundColorSelection').children().hide();

    $(e.currentTarget).siblings('.selected').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data('color');
    if (inputColor === '#HHH') {
      // abort drawing if color is null
      Boardx.Util.Msg.info(t('board.color.transparentNotAallowed'));
      return;
    }
    if (!opacity) {
      opacity = 100;
    }
    const strokeColor = Boardx.Util.hexToRgbA(inputColor, opacity / 100);
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (group) {
      Boardx.Util.Msg.info(t('board.color.forOneStickyNote'));
      return;
    }

    object.set('stroke', strokeColor);
    if (
      canvas &&
      canvas.notesDrawCanvas &&
      canvas.notesDrawCanvas.freeDrawingBrush
    ) {
      canvas.notesDrawCanvas.freeDrawingBrush.color = strokeColor;
    }
    object.saveData('MODIFIED', ['stroke']);

    canvas.requestRenderAll();
  };

  // Color -- 3
  const onClickStandardStrokeColor = e => {
    $('.roundColorSelection').children().hide();

    $(e.currentTarget).siblings('.selected').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data('color');
    let strokeColor;
    if (!opacity) {
      opacity = 100;
    }
    if (inputColor === '#HHH') {
      // abort drawing if color is null
      strokeColor = null;
    } else {
      strokeColor = Boardx.Util.hexToRgbA(inputColor, opacity / 100);
    }

    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      // If only one object is selected
      object.set('stroke', strokeColor);
      object.saveData('MODIFIED', ['stroke']);

      if (object.obj_type === 'WBArrow') {
        store.dispatch(handleSetArrowStroke(strokeColor));
      }
    }

    if (group && group._objects) {
      group._objects.forEach(obj => {
        obj.set('stroke', strokeColor);

        if (obj.obj_type === 'WBArrow') {
          store.dispatch(handleSetArrowStroke(strokeColor));
        }
      });
      group.saveData('MODIFIED', ['stroke']);
    }

    canvas.requestRenderAll();
  };

  // Color -- 2
  const onClickStandardFillColor = e => {
    $(e.currentTarget).siblings('.selected').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    // show and hide the red circle -2
    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data('color');
    let fill;
    if (!opacity) {
      opacity = 100;
    }
    if (inputColor === '#HHH') {
      // abort drawing if color is null
      fill = null;
    } else {
      fill = Boardx.Util.hexToRgbA(inputColor, opacity / 100);
    }
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) {
      group = canvas.getActiveObject();
    }

    if (!group) {
      // if it is single object update
      object.set('fill', fill);
      object.saveData('MODIFIED', ['fill']);
    }

    if (group && group._objects) {
      // if it is group object update
      group._objects.forEach(obj => {
        obj.set('fill', fill);
      });
      group.saveData('MODIFIED', ['fill']);
    }

    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      canvas.getActiveObject().hiddenTextarea.focus();
  };

  // Color -- 1
  const onClickStandardBackgroundColor = e => {
    e.preventDefault();

    $('.roundColorSelection').children().hide();

    $(e.currentTarget).siblings('.selected').removeClass('selected');
    $(e.currentTarget).addClass('selected');

    // show and hide the red circle -2
    $(e.currentTarget).siblings().children().hide();
    $(e.currentTarget).children().show();

    const inputColor = $(e.currentTarget).data('color');
    let backgroundColor;
    if (!opacity) {
      opacity = 100;
    }

    if (inputColor === '#HHH') {
      // abort drawing if color is null
      backgroundColor = null;
    } else {
      backgroundColor = Boardx.Util.hexToRgbA(inputColor, opacity / 100);
    }

    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) {
      // Only one object is selected
      let fontColor;
      if (backgroundColor) {
        if (
          object.fill === '#000' ||
          object.fill === '#000000' ||
          object.fill === 'rgba(0,0,0,1)' ||
          object.fill === 'rgb(0,0,0)' ||
          object.fill.toUpperCase() === '#FFF' ||
          object.fill.toUpperCase() === '#FFFFFF' ||
          object.fill === 'rgba(255,255,255,1)'
        ) {
          fontColor = Boardx.Util.invertColor(inputColor, true);
        } else {
          fontColor = object.fill;
        }
      } else {
        fontColor = 'rgba(0,0,0,1)';
      }
      object.set('backgroundColor', backgroundColor).set('fill', fontColor);
      object.saveData('MODIFIED', ['fill', 'backgroundColor']);

      if (canvas.notesDrawCanvas) {
        canvas.notesDrawCanvas.backgroundColor = backgroundColor;
        canvas.notesDrawCanvas.requestRenderAll();
      }
    }

    if (group && group._objects) {
      group._objects.forEach(obj => {
        let fontColor;
        if (backgroundColor) {
          if (
            object.fill === '#000' ||
            object.fill === '#000000' ||
            object.fill === 'rgba(0,0,0,1)' ||
            object.fill === 'rgb(0,0,0)' ||
            object.fill.toUpperCase() === '#FFF' ||
            object.fill.toUpperCase() === '#FFFFFF' ||
            object.fill === 'rgba(255,255,255,1)'
          ) {
            fontColor = Boardx.Util.invertColor(backgroundColor, true);
          } else {
            fontColor = object.fill;
          }
        } else {
          fontColor = 'rgba(0,0,0,1)';
        }
        obj.set('backgroundColor', backgroundColor).set('fill', fontColor);
      });
      group.saveData('MODIFIED', ['fill', 'backgroundColor']);
    }

    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      setTimeout(() => {
        canvas.getActiveObject().hiddenTextarea.focus();
      }, 100);
  };

  const handleColorSelectionsDOM = () => {
    return colorSelections.map((selection, index) => {
      if (selection.color !== '#HHHHHH') {
        return (
          <li
            className={classes.roundColorSelection}
            data-color={selection.color}
            data-cy={selection.color}
            key={index}
            onClick={onClickStandardColor}
            style={{ backgroundColor: selection.color }}
          >
            <div
              className={classes.selectedCircle}
              style={{
                display:
                  hexifyColor(props.color) === selection.color
                    ? 'block'
                    : 'none'
              }}
            />
          </li>
        );
      }
      return (
        <li
          className={classes.noColorSelection}
          data-color="#HHHHHH"
          data-cy="#HHHHHH"
          key={index}
          onClick={onClickStandardColor}
        >
          <div
            className={classes.noColor}
            style={{
              display:
                hexifyColor(props.color) === selection.color ? 'block' : 'none'
            }}
          />
        </li>
      );
    });
  };

  return (
    <Root
      style={{
        display: 'inline-block',
        padding: '0px 4px 0px 4px',
        overflow: 'hidden',
        marginBottom: '0px',
        width: '200px'
      }}
    >
      {handleColorSelectionsDOM()}
    </Root>
  );
}
