/* eslint-disable react/jsx-props-no-spreading */

import React from 'react';

export default function ArrowDownIcon(props) {
  const {size} = props
  return (
    <svg
      {...props}
      style={{
        width: size,
        height: size
      }}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 6 6"
    >
      <g transform="matrix(0.25,0,0,0.25,0,0)">
        <path
          d="M23.25,7.311,12.53,18.03a.749.749,0,0,1-1.06,0L.75,7.311"
          fill="none"
          stroke="#000000"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.5"
        />
      </g>
    </svg>
  );
}
