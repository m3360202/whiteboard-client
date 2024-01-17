//** Import React
import React from 'react';

import { styled } from '@mui/material/styles';
import { useTheme } from '@mui/material/styles';

//** Import MUI
import CircularProgress from '@mui/material/CircularProgress';


const NotFoundPage = () => {

const theme=useTheme();

  return (
    <div className="page not-found"
      style={{ display: 'flex',
    /*'& > * + *': {
      marginLeft: theme.spacing(2),
    },*/
  }}>
        <CircularProgress
          color="secondary"
          style={{
            position: 'absolute',
            left: '50%',
            top: '50%',
            transform: 'translate(-50%, -50%)',
          }}
        />
      </div>
    
  );
};

export default NotFoundPage;
