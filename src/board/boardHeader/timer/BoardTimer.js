//**Import React */
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//**Import i18n */

import { useTranslation } from 'react-i18next';

import Typography from '@mui/material/Typography';
import Popper from '@mui/material/Popper';
import Popover from '@mui/material/Popover';
import TimerSetting from './TimerSetting';
import TimerUI from './TimerUI';

//**Import Service */
import { BoardService } from '../../../services';

//** Import Redux toolkit
import store, { RootState } from '../../../store';

import {
  handleSetTimerLeftTimeMarker,
  handleSetTimerProgressMarker,
  handleSetIsMusicOn,
  handleSetShowTimerPopover,
  handleSetTimerOutReminder,
  handleSetSelectTimer,
  handleSetAudio,
  handleSetTimerStaus,
  handleSetTimerStartTime,
  handleSetPauseTime,
} from '../../../store/board/timer';
import { useSelector } from 'react-redux';

//计数器
let timerIntervalHandle = null;
let timeTemp = 0;

export default function BoardTimer() {

  const { t } = useTranslation();

  //board timer store
  const board = useSelector((state) => state.board.board);
  const currentBoardTimer = useSelector((state) => state.timer);
  const remoteBoardTimer = useSelector((state) => state.timer.remoteTimer) || {};
  //ui hooks
  const [showCancel, setShowCancel] = useState(false);
  const [pause, setPause] = useState(false);
  const [recoverPause, setRecoverPause] = useState(false);

  //timer action store
  const musicOn = useSelector((state) => state.timer.isMusicOn);
  const leftTime = currentBoardTimer.timerLeftTimeMarker;
  const progress = useSelector((state) => state.timer.timerProgressMarker);
  const selectTimer = useSelector((state) => state.timer.selectTimer);

  //timer falg store
  const timerOutReminder = useSelector((state) => state.timer.timerOutReminder);

  const audio = currentBoardTimer.audio;

  useEffect(() => {
    return () => {
      store.dispatch(handleSetTimerLeftTimeMarker(0));
      store.dispatch(handleSetSelectTimer(false));
      store.dispatch(handleSetAudio(false));
    };
  }, []);

  useEffect(() => {
    //timer owner show setting button
    if (
      remoteBoardTimer.timerStatus !== 0 &&
      remoteBoardTimer.timerOwner === store.getState().user.userInfo.userId
    ) {
      setShowCancel(true);
    } else {
      setShowCancel(false);
    }

    //if timer is pause, show pause button
    if (remoteBoardTimer?.timerStatus === 2) {
      store.dispatch(handleSetTimerLeftTimeMarker(remoteBoardTimer.leftTime));
      setPause(true);
    } else {
      setPause(false);
    }

    //有正在进行的timer，刷新后重新计算计数器
    if (timerIntervalHandle) {
      clearInterval(timerIntervalHandle);
    }


    //远程控制当前timer停止工作
    if (remoteBoardTimer.timerStatus === 0) {
      store.dispatch(handleSetTimerLeftTimeMarker(0));
    }

    //远程获取到当前timer是运行状态
    if (remoteBoardTimer.timerStatus === 1) {

      let calcRestTime;

      if (!recoverPause) {

        calcRestTime = parseInt(
          (remoteBoardTimer.timerStartTime +
            remoteBoardTimer.totalTime +
            remoteBoardTimer.pauseTime -
            Date.now()) /
          1000
        );
        //localStorage.setItem('leftTime', calcRestTime);
        store.dispatch(handleSetTimerLeftTimeMarker(calcRestTime));
      }
      else {

        setRecoverPause(false);
        store.dispatch(handleSetAudio(true));

      }
      timerIntervalHandle = setInterval(() => {

        let leftTimeTemp = store.getState().timer.timerLeftTimeMarker;
        let strogeLeftTime = leftTimeTemp - 1;
        let timeRemain = parseInt((leftTimeTemp / (remoteBoardTimer?.totalTime / 1000)) * 100, 10);
        //localStorage.setItem('leftTime', strogeLeftTime.toString());

        store.dispatch(handleSetTimerProgressMarker(timeRemain));
        store.dispatch(handleSetTimerLeftTimeMarker(strogeLeftTime));

        if (leftTimeTemp <= 0) {
          //计时结束
          //local
          clearInterval(timerIntervalHandle);

          store.dispatch(handleSetTimerLeftTimeMarker(0));
        }
      }, 1000);
    }

  }, [remoteBoardTimer]);


  useEffect(() => {
    if (
      leftTime === 1 &&
      remoteBoardTimer.timerStatus === 1
    ) {
      //结束音频提醒
      setTimeout(() => {
        store.dispatch(handleSetAudio(false));
      }, 100);
      setTimeout(() => {
        //结束计时器

        //local
        store.dispatch(handleSetTimerOutReminder(true));
        store.dispatch(handleSetTimerLeftTimeMarker(0));
        store.dispatch(handleSetTimerStartTime(null));
        store.dispatch(handleSetPauseTime(0));
        store.dispatch(handleSetIsMusicOn(true));

        //remote
        handleClose();

      }, 1000);

      setTimeout(() => {
        store.dispatch(handleSetTimerOutReminder(false));
      }, 3000);
    } else if (leftTime === 0) {
      store.dispatch(handleSetSelectTimer(false));
    }

  }, [leftTime]);

  const handleStart = value => {
    const fullTime = value * 60;
    //local
    store.dispatch(handleSetSelectTimer(false));//关闭header ui


    store.dispatch(handleSetAudio(true)); //开启计时银月
    store.dispatch(handleSetIsMusicOn(false));//关闭结束银月

    store.dispatch(handleSetTimerStaus(1));
    store.dispatch(handleSetTimerLeftTimeMarker(fullTime));
    store.dispatch(handleSetTimerStartTime(Date.now()));
    store.dispatch(handleSetPauseTime(0));

    //localStorage.setItem('leftTime', fullTime.toString());

    //remote
    BoardService.getInstance().updateCurrentBoardTimer({
      boardId: board._id,
      timerOwner: store.getState().user.userInfo.userId,
      timerStartTime: Date.now(),
      totalTime: value * 60 * 1000,
      timerStatus: 1,
      pauseTime: 0,
      timerMode: true,
      leftTime: value * 60
    });

  };

  const handleClose = () => {
    //local
    store.dispatch(handleSetSelectTimer(false));//关闭header ui

    store.dispatch(handleSetShowTimerPopover(false));

    store.dispatch(handleSetTimerLeftTimeMarker(0));
    store.dispatch(handleSetTimerProgressMarker(100));
    store.dispatch(handleSetTimerStaus(0));
    store.dispatch(handleSetTimerStartTime(null));
    store.dispatch(handleSetPauseTime(0));
    store.dispatch(handleSetAudio(false));
    //localStorage.removeItem('leftTime');
    clearInterval(timerIntervalHandle);

    //remote
    BoardService.getInstance().updateCurrentBoardTimer({
      boardId: board._id,
      timerOwner: null,
      timerStartTime: null,
      totalTime: null,
      timerStatus: 0,
      pauseTime: 0,
      timerMode: false,
      leftTime: null
    });
  };

  const handlePlusOne = () => {

    //local
    const leftTimeTemp = store.getState().timer.timerLeftTimeMarker;
    //const leftTimeStroge = parseInt(localStorage.getItem('leftTime'));

    store.dispatch(handleSetTimerLeftTimeMarker(leftTimeTemp + 60));
    //localStorage.setItem('leftTime', (leftTimeStroge + 60).toString());

    //remote
    BoardService.getInstance().updateCurrentBoardTimer({
      boardId: board._id,
      totalTime: remoteBoardTimer.totalTime + 60 * 1000,
    });

  };

  const handlePause = () => {
    //local
    let timerStatus;
    let { pauseTime } = remoteBoardTimer;

    timerStatus = remoteBoardTimer?.timerStatus === 1 ? 2 : 1;
    setPause(timerStatus === 2);

    //local && remote action
    if (timerStatus === 2) {
      timeTemp = Date.now();
      clearInterval(timerIntervalHandle);
      store.dispatch(handleSetTimerStaus(2));
      store.dispatch(handleSetPauseTime(pauseTime));
      store.dispatch(handleSetAudio(false));

      BoardService.getInstance().updateCurrentBoardTimer({
        boardId: board._id,
        timerStatus: 2,
        pauseTime,
        leftTime: leftTime,
        keepTimeTemp: timeTemp
      });

    } else if (timerStatus === 1) {
      let timeTempNow = timeTemp > 0 ? timeTemp : remoteBoardTimer.keepTimeTemp;
      pauseTime += Date.now() - timeTempNow;

      store.dispatch(handleSetPauseTime(pauseTime));
      store.dispatch(handleSetAudio(true));

      BoardService.getInstance().updateCurrentBoardTimer({
        boardId: board._id,
        timerStatus: 1,
        pauseTime: pauseTime,
      });
      return;
    }

  };

  const handleMusic = () => {
    let timerStatus;
    const musicOn = store.getState().timer.isMusicOn;
    const currentBoardTimer = store.getState().timer;

    timerStatus = currentBoardTimer?.timerStatus === 1 ? 2 : 1;
    store.dispatch(handleSetIsMusicOn(!musicOn));
  };

  function leftFillNum(num, targetLength) {
    return num.toString().padStart(targetLength, 0);
  }

  const getTimeBySeconds = seconds =>
    `${leftFillNum(parseInt(seconds / 60, 10), 2)}:${leftFillNum(
      seconds % 60,
      2
    )}`;

  const timerSettingUI = () => (
    <Popover
      anchorEl={document.getElementById('timerMenu')}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center'
      }}
      sx={{
        paper: {
          width: '235px',
          height: '170px',
          marginTop: '16px',
          marginLeft: '-46px',
          backgroundColor: '#FFFFFF',
          borderRadius: '8px',
          boxShadow: '0px 1px 3px 2px #00000014'
        }
      }}
      id="timerSettingUI"
      onClose={handleClose}
      open={selectTimer}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center'
      }}
    >
      <div style={{
        width: 235,
        height: 167,
        padding: '24px 0 24px 24px',
        boxSizing: 'border-box'
      }}>
        <TimerSetting handleStart={value => handleStart(value)} />
      </div>
    </Popover>
  );

  const timerUI = () => (
    <div style={{
      position: 'fixed',
      top: '30%',
      background: 'white',
      borderRadius: 8,
      right: '15px',
      boxShadow: '0px 1px 3px 2px #00000014',
      zIndex: 1200
    }} id="timerUI">
      {remoteBoardTimer && remoteBoardTimer.timerStatus > 0 && leftTime > 0 ? (
        <TimerUI
          handleClose={handleClose}
          handleMusic={handleMusic}
          handlePause={handlePause}
          handlePlus={handlePlusOne}
          handleResume={handlePause}
          isMusicOn={musicOn}
          isPause={pause}
          progress={progress}
          progressLabel={getTimeBySeconds(leftTime)}
          showCancel={showCancel}
        />
      ) : null}
    </div>
  );

  const timerTimeUpUI = () => (
    <Popper
      anchorEl={document.getElementById('timerMenu')}
      open={timerOutReminder}
      placement="bottom"
    >
      <div style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        paddingTop: '12px',
        position: 'absolute',
        right: '-8.8rem',
        top: '15rem',
        background: 'white',
        borderRadius: '8px',
        width: '100px',
        height: '80px',
        textAlign: 'center',
        boxShadow: '0px 1px 3px 2px #00000014',
        boxSizing: 'border-box'
      }}>
        {/* <TimerFire /> */}
        <img
          style={{ width: '17px', height: '17px', marginTop: '5px' }}
          src='/timeover.png' alt=""
        />
        <Typography
          style={{
            fontSize: '16px',
            fontFamily: 'inter',
            fontWeight: 500,
            lineHeight: '30px',
            marginTop: '10px',
            color: 'red'
          }}
          component="div"
          variant="caption"
        >
          {t('board.header.timer.timeIsUp')}
        </Typography>
        <audio autoPlay src="/boardfiles/timeUp.mp3" />
      </div>
    </Popper>
  );

  return (
    <div>
      {selectTimer ? timerSettingUI() : null}
      {timerUI()}
      {timerTimeUpUI()}
      {/* {audio && (
        <audio loop autoPlay src="/boardfiles/timer.mp3" />
      )} */}
    </div>
  );
}
