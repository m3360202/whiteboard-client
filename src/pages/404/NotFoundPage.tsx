//** Import react
import React from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

//** Import Mui
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';

function NotFound() {

  const history = useHistory();

  return (
    <Box sx={{
      height: '100%',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    }}>
      <Box sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center'
      }}>
        <Typography sx={{
          letterSpacing: '-1.5px',
          fontWeight: 500,
          fontSize: '96px',
          lineHeight: '112px',
          color: 'rgba(58, 53, 65, 0.87)'
        }}>404</Typography>
        <Typography style={{
          fontWeight: 600,
          fontSize: '24px',
          lineHeight: '133.4%',
          color: 'rgba(58, 53, 65, 0.87)',
          margin: '10px 0px'
        }}>Page Not Found</Typography>
        <Typography style={{
          letterSpacing: '0.15px',
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '20px',
          color: 'rgba(58, 53, 65, 0.68)'
        }}>
          we couldn't find the page you are looking for
        </Typography>
        <Button
          onClick={() => history.push('/recent')}
          variant="contained"
          sx={{
            padding: '7px 22px',
            boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
            borderRadius: '5px',
            background: '#F21D6B !important',
            letterSpacing: '0.4px',
            textTransform: 'uppercase',
            fontWeight: 500,
            fontSize: '14px',
            lineHeight: '24px',
            marginTop: '64px'
          }}
        >
          Back To Home
        </Button>
      </Box>
    </Box>
  );
}

export default NotFound;
