import React from 'react';
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';
import FormatBoldIcon from '@mui/icons-material/FormatBold';
import { WidgetService } from '../../services';
import store from '../../store';
import { handleSetMenuFontWeight } from '../../store/widgets';

export default function FontWeight({ fontWeight, paddingLeft, paddingRight }) {

  const [anchorEl, setAnchorEl] = React.useState(null);

  const changeFontWeight = (object, group, fontWeight) => {
    if (!group) {
      object.set('fontWeight', fontWeight);
      object.saveData('MODIFIED', ['fontWeight']);
      store.dispatch(handleSetMenuFontWeight(fontWeight));
    } else {
      group._objects.forEach(obj => {
        obj.set('fontWeight', fontWeight);
      });
      group.saveData('MODIFIED', ['fontWeight']);
      store.dispatch(handleSetMenuFontWeight(fontWeight));
    }
  };

  const handleClick = event => {
    event.preventDefault();
    const object = canvas.getActiveObject();
    let curFtWeight;

    let group = null;
    if (canvas.getActiveObjects().length > 1) group = canvas.getActiveObject();

    if (!group) curFtWeight = object.fontWeight;
    else curFtWeight = canvas.getActiveObject()._objects[1].fontWeight;

    if (curFtWeight !== 700) {
      fontWeight = 700;
    } else {
      fontWeight = 400;
    }

    changeFontWeight(object, group, fontWeight);

    canvas.requestRenderAll();
    if (canvas.getActiveObject().hiddenTextarea)
      setTimeout(() => {
        canvas.getActiveObject().hiddenTextarea.focus();
      }, 100);
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <div
      className={'customClass'}
      style={{ paddingLeft, paddingRight }}
      onClick={handleClick}
    >
      <ToggleButton
        aria-controls="font-weight"
        aria-haspopup="true"
      sx={{borderRightWidth: 0,
      // width: 40,
      paddingLeft: 0,
      paddingRight: 0,
      height: 44,
      // padding: 8,
      fontWeight: 'bold',}}
        data-cy="FontSize"
        value="fontWeight"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 16 16"
          strokeWidth={1}
          className="widgetMenuImgSize"
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <path
              d="M3.75,23.248H13.5a6.75,6.75,0,0,0,0-13.5h.75a4.5,4.5,0,1,0,0-9H3.75"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={fontWeight === 400 ? 1.5 : 3}
            />
            <path
              d="M6.75 0.748L6.75 23.248"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={fontWeight === 400 ? 1.5 : 3}
            />
            <path
              d="M13.5 9.748L6.75 9.748"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={fontWeight === 400 ? 1.5 : 3}
            />
          </g>
        </svg>
      </ToggleButton>
    </div>
  );
}
