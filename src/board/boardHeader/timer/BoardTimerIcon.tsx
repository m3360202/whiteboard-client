//**Import React */
import React, { useEffect} from 'react';

//**Import i18n */
import { useTranslation } from 'react-i18next';

//**Import Mui */
import { Tooltip } from '@mui/material';
import IconButton from '@mui/material/IconButton';
import TimerIcon from '../../../mui/icons/TimerIcon';

//** Import Redux toolkit
import store, { RootState } from '../../../store';
import { useDispatch } from 'react-redux';
import { handleSetOpenTimerTutorials } from '../../../store/sideBar';
import {
  handleSetTimerLeftTimeMarker,  handleSetTimerIconColorOn,handleSetSelectTimer
} from '../../../store/board/timer';
import { useSelector } from 'react-redux';

export default function BoardTimerIcon() {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  
  const board = useSelector((state: RootState) => state.board.board);
  const selectTimer = useSelector((state: RootState) => state.timer.selectTimer);
  const remoteBoardTimer:any = useSelector((state: RootState) => state.timer.remoteTimer)|| {};

  useEffect(() => {
    return () => {
      store.dispatch(handleSetTimerLeftTimeMarker(0));
    };
  }, []);


  const handleClick = (e) => {
    if (!remoteBoardTimer.timerMode && !selectTimer) {
      //local
      store.dispatch(handleSetSelectTimer(true));

      if (!localStorage.getItem('openTimerTutorials')) {
        dispatch(handleSetOpenTimerTutorials(true));
        localStorage.setItem('openTimerTutorials', 'true');
      }
      return ;
    } else if (selectTimer) {
      //local
      store.dispatch(handleSetSelectTimer(false));

      return ;
    }
  };

  const handleMouseEnter = () => {
    if (store.getState().timer.showTimerPopover) return;
    store.dispatch(handleSetTimerIconColorOn(true));
  };

  const handleMouseLeave = () => {
    if (store.getState().timer.showTimerPopover) return;
    store.dispatch(handleSetTimerIconColorOn(false));
  };

  return (
    <div>
      <Tooltip
        arrow
        placement="bottom"
        title={t('board.header.timer.timer')}
      >
        <IconButton
          color="inherit"
          id="timerMenu"
          onClick={handleClick}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          style={{
            paddingLeft: 12,
            paddingRight: 12,
            width: 50
          }}
        >
          <TimerIcon sx={{ width: '20px', height: '20px' }} />
        </IconButton>
      </Tooltip>
    </div>
  );
}
