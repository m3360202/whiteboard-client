import SvgIcon from '@mui/material/SvgIcon';
import React from 'react';

export default function RedoOutlinedTouchIcon(props) {
  return (
    <SvgIcon {...props} style={{ width: 20, height: 20 }} viewBox="0 0 20 20">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        strokeWidth="1"
        style={{ width: 15, height: 15 }}
      >
        <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
          <path
            d="M23.25 0.748L23.25 8.248 15.75 8.248"
            fill="none"
            stroke={
              props.redoAvailable ? 'rgba(0,0,0,0.54)' : 'rgba(0, 0, 0, 0.3)'
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
          <path
            d="M12,23.248a11.25,11.25,0,1,1,10.6-15"
            fill="none"
            stroke={
              props.redoAvailable ? 'rgba(0,0,0,0.54)' : 'rgba(0, 0, 0, 0.3)'
            }
            strokeLinecap="round"
            strokeLinejoin="round"
            strokeWidth="1.5"
          />
        </g>
      </svg>
    </SvgIcon>
  );
}
