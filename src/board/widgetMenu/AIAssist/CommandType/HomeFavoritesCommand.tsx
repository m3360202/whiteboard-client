// Import dependencies
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { RootState } from '../../../../store';
import { useSelector } from 'react-redux';
import { useGetAiAllCustomStyleCommandQuery } from '../../../../redux/AiAssistApiSlice';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

// Import custom components
import CommandItem from './CommandItem';

const PREFIX = 'HomeFavoritesCommand';

const classes = {
  favoriteBox: `${PREFIX}-favoriteBox`,
  favoriteTextTypography: `${PREFIX}-favoriteTextTypography`
};

const Root = styled(Box)((
  { theme }
) => ({
  [`&.${classes.favoriteBox}`]: {
    height: '350px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'column'
  },

  [`& .${classes.favoriteTextTypography}`]: {
    fontSize: '10px',
    color: 'rgba(0, 0, 0, 0.48)'
  }
}));

/**
 * HomeFavoritesCommand component displays favorite commands used in the application.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Function} props.handleCommand - The callback function to handle the selected command.
 * @returns {React.ReactNode} The rendered HomeFavoritesCommand component.
 */
const HomeFavoritesCommand: React.FunctionComponent<{
  handleCommand: (command: string) => void;
}> = ({ handleCommand }) => {


  // const AICommandData = useSelector(
  //   (state: RootState) => state.AIAssist.commandData
  // );

  const teamsCommandData = useSelector(
    (state: RootState) => state.AIAssist.teamsCommandData
  );

  const allCommandData = useSelector(
    (state: RootState) => state.AIAssist.allCommandData
  );

  const [mergedFavoriteCommandData, setMergedFavoriteCommandData] = React.useState([]);

  // const AICommandData = AICommandData.concat(teamsCommandData);
  // const allCommandDataInTheTeams = AICommandData.concat(teamsCommandData);

const  allCustomStyleCommand = useSelector(
  (state: RootState) => state.AIAssist.allCustomStyleCommand
  );

let favoriteCustomizeCommandData, favoriteTeamsCommandData, favoriteAllCommandData;

  useEffect(() => {
      favoriteCustomizeCommandData = allCustomStyleCommand.filter(
      item => item.favoriteCommand && item.favoriteCommand.favorite
    );
  
      favoriteTeamsCommandData = teamsCommandData.filter(
      item => item.favoriteCommand && item.favoriteCommand.favorite
    );
  
      favoriteAllCommandData = allCommandData.filter(
      item => item.favoriteCommand && item.favoriteCommand.favorite
      );
    // Merge the arrays
    const tempMergedFavoriteCommandData = [
      ...favoriteTeamsCommandData,
      ...favoriteCustomizeCommandData,
      ...favoriteAllCommandData
    ];

    // Sort by addTime
    tempMergedFavoriteCommandData.sort((a, b) => b.favoriteCommand.addTime - a.favoriteCommand.addTime);

    // Create a new Set for names to track duplicates
    const seenNames = new Set();

    // Filter the array, removing duplicates and preferring items from favoriteTeamsCommandData
    const uniqueFavoriteCommandData = tempMergedFavoriteCommandData.filter(item => {
      if (!seenNames.has(item.name)) {
        seenNames.add(item.name);
        return true;
      }
      return favoriteTeamsCommandData.includes(item);
    });

    setMergedFavoriteCommandData(uniqueFavoriteCommandData);
  }, [allCustomStyleCommand, teamsCommandData, allCommandData]);



  // // Sort by addTime
  // mergedFavoriteCommandData.sort((a, b) => b.favoriteCommand.addTime - a.favoriteCommand.addTime);

  // // Remove duplicates, preferring items from favoriteTeamsCommandData
  //   mergedFavoriteCommandData = mergedFavoriteCommandData.reduce((acc, current) => {
  //   const x = acc.find(item => item.name === current.name);
  //   if (!x) {
  //     return acc.concat([current]);
  //   } else {
  //     // If the item is already in the accumulator and is from favoriteTeamsCommandData, keep it
  //     return x === current || favoriteTeamsCommandData.includes(x) ? acc : acc.concat([current]);
  //   }
  // }, []);

  // uniqueFavoriteCommandData now contains the unique items, preferring favoriteTeamsCommandData


  return (
    <>
      {mergedFavoriteCommandData && mergedFavoriteCommandData.length === 0 ? (
        <NoFavorites classes={classes} />
      ) : (
        mergedFavoriteCommandData.map((data, dataIndex) => (
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

/**
 * NoFavorites component is displayed if there are no favorite commands available.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.classes - The style classes for the component elements.
 * @returns {React.ReactNode} The rendered NoFavorites component.
 */
const NoFavorites = ({ classes }) => (
  <Box
    // className={classes.favoriteBox}
    sx={{
      height: '350px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexDirection: 'column'
    }}
  >
    <img
      src="/images/AIAssist/NoFavoritesBjImg.png"
      alt="背景图"
      style={{ width: '185px', height: '166px' }}
    />
    <Typography
      // className={classes.favoriteTextTypography}
      sx={{ fontSize: '10px', color: 'rgba(0, 0, 0, 0.48)' }}
    >
      No AI commands in Favorites
    </Typography>
  </Box>
);

HomeFavoritesCommand.propTypes = {
  handleCommand: PropTypes.func.isRequired
};

export default HomeFavoritesCommand;
