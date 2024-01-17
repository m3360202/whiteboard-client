/* eslint-disable react/jsx-props-no-spreading */

import SvgIcon from '@mui/material/SvgIcon';
import React from 'react';

export default function ArrowShapeIcon(props) {
  return (
    <SvgIcon {...props} viewBox="0 0 24 24">
      <svg
        fill="none"
        height="24"
        viewBox="0 0 24 24"
        width="24"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M3.06649 16.6715L11.8313 16.6715L11.8315 6.59546L19.8314 6.59544"
          stroke="#757575"
          strokeWidth="2"
        />
      </svg>
    </SvgIcon>
  );
}
