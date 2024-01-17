// Import dependencies
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { handleSetOpenWidgetMenuAIAssist } from '../../../store/AIAssist';

import Popover from '@mui/material/Popover';

// Import custom components
import AIAssistCommandDialogPage from './AIAssistCommandDialogPage';

const PREFIX = 'CommandDialog';

const classes = {
  popoverPaper: `${PREFIX}-popoverPaper`
};

const StyledPopover = styled(Popover)((
  { theme }
) => ({
  [`& .${classes.popoverPaper}`]: {
    width: '450px'
  }
}));

/**
 * CommandDialog component
 * @param {Object} props
 * @returns {JSX.Element}
 */
const CommandDialog = ({ currentWidgetType }) => {

  const dispatch = useDispatch();

  const openWidgetMenuAIAssist = useSelector(
    (state: RootState) => state.AIAssist.openWidgetMenuAIAssist
  );

  const handleClose = () => {
    dispatch(handleSetOpenWidgetMenuAIAssist(false));
  };

  return (
    <StyledPopover
      open={openWidgetMenuAIAssist}
      anchorEl={document.getElementById('aiassistwidget')}
      onClose={handleClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'left'
      }}
      classes={{ paper: classes.popoverPaper }}
    >
      <AIAssistCommandDialogPage
        open={openWidgetMenuAIAssist}
        type="WidgetMenuAI"
        currentWidgetType={currentWidgetType}
      />
    </StyledPopover>
  );
};

CommandDialog.propTypes = {
  currentWidgetType: PropTypes.array
};

export default CommandDialog;
