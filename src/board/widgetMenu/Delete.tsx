import React from 'react';
import { styled } from '@mui/material/styles';
import LockOpenOutlinedIcon from '@mui/icons-material/LockOpenOutlined';
import { Lock } from '@mui/icons-material';
import ToggleButton from '@mui/material/ToggleButton';
import DeleteOutlinedIcon from '@mui/icons-material/DeleteOutlined';
import showMenu from './ShowMenu';

const PREFIX = 'Delete';

const classes = {
  align: `${PREFIX}-align`,
  deleteButton: `${PREFIX}-deleteButton`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.align}`]: {
    width: '36',
    margin: '8px',
  },

  [`& .${classes.deleteButton}`]: {
    borderRightWidth: 1,
    width: 40,
  }
}));

export default function Delete (props: any) {


  const onDelete = (e) => {
    e.preventDefault();
    const currentObject = canvas.getActiveObject();
    if (currentObject) {
      canvas.removeWidget(currentObject);
    }
    showMenu();
  };

  return (
    <Root>
      <ToggleButton
        aria-label="bold"
        className={classes.deleteButton}
        onClick={onDelete}
        selected={false}
        value="backgroundColor"
        style={{ color: 'black' }}
      >
        <svg
          viewBox="0 0 16 16"
          xmlns="http://www.w3.org/2000/svg"
          strokeWidth="1"
          className="widgetMenuImgSize"
        >
          <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
            <path
              d="M17.25,21H6.75a1.5,1.5,0,0,1-1.5-1.5V6h13.5V19.5A1.5,1.5,0,0,1,17.25,21Z"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M9.75 16.5L9.75 10.5"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M14.25 16.5L14.25 10.5"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M2.25 6L21.75 6"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
            <path
              d="M14.25,3H9.75a1.5,1.5,0,0,0-1.5,1.5V6h7.5V4.5A1.5,1.5,0,0,0,14.25,3Z"
              fill="none"
              stroke="#000000"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="1.5"
            ></path>
          </g>
        </svg>
      </ToggleButton>
    </Root>
  );
}
