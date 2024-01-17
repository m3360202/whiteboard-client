// Import dependencies
import React, { useRef, useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import store, { RootState } from '../../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetAiToolBar } from '../../../../store/domArea';
import PropTypes from 'prop-types';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import LoadingButton from '@mui/lab/LoadingButton';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Slider from '@mui/material/Slider';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import KeyboardArrowDownIcon from '@mui/icons-material/KeyboardArrowDown';
import MenuItem from '@mui/material/MenuItem';
 

const PREFIX = 'CustomCommand';

const classes = {
  titleText: `${PREFIX}-titleText`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  submitBtn: `${PREFIX}-submitBtn`,
  select: `${PREFIX}-select`,
  sliderThumb: `${PREFIX}-sliderThumb`,
  sliderTrack: `${PREFIX}-sliderTrack`,
  sliderRail: `${PREFIX}-sliderRail`,
  sliderRoot: `${PREFIX}-sliderRoot`,
  gptModelMenuRoot: `${PREFIX}-gptModelMenuRoot`,
  gptModelMenuSelect: `${PREFIX}-gptModelMenuSelect`,
  menuItemRoot3: `${PREFIX}-menuItemRoot3`,
  gptModelMenuSelectIcon: `${PREFIX}-gptModelMenuSelectIcon`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.titleText}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '16px',
    color: '#232930',
    marginBottom: '8px'
  },

  [`& .${classes.textFieldRoot}`]: {
    '& .MuiInputBase-root': {
      padding: 0
    },
    '& .MuiInputBase-input': {
      padding: '10px 12px',
      fontWeight: 400,
      fontSize: '12px',
      lineHeight: '15px'
    }
  },

  [`& .${classes.submitBtn}`]: {
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.46px',
    marginTop: '30px'
  },

  [`& .${classes.select}`]: {
    padding: '8px 17px',
    fontSize: '14px',
    border: '1px solid #908EA5',
    borderRadius: '6px'
  },

  [`& .${classes.sliderThumb}`]: {
    color: '#F21D6B'
  },

  [`& .${classes.sliderTrack}`]: {
    color: '#F21D6B',
    height: '4px !important',
    border: 'none'
  },

  [`& .${classes.sliderRail}`]: {
    color: '#beccf8'
  },

  [`& .${classes.sliderRoot}`]: {
    width: '200px',
    marginLeft: '16px'
  },

  [`& .${classes.gptModelMenuRoot}`]: {
    margin: '0px 10px 10px 0px',
    '& .MuiOutlinedInput-notchedOutline': {
      display: 'none'
    }
  },

  [`& .${classes.gptModelMenuSelect}`]: {
    padding: 0,
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '13px',
    color: 'rgba(35, 41, 48, 0.65)',
    marginLeft: '10px'
  },

  [`& .${classes.menuItemRoot3}`]: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '13px'
  },

  [`& .${classes.gptModelMenuSelectIcon}`]: {
    color: 'rgba(35, 41, 48, 0.65)'
  }
}));

