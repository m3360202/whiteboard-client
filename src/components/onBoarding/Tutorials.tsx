//** Import react
import React, { useEffect, useState } from 'react';
import Tour from 'reactour';

//** Import Redux toolkit
import { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleSetOpenTour,
  handSetOpenResourceHelpfulHints,
  handleOpenTutorialSideBar,
  handleSetOpenAiTutorials
} from '../../store/sideBar';

//** Import components
import {boardSteps}  from './TutorialsContent';

export default function Tutorials() {
  //use

  const dispatch = useDispatch();

  //sideBar
  const openTour = useSelector((state: RootState) => state.sideBar.openTour);

  const handleClose = () => {
    dispatch(handleSetOpenTour(false));
    dispatch(handleSetOpenAiTutorials(true));
  }

  return (
    <Tour
      onRequestClose={() => handleClose()}
      steps={boardSteps}
      isOpen={openTour}
      // isOpen={false}
      rounded={5}
      accentColor="#F21D6B"
      closeWithMask={false}
      maskClassName="Tutorials-tourMask"
      showNavigationNumber={false}
      showNumber={false}
      startAt={0}
      scrollDuration={0}
      // onAfterOpen={disableBody}
      // onBeforeClose={enableBody}
    />
  );
}