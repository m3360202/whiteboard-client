//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

import Box from '@mui/material/Box';

//** Import CommandType */
import CommandItem from '../CommandType/CommandItem';

const PREFIX = 'SingleImageAndSingleNoteOptions';
const classes = {};

const StyledBox = styled(Box)((
  { theme }
) => ({}));

export default function SingleImageAndSingleNoteOptions({ handleClickImageSelectionCommand }) {


  return (
    <Box sx={{pl: '10px'}}>
      {singleImageOptionCommandData.map((data, dataIndex) => {
        return (
          <CommandItem
            handleCommand={handleClickImageSelectionCommand}
            data={data}
            dataIndex={dataIndex}
            type="imageWidgetSelection"
            key={dataIndex}
          />
        );
      })}
    </Box>
  );
}

const singleImageOptionCommandData = [
  // {
  //   backgroundUrl: '',
  //   category: 'image',
  //   command: '',
  //   description: 'Modify the selected image based on the description',
  //   height: '',
  //   icon: window.location.origin + 'images/SingleImageOptionCommandIcon.svg',
  //   isFeatured: false,
  //   name: 'Modify image',
  //   section: '',
  //   usedTimes: 32,
  //   weight: '',
  //   width: ''
  // },
  {
    backgroundUrl: '',
    category: 'image',
    command: '{input}',
    description:
      'Create a new image based on the description, in the selected image’s style',
    height: '',
    icon: window.location.origin + 'images/SingleImageOptionCommandIcon.svg',
    isFeatured: false,
    name: 'Create image',
    section: '',
    usedTimes: 32,
    weight: '',
    width: '',
    num: '1'
  }
];
