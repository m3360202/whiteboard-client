// Import dependencies
import React, { useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { handleSetOpenWidgetMenuAIAssist } from '../../../store/AIAssist';

// Import custom components
import AIWidget from './AIWidget';
import CommandDialog from './CommandDialog';
import VerifyDialog from './VerifyDialog';

/**
 * AIAssistWidget component
 * @returns {JSX.Element}
 */
const AIAssistWidget = () => {
  const dispatch = useDispatch();
  const [openVerify, setOpenVerify] = useState(false);
  const [currentWidgetType, setCurrentWidgetType] = useState([]);

  const openWidgetMenuAIAssist = useSelector(
    (state: RootState) => state.AIAssist.openWidgetMenuAIAssist
  );

  const onClickAIAssist = () => {
    dispatch(handleSetOpenWidgetMenuAIAssist(true));
    const currentWidget = canvas.getActiveObject();
    if (currentWidget._objects && currentWidget._objects.length > 1) {
      let newCurrentWidgetType = [];
      currentWidget._objects.map(item => {
        newCurrentWidgetType.push(item.obj_type);
      });
      setCurrentWidgetType(newCurrentWidgetType);
    } else {
      setCurrentWidgetType([currentWidget.obj_type]);
    }
  };

  return (
    <div>
      <AIWidget onClick={onClickAIAssist} />
      {openWidgetMenuAIAssist ? (
        <CommandDialog currentWidgetType={currentWidgetType} />
      ) : null}
      <VerifyDialog open={openVerify} setOpen={setOpenVerify} />
    </div>
  );
};

export default AIAssistWidget;
