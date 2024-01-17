import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import Slider from '@mui/material/Slider';
import Typography from '@mui/material/Typography';
import { WidgetService } from '../../../services';
import { useTranslation } from 'react-i18next';
import store from '../../../store';
import { handleSetOpacityValue } from '../../../store/widgets';
import Box from '@mui/material/Box';

export default function ColorOpacity(props) {

  const objectType = props.objectType;
  const opacityValue = props.opacityValue;
  const [initialValue, setInitialValue] = useState(opacityValue)
  const { t } = useTranslation();

  const getOpacityonmouseup = (e) => {
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    /** 
    * Object Fields:
    *
    * 1. backgroundColor: backgroundColor, shapeBackgroundColor
    * 2. fill : fillColor, fontColor, oldShapeBackgroundColor
    * 3. stroke : strokeColor, shapeBorderColor
    * 4. canvas.notesDrawCanvas.freeDrawingBrush.color
    * 5. canvas.freeDrawingBrush.color
  
    * a. WBTitle/WBText: backgroundColor--1, fontColor--2
    * b. WBCircleNote/WBRectNote: backgroundColor--1, fontColor--2
    * c. WBRectNoteDraw: backgroundColor--1, noteDrawColor--4
    * d. WBPath: background--1, fillColor--2, strokeColor--3, drawColor--5
    * e. (OLD New) WBTriangle/WBRectPanel/WBCircle(Shapes): oldShapeBackgroundColor--2, shapeBorderColor--3
    * e. (Stop using) WBTriangle/WBRectPanel/WBCircle(Shapes): shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
    * e. (New)WBShapeNotes:: shapeBackgroundColor--1, shapeBorderColor --3, fontColor--2
    * f. WBArrow: strokeColor--3
    * ----------------------------------------------
    * g. WBPolygon (onClickStandardPolylineArrowColor--color assigned to both stroke & fill) & WBModel:No longer in use.
  
    */
    if (!group) {
      if (objectType === 'shapeBorderColor' || objectType === 'strokeColor') {
        //old and new shape border color opacity
        object.saveData('MODIFIED', ['stroke']);
      }
      if (
        objectType === 'shapeBackgroundColor' ||
        objectType === 'backgroundColor'
      ) {
        //old shapes background color
        object.saveData('MODIFIED', ['backgroundColor']);
      }
      if (
        objectType === 'fillColor' ||
        objectType === 'fontColor' ||
        objectType === 'oldShapeBackgroundColor'
      ) {
        //old shapes background color
        object.saveData('MODIFIED', ['fill']);
      }
    } else {
      group.saveData('MODIFIED', ['backgroundColor', 'fill', 'stroke']);
    }

    canvas.requestRenderAll();
  };

  const onChangeOpacity = (e, newValue) => {
    e.stopPropagation();
    const object = canvas.getActiveObject();
    if (!object) {
      return;
    }

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    const opacityLevelValue = parseInt(newValue);
    setInitialValue(opacityLevelValue);
    store.dispatch(handleSetOpacityValue(opacityLevelValue));

    let rgba_backgroundColor;
    let rgba_fillColor;
    let rgba_strokeColor;

    /**
     * 1. backgroundColor: backgroundColor, shapeBackgroundColor
     * 2. fill : fillColor, fontColor, oldShapeBackgroundColor
     * 3. stroke : strokeColor, shapeBorderColor
     * 4. canvas.notesDrawCanvas.freeDrawingBrush.color
     * 5. canvas.freeDrawingBrush.color
     */
    if (!group) {
      if (objectType === 'shapeBorderColor' || objectType === 'strokeColor') {
        if (object.stroke) {
          if (object.stroke.indexOf('rgb') > -1) {
            rgba_strokeColor = Boardx.Util.rgbaToHex(object.stroke);
          } else {
            rgba_strokeColor = object.stroke;
          }

          rgba_strokeColor = Boardx.Util.hexToRgbA(
            rgba_strokeColor.substring(0, 7),
            opacityLevelValue / 100,
          );

          object.set('stroke', rgba_strokeColor);
        }
      } else if (
        objectType === 'fillColor' ||
        objectType === 'fontColor' ||
        objectType === 'oldShapeBackgroundColor'
      ) {
        if (object.fill) {
          if (object.fill.indexOf('rgb') > -1) {
            rgba_fillColor = Boardx.Util.rgbaToHex(object.fill);
          } else {
            rgba_fillColor = object.fill;
          }

          rgba_fillColor = Boardx.Util.hexToRgbA(
            rgba_fillColor.substring(0, 7),
            opacityLevelValue / 100,
          );

          object.set('fill', rgba_fillColor);
        }
      } else if (
        objectType === 'shapeBackgroundColor' ||
        objectType === 'backgroundColor'
      ) {
        if (object.backgroundColor) {
          if (object.backgroundColor.indexOf('rgb') > -1) {
            rgba_backgroundColor = Boardx.Util.rgbaToHex(
              object.backgroundColor,
            );
          } else {
            rgba_backgroundColor = object.backgroundColor;
          }

          rgba_backgroundColor = Boardx.Util.hexToRgbA(
            rgba_backgroundColor.substring(0, 7),
            opacityLevelValue / 100,
          );

          object.set('backgroundColor', rgba_backgroundColor);
        }
      }
    } else {
      /**
       * if group of items are selected, all color's opacities will be changed accordingly.
       */
      group._objects.forEach(function (obj) {
        if (obj.backgroundColor) {
          if (obj.backgroundColor.indexOf('rgb') > -1) {
            rgba_backgroundColor = Boardx.Util.rgbaToHex(obj.backgroundColor);
          } else {
            rgba_backgroundColor = obj.backgroundColor;
          }

          rgba_backgroundColor = Boardx.Util.hexToRgbA(
            rgba_backgroundColor.substring(0, 7),
            opacityLevelValue / 100,
          );

          obj.set('backgroundColor', rgba_backgroundColor);
        }
        if (obj.fill) {
          if (obj.fill.indexOf('rgb') > -1) {
            rgba_fillColor = Boardx.Util.rgbaToHex(obj.fill);
          } else {
            rgba_fillColor = obj.fill;
          }

          rgba_fillColor = Boardx.Util.hexToRgbA(
            rgba_fillColor.substring(0, 7),
            opacityLevelValue / 100,
          );

          obj.set('fill', rgba_fillColor);
        }

        if (obj.stroke) {
          if (obj.stroke.indexOf('rgb') > -1) {
            rgba_strokeColor = Boardx.Util.rgbaToHex(obj.stroke);
          } else {
            rgba_strokeColor = obj.stroke;
          }

          rgba_strokeColor = Boardx.Util.hexToRgbA(
            rgba_strokeColor.substring(0, 7),
            opacityLevelValue / 100,
          );

          obj.set('stroke', rgba_strokeColor);
        }
      });
    }
  };



  return (
    <Box sx={{
      padding: '0px 20px 8px 16px', '.rail': {
        height: 8,
        borderRadius: 4
      }, 'track': {
        height: 8,
        borderRadius: 4
      }, 'valueLabel': { left: 'calc(-50% + 4px)' },
      '.thumb': {
        height: 24,
        width: 24,
        backgroundColor: '#fff',
        border: '2px solid currentColor',
        '&:focus, &:hover, &$active': {
          boxShadow: 'inherit'
        }
      },
      '.root': {
        color: '#52af77',
        height: 8
      }
    }}>
      <Typography sx={{ marginLeft: '-8px' }} gutterBottom>
        {t('board.contextMenu.opacity')}
      </Typography>
      <Slider
        defaultValue={100}
        aria-label="pretto slider"
        max={100}
        min={0}
        onChange={onChangeOpacity}
        onChangeCommitted={getOpacityonmouseup}
        value={initialValue}
        valueLabelDisplay="auto"
        classes={{
          root: 'root',
          thumb: 'thumb',
          /*active: classes.active,*/
          valueLabel: 'valueLabel',
          track: 'track',
          rail: 'rail'
        }}
      />
    </Box>
  );
}
