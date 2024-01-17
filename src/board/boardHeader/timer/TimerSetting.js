//Import react
import React from 'react';

import { styled } from '@mui/material/styles';

//Import i18n
import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';
import Slider from '@mui/material/Slider';
import Input from '@mui/material/Input';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';


export default function TimerSetting({ handleStart }) {

  const [value, setValue] = React.useState(1);
  const { t } = useTranslation();
  
  const handleSliderChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleInputChange = (event) => {
    setValue(event.target.value === '' ? '' : Number(event.target.value));
  };

  const handleBlur = () => {
    if (value < 0) {
      setValue(0);
    } else if (value > 60) {
      setValue(60);
    }
  };

  return (
    <div>
      <Typography
        sx={{ fontWeight: 500,
          display: 'flex',
          justifyContent: 'space-between',
          fontSize: '28px',
          height: '34px',
          lineHeight: '34px',
          fontStyle: 'normal',
          textAlign: 'left',
          fontFamily: 'Inter',
          letterSpacing: '0em',}}
        gutterBottom
        id="input-slider"
        variant="h2"
      >
        {t('board.header.timer.timer')}
      </Typography>
      <Box sx={{  display: 'flex',
    alignItems: 'center',}}>
        <Slider
          aria-labelledby="input-slider"
          sx={{    color: '#F21D6B',
          margin: '0px 16px 16px 4px',
          width: '120px',}}
          color="primary"
          defaultValue={1}
          max={60}
          min={1}
          onChange={handleSliderChange}
          size="small"
          value={typeof value === 'number' ? value : 0}
        />
        <Input
          sx={{ textAlign: 'center',
          width: 25,
          marginTop: '-15px',}}
          margin="dense"
          onBlur={handleBlur}
          onChange={handleInputChange}
          value={value}
        />
        <Typography sx={{ marginTop: '-10px',}}>
          {t('board.header.timer.timerCountMin')}
        </Typography>
      </Box>
      <Button
        sx={{ display: 'inline-block',}}
        color="primary"
        onClick={() => handleStart(value)}
        size="small"
        variant="contained"
      >
        {t('board.header.timer.start')}
      </Button>
    </div>
  );
}
