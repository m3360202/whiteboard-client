// Import dependencies
import React from 'react';
import PropTypes from 'prop-types';

// Import Mui components
import Box from '@mui/material/Box';

// Import custom components
import CommandItem from './CommandItem';

/**
 * ContentSectionCommand component
 *
 * @param {Object} props
 * @param {string} props.item - Section title
 * @param {Object} props.sectionCommandData - Command data in each section
 * @param {Function} props.handleCommand - Function to handle command selection
 *
 * @return {JSX.Element} ContentSectionCommand component
 */
function ContentSectionCommand({ item, sectionCommandData, handleCommand }) {
  const sectionCommandDataSort = sectionCommandData[item].sort((a, b) => {
    if (a.weight && b.weight) return b.weight - a.weight;
  });

// console.log('ContentSectionCommand', sectionCommandDataSort.find((item)=>item.name=='Content Writer').favoriteCommand.favorite);
  return (
    <Box>
      <Box>
        {sectionCommandDataSort &&
          sectionCommandDataSort.map((data, dataIndex) => (
            <CommandItem
              handleCommand={handleCommand}
              data={data}
              dataIndex={dataIndex}
              type="stickNoteCommand"
              key={dataIndex}
            />
          ))}
      </Box>
    </Box>
  );
}

ContentSectionCommand.propTypes = {
  item: PropTypes.string.isRequired,
  sectionCommandData: PropTypes.object.isRequired,
  handleCommand: PropTypes.func.isRequired
};

export default ContentSectionCommand;
