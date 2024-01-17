// Import dependencies
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';

//** Import i18n
import { useTranslation } from 'react-i18next';

import List from '@mui/material/List';
import Box from '@mui/material/Box';

// Import custom components
import CommandItem from './CommandItem';

const PREFIX = 'SearchCommand';

const classes = {
  noSearchDataShowContent: `${PREFIX}-noSearchDataShowContent`
};

const StyledList = styled(List)(({ theme }) => ({
  [`& .${classes.noSearchDataShowContent}`]: {
    height: '100%',
    textAlign: 'center',
    marginTop: '60%',
    fontSize: '12px',
    fontWeight: 500,
    color: 'rgba(35, 41, 48, 0.65)'
  }
}));

/**
 * SearchCommand component displays a list of searched commands.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.handleCommand - The callback function to handle the selected command.
 * @returns {React.ReactNode} The rendered SearchCommand component.
 */
const SearchCommand: React.FunctionComponent<{
  handleCommand: (command: string) => void;
}> = ({ handleCommand }) => {
  const { t } = useTranslation();
  const searchCommandData = useSelector(
    (state: RootState) => state.AIAssist.searchCommandData
  );
  const NoResults = ({ classes }) => (
    <Box
      className={classes.noSearchDataShowContent}
    >
      {t('widgetAi.NoResults')}
    </Box>
  );
  return (
    <StyledList>
      {searchCommandData.map((data, dataIndex) => (
        <CommandItem
          handleCommand={handleCommand}
          data={data}
          dataIndex={dataIndex}
          type="stickNoteCommand"
          key={dataIndex}
        />
      ))}
      {searchCommandData && searchCommandData.length === 0 ? (
        <NoResults classes={classes} />
      ) : null}
    </StyledList>
  );
};

SearchCommand.propTypes = {
  handleCommand: PropTypes.func.isRequired
};

export default SearchCommand;
