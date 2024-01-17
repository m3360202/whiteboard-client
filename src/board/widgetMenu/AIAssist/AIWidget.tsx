//** Import dependencies
import React from 'react';

//** Import Mui
import { styled } from '@mui/material/styles';
import ToggleButton from '@mui/material/ToggleButton';

//** Import Redux kit
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../../store';
import AIAssistIcon from '../../../mui/icons/AIAssistIcon';
import {
  useGetAllAiCommandQuery,
  useGetAllTeamsAiCommandQuery,
  useGetAiAllCustomStyleCommandQuery
} from '../../../redux/AiAssistApiSlice';

const PREFIX = 'AIWidget';

const classes = {
  aiAssistButton: `${PREFIX}-aiAssistButton`
};

const StyledToggleButton = styled(ToggleButton)(({ theme }) => ({
  [`&.${classes.aiAssistButton}`]: {
    borderRightWidth: 1,
    width: 40,
    paddingTop: '14px',
    paddingBottom: '14px'
  }
}));

/**
 * AIWidget component
 * @param {Object} props
 * @returns {JSX.Element}
 */
const AIWidget = ({ onClick }) => {
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  const { data: data = [] } = useGetAllAiCommandQuery({});

  const { data: allCustomStyleCommand = [] } =
    useGetAiAllCustomStyleCommandQuery({});

  const { data: teamsCommandData = [] } = useGetAllTeamsAiCommandQuery({
    orgId: orgInfo.orgId ? orgInfo.orgId : localStorage.getItem('orgId')
  });

  return (
    <StyledToggleButton
      id="aiassistwidget"
      aria-label="bold"
      className={classes.aiAssistButton}
      onClick={onClick}
      selected={false}
      value="aiassistwidget"
    >
      <AIAssistIcon />
    </StyledToggleButton>
  );
};

export default AIWidget;