const CustomCommand = ({ handleCommand, gptModel, setGptModel }) => {

  const dispatch = useDispatch();
  const usePrompt: any = useRef('');
  const { t } = useTranslation();
  const [temperatureNum, setTemperatureNum] = React.useState(0.7);
  const [IsBrainstorming, setIsBrainstorming] = useState(false);
  const [submitBtnLoading, setSubmitBtnLoading] = useState(false);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const boardId = useSelector((state: RootState) => state.board.boardId);

  useEffect(() => {
    if (localStorage.getItem('userCustomAICommand')) {
      const userCustomAICommand = JSON.parse(
        localStorage.getItem('userCustomAICommand')
      );
      if (
        userCustomAICommand.userId === store.getState().user.userInfo.userId &&
        userCustomAICommand.boardId === boardId
      ) {
        usePrompt.current.value = userCustomAICommand.command.split(':')[0];
        setTemperatureNum(userCustomAICommand.temperature);
        setIsBrainstorming(userCustomAICommand.IsBrainstorming);
      }
    }
  }, []);

  const handleClickSubmit = () => {
    const prompt = usePrompt.current.value;
    const commandData = {
      type: 'custom',
      command: `${prompt}: Content: {input} Ideas`,
      temperature: temperatureNum
    };

    localStorage.setItem(
      'userCustomAICommand',
      JSON.stringify({
        ...commandData,
        userId: store.getState().user.userInfo.userId,
        IsBrainstorming,
        createdAt: new Date().getTime(),
        boardId: boardId
      })
    );

    if (IsBrainstorming) {
      canvas.AIDiverge(commandData);
    } else {
      canvas.AIConverge(commandData);
    }
  };

  const mouseEnter = () => {
    console.log('mouseEnter');
    dispatch(handleSetAiToolBar(true));
  };

  const mouseLeave = () => {
    console.log('mouseout');
    dispatch(handleSetAiToolBar(false));
  };

  const handleChangeGptModel = async e => {
    setGptModel(e.target.value);
    localStorage.setItem('gptModel', e.target.value);
    Boardx.Util.Msg.success(t('chatAi.changeGPTModelSuccessfully'));
  };

  return (
    <StyledBox>
      <Box>
        <Box sx={{ mt: '16px' }}>
          <FormGroup>
            <FormControlLabel
              control={
                <Checkbox
                  checked={IsBrainstorming}
                  onChange={e => setIsBrainstorming(e.target.checked)}
                />
              }
              label={t('widgetAi.isItForBrainstorming')}
            />
          </FormGroup>
        </Box>
        <Box sx={{ mt: '16px', display: 'flex', alignItems: 'center' }}>
          <Typography className={classes.titleText}>
            {t('widgetAi.creativity')}
          </Typography>
          <Slider
            id="temperatureSlider"
            onChange={(event: any, newValue) => {
              setTemperatureNum(event.target.value);
            }}
            classes={{
              root: classes.sliderRoot,
              thumb: classes.sliderThumb,
              track: classes.sliderTrack,
              rail: classes.sliderRail
            }}
            max={1}
            defaultValue={0.7}
            value={temperatureNum ? temperatureNum : 0}
            min={0}
            aria-label="Default"
            valueLabelDisplay="auto"
            step={0.01}
          />
        </Box>
        <Box
          sx={{ mt: '16px' }}
          onMouseEnter={mouseEnter}
          onMouseLeave={mouseLeave}
        >
          <Typography className={classes.titleText}>
            {t('widgetAi.prompt')}
          </Typography>
          <TextField
            multiline
            rows={16}
            classes={{ root: classes.textFieldRoot }}
            id="prompt"
            inputRef={usePrompt}
            placeholder={t('widgetAi.inputYourPrompt')}
            type="text"
            variant="outlined"
            fullWidth
          />
        </Box>
      </Box>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          alignItems: 'flex-end'
        }}
      >
        <Select
          id="changeGPTModelBtn"
          IconComponent={KeyboardArrowDownIcon}
          value={gptModel}
          onChange={handleChangeGptModel}
          classes={{
            select: classes.gptModelMenuSelect,
            icon: classes.gptModelMenuSelectIcon
          }}
          className={classes.gptModelMenuRoot}
        >
          <MenuItem
            classes={{ root: classes.menuItemRoot3 }}
            value="gpt-3.5-turbo"
          >
            gpt-3.5
          </MenuItem>
          {userInfo.status == 'pro' && <MenuItem classes={{ root: classes.menuItemRoot3 }} value="gpt-4">
            gpt-4
          </MenuItem>}
        </Select>
        <LoadingButton
          loading={submitBtnLoading}
          onClick={handleClickSubmit}
          className={classes.submitBtn}
          variant="contained"
        >
          {t('widgetAi.run')}
        </LoadingButton>
      </Box>
    </StyledBox>
  );
};

CustomCommand.propTypes = {
  handleCommand: PropTypes.func.isRequired,
  gptModel: PropTypes.string.isRequired,
  setGptModel: PropTypes.func.isRequired
};

export default CustomCommand;
