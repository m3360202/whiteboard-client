// Import dependencies
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';
import { RootState } from '../../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useFavoriteAICommandMutation } from '../../../../redux/AiAssistApiSlice';
import { handleSetCommandData } from '../../../../store/AIAssist';

import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';

// Import custom components
import AICommandFavoriteIcon from '../../../../mui/icons/AICommandFavoriteIcon';
import AICommandNoFavoriteIcon from '../../../../mui/icons/AICommandNoFavoriteIcon';

const PREFIX = 'CommandItem';

const classes = {
  listItemButtonRoot: `${PREFIX}-listItemButtonRoot`,
  listItemTextPrimary: `${PREFIX}-listItemTextPrimary`,
  listItemTextRoot: `${PREFIX}-listItemTextRoot`,
  listItemTextSecondary: `${PREFIX}-listItemTextSecondary`,
  iconButtonRoot: `${PREFIX}-iconButtonRoot`
};

const StyledListItemButton = styled(ListItemButton)(({ theme }) => ({
  margin: '3px 10px 3px 0px',
  alignItems: 'flex-start',
  padding: '8px',
  borderRadius: '4px',
  transition: 'none',
  '&:hover': {
    backgroundColor: '#EEEEEE',
    '& #AiFavoriteCommandIcon': {
      display: 'block',
      top: '0px'
    }
  },

  [`& .${classes.listItemTextPrimary}`]: {
    fontSize: '12px',
    fontWeight: 500,
    lineHeight: '16px',
    marginLeft: '12px'
  },

  [`& .${classes.listItemTextRoot}`]: {
    margin: '0px',
    maxWidth: '280px'
  },

  [`& .${classes.listItemTextSecondary}`]: {
    fontSize: '12px',
    lineHeight: '16px',
    marginTop: '4px',
    marginLeft: '12px'
  },

  [`& .${classes.iconButtonRoot}`]: {
    padding: 0,
    width: '16px',
    height: '16px',
    position: 'absolute',
    right: '16px',
    top: '8px',
    cursor: 'pointer',
    display: 'none'
  }
}));

/**
 * @description Component to display favorite icon based on type and if the command is a favorite
 * @param {string} type - type of icon
 * @param {Object} data - data of the command item
 * @param {function} handleFavoriteCommand - click event handler for favorite icon
 */
const FavoriteIcon = ({ type, currentCommand, handleFavoriteCommand }) => {

  return (
    type === 'stickNoteCommand' && (
      <IconButton
        id="AiFavoriteCommandIcon"
        onClick={e =>
          handleFavoriteCommand(
            e,
            currentCommand.favoriteCommand &&
            currentCommand.favoriteCommand.favorite,
            currentCommand
          )
        }
        classes={{ root: classes.iconButtonRoot }}
        style={currentCommand.favoriteCommand && currentCommand.favoriteCommand.favorite ? {
          display: 'block'
        } : {}}
        sx={{  '&:hover': {
          transform: 'scale(1.2)', // Enlarge by 10%
          transition: 'transform 0.3s', // Smooth transition for the hover effect
        },}}
      >
        {
          currentCommand.favoriteCommand &&
            currentCommand.favoriteCommand.favorite ? (
            <AICommandFavoriteIcon style={{ width: '16px', height: '16px' }} />
          ) : (
            <AICommandNoFavoriteIcon style={{ width: '16px', height: '16px' }} />
          )
        }
      </IconButton >
    )
  );
};

FavoriteIcon.propTypes = {
  type: PropTypes.string.isRequired,
  currentCommand: PropTypes.object.isRequired,
  handleFavoriteCommand: PropTypes.func.isRequired
};

/**
 * @description Component to display a command item
 * @param {function} handleCommand - click event handler for the command item
 * @param {Object} data - data of the command item
 * @param {number} dataIndex - index of the command item
 * @param {string} type - type of the command item
 */
const CommandItem = ({ handleCommand, data, dataIndex, type }) => {

  const currentCommand = data;

  // console.log(currentCommand?.favoriteCommand?.favorite, currentCommand?.name, store.getState().AIAssist.teamsCommandData.find((item)=>item.name=='Content Writer').favoriteCommand.favorite)

  const dispatch = useDispatch();

  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const isBindingTemplate =
    data.bindingTemplates && data.templateThumbnail && data.templateThumbnail.length > 0

  const [
    favoriteAICommand,
    {
      isLoading: favoriteAICommandIsLoading,
      isError: favoriteAICommandIsError,
      isSuccess: favoriteAICommandIsSuccess
    }
  ] = useFavoriteAICommandMutation();

  const [error, setError] = useState(null);

  const handleFavoriteCommand = async (event, favorite, commandData) => {
    event.stopPropagation();
    try {
      await favoriteAICommand({
        commandId: commandData._id,
        userId: userInfo.userId,
        favorite,
        type: 'AllCommand'
      }).unwrap().then(data => {

      })




    } catch (err) {
      setError(err);
    }
  };

  return (
    <StyledListItemButton key={dataIndex} onClick={() => handleCommand(data)}>
      <img
        style={{ width: '32px', height: '32px' }}
        src={data.icon ? data.icon : '/images/android-icon-36x36.png'}
        alt="command icon"
      />
      <Box
        sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}
      >
        <ListItemText
          primary={data.name}
          secondary={data.description}
          classes={{
            root: classes.listItemTextRoot,
            primary: classes.listItemTextPrimary,
            secondary: classes.listItemTextSecondary
          }}
        />

        {isBindingTemplate ? (
          <img
            style={{ width: '60px', height: '38px', marginRight: '30px' }}
            src={data.templateThumbnail}
            alt="command icon"
          />
        ) : (
          <Box
            style={{ width: '60px', height: '38px', marginRight: '30px' }}
          ></Box>
        )}
      </Box>
      {/* { data?.favoriteCommand?.favorite } */}
      <FavoriteIcon
        type={type}
        currentCommand={currentCommand}
        handleFavoriteCommand={handleFavoriteCommand}
      />
      {error && <p>Error, please try again</p>}
    </StyledListItemButton>
  );
};

CommandItem.propTypes = {
  handleCommand: PropTypes.func.isRequired,
  data: PropTypes.object.isRequired,
  dataIndex: PropTypes.number.isRequired,
  type: PropTypes.string.isRequired
};

export default CommandItem;
