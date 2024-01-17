// Import dependencies
import React from 'react';
import { styled } from '@mui/material/styles';
import { useSelector } from 'react-redux';
import { RootState } from '../../../../store';
import PropTypes from 'prop-types';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Import custom components
import CommandItem from './CommandItem';

const PREFIX = 'HomeRecentCommand';

const classes = {
  recentsBox: `${PREFIX}-recentsBox`,
  recentTextTypography: `${PREFIX}-recentTextTypography`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const Root = styled('div')((
  { theme }
) => ({
  [`& .${classes.recentsBox}`]: {
    height: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center'
  },

  [`& .${classes.recentTextTypography}`]: {
    fontSize: '10px',
    color: 'rgba(0, 0, 0, 0.48)'
  }
}));

/**
 * HomeRecentCommand component displays recent commands used in the application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.handleCommand - The callback function to handle the selected command.
 * @returns {React.ReactNode} The rendered HomeRecentCommand component.
 */
const HomeRecentCommand: React.FunctionComponent<{
  handleCommand: (command: string) => void;
}> = ({ handleCommand }) => {

  const { t } = useTranslation();
  const recentCommandData = useSelector(
    (state: RootState) => state.AIAssist.recentCommandData
  );
  const NoRecentCommands = ({ classes }) => (
    <Box
      // className={classes.recentsBox}
      sx={{
        height: '350px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center'
      }}
    >
      <Typography
        // className={classes.recentTextTypography}
        sx={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.48)' }}
      >
        {t('widgetAi.NoRecentlyUsedAICommands')}
      </Typography>
    </Box>
  );
  return (
    <>
      {recentCommandData && recentCommandData.length === 0 ? (
        <NoRecentCommands classes={classes} />
      ) : (
        recentCommandData.map((data, dataIndex) => (
          <CommandItem
            handleCommand={handleCommand}
            data={data}
            dataIndex={dataIndex}
            type="stickNoteCommand"
            key={dataIndex}
          />
        ))
      )}
    </>
  );
};

HomeRecentCommand.propTypes = {
  handleCommand: PropTypes.func.isRequired
};

export default HomeRecentCommand;
