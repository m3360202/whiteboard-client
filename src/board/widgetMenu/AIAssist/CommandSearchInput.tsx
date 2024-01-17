// Import dependencies
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { useSelector, useDispatch } from 'react-redux';
import { RootState } from '../../../store';
import { handleSetSearchCommandData } from '../../../store/AIAssist';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';

// Import custom components
import AISearchIcon from '../../../mui/icons/AISearchIcon';
import AICloseSearchIcon from '../../../mui/icons/AICloseSearchIcon';

const PREFIX = 'CommandSearchInput';

const classes = {
  searchBox: `${PREFIX}-searchBox`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`&.${classes.searchBox}`]: {
    position: 'absolute',
    top: 0,
    left: 0,
    backgroundColor: '#FFFFFF',
    width: '100%',
    height: '40px',
    padding: '0px 16px',
    boxSizing: 'border-box',
    display: 'flex',
    justifyContent: 'space-between',
    cursor: 'pointer',
    alignItems: 'center',
    borderBottom: '1px solid rgba(0, 0, 0, 0.16)'
  }
}));

/**
 * CommandSearchInput component
 * @param {Object} props
 * @returns {JSX.Element}
 */
const CommandSearchInput = ({
  openCommandSearch,
  setOpenCommandSearch,
  setValue
}) => {
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const AICommandData = useSelector(
    (state: RootState) => state.AIAssist.commandData
  );

  const teamsCommandData = useSelector(
    (state: RootState) => state.AIAssist.teamsCommandData
  );

  const allCommandData = useSelector(
    (state: RootState) => state.AIAssist.allCommandData
  );

  const allCommandDataInTheTeams = AICommandData.concat(teamsCommandData);

  const handleSearchCommand = event => {
    const search = event.target.value.toLowerCase();
    if (search.length > 0) {
      const searchCommand = allCommandData.filter(
        command =>
          (command.name &&
            command.name.toLowerCase().includes(search.toLowerCase())) ||
          (command.description &&
            command.description.toLowerCase().includes(search.toLowerCase())) ||
          (command.section &&
            Array.isArray(command.section) &&
            command.section.length > 0 &&
            command.section
              .map(item => item.toLowerCase())
              .includes(search.toLowerCase()))
      );
      dispatch(handleSetSearchCommandData(searchCommand));
      return;
    }
    dispatch(handleSetSearchCommandData([]));
  };

  return (
    <StyledBox className={classes.searchBox}>
      <Box
        style={{
          flex: 1,
          display: 'flex',
          justifyContent: 'flex-start',
          alignItems: 'center'
        }}
      >
        <AISearchIcon style={{ cursor: 'pointer' }} color="#707478" />
        <SearchInput
          id="searchCommandInput"
          placeholder={t('widgetAi.searchAICommands')}
          onChange={handleSearchCommand}
          autoFocus
        />
      </Box>

      <AICloseSearchIcon
        style={{ cursor: 'pointer' }}
        onClick={() => {
          setOpenCommandSearch(false);
          setValue(1);
        }}
      />
    </StyledBox>
  );
};

const SearchInput = styled('input')`
  padding: 0;
  border: none;
  width: 100%;
  height: 12px;
  font-size: 12px;
  outline: none;
  margin-left: 8px;
  margin-right: 8px;
`;

CommandSearchInput.propTypes = {
  openCommandSearch: PropTypes.bool.isRequired,
  setOpenCommandSearch: PropTypes.func.isRequired
};

export default CommandSearchInput;
