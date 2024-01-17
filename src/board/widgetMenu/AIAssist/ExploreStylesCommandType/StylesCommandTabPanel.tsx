// Import dependencies
import React from 'react';
import { styled } from '@mui/material/styles';
import PropTypes from 'prop-types';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';

const PREFIX = 'StylesCommandTabPanel';

const classes = {
  imagesCommandBox: `${PREFIX}-imagesCommandBox`,
  cardRoot: `${PREFIX}-cardRoot`,
  cardMediaRoot: `${PREFIX}-cardMediaRoot`,
  cardMediaActive: `${PREFIX}-cardMediaActive`,
  customCommandName: `${PREFIX}-customCommandName`
};

const Root = styled('div')((
  { theme }
) => ({
  [`& .${classes.imagesCommandBox}`]: {
    display: 'flex',
    flexWrap: 'wrap'
  },

  [`& .${classes.cardRoot}`]: {
    width: '148px',
    height: '111px',
    cursor: 'pointer',
    marginRight: '3px',
    marginBottom: '9px',
    position: 'relative'
  },

  [`& .${classes.cardMediaRoot}`]: {
    boxSizing: 'border-box',
    borderRadius: '2px',
    border: '2px solid transparent',
    '&:hover': {
      boxSizing: 'border-box',
      border: '2px solid #F21D6B'
    }
  },

  [`& .${classes.cardMediaActive}`]: {
    padding: '2px',
    boxSizing: 'border-box',
    border: '2px solid #F21D6B'
  },

  [`& .${classes.customCommandName}`]: {
    color: '#FFFFFF',
    width: '144px',
    bottom: '1px',
    left: '2px',
    position: 'absolute',
    fontSize: '12px',
    textAlign: 'center',
    fontWeight: 500,
    lineHeight: '33px',
    background: 'rgba(32, 32, 32, 0.5)',
    borderRadius: '0px 0px 2px 2px',
    height: '33px'
  }
}));

/**
 * StylesCommandTabPanel component displays a list of custom style commands
 * related to Medium.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Array} props.customStyleCommandData - The custom style command data.
 * @param {Object} props.currentSelectImgCommand - The currently selected image command.
 * @param {Function} props.setCurrentSelectImgCommand - The callback function to set the selected image command.
 * @param {Function} props.setShowCustomizeStyle - The callback function to show/hide the customize styles.
 * @returns {React.ReactNode} The rendered StylesCommandTabPanel component.
 */
const StylesCommandTabPanel = ({
  customStyleCommandData,
  currentSelectImgCommand,
  setCurrentSelectImgCommand,
  setShowCustomizeStyle
}) => {


  const stylesCommandData = customStyleCommandData
    .filter(item => item.type === 'Styles')
    .sort((a, b) => a.createdAt.getTime() - b.createdAt.getTime());

  return (
    <Root>
      <Box className={classes.imagesCommandBox}>
        {stylesCommandData.map((item, index) => (
          <CommandCard
            key={index}
            item={item}
            index={index}
            currentSelectImgCommand={currentSelectImgCommand}
            setCurrentSelectImgCommand={setCurrentSelectImgCommand}
            setShowCustomizeStyle={setShowCustomizeStyle}
            classes={classes}
          />
        ))}
      </Box>
    </Root>
  );
};

/**
 * CommandCard component renders a card for each command in the StylesCommandTabPanel.
 *
 * @param {Object} props - The properties passed to the component.
 * @param {Object} props.item - The command item data.
 * @param {number} props.index - The index of the command item in the list.
 * @param {Object} props.currentSelectImgCommand - The currently selected image command.
 * @param {Function} props.setCurrentSelectImgCommand - The callback function to set the selected image command.
 * @param {Function} props.setShowCustomizeStyle - The callback function to show/hide the customize styles.
 * @param {Object} props.classes - The style classes for the component elements.
 * @returns {React.ReactNode} The rendered CommandCard component.
 */
const CommandCard = ({
  item,
  index,
  currentSelectImgCommand,
  setCurrentSelectImgCommand,
  setShowCustomizeStyle,
  classes
}) => (
  <Card
    classes={{ root: classes.cardRoot }}
    onClick={() => setCurrentSelectImgCommand(item)}
    onDoubleClick={() => {
      setShowCustomizeStyle(false);
      setCurrentSelectImgCommand({});
    }}
    key={index}
  >
    <CardMedia
      classes={{ root: classes.cardMediaRoot }}
      className={
        currentSelectImgCommand._id === item._id ? classes.cardMediaActive : ''
      }
      component="img"
      width="148"
      height="111"
      image={item.backgroundUrl}
    />
    <Typography className={classes.customCommandName}>{item.name}</Typography>
  </Card>
);

StylesCommandTabPanel.propTypes = {
  // customStyleCommandData: PropTypes.array.isRequired,
  currentSelectImgCommand: PropTypes.object.isRequired,
  setCurrentSelectImgCommand: PropTypes.func.isRequired,
  setShowCustomizeStyle: PropTypes.func.isRequired
};

export default StylesCommandTabPanel;
