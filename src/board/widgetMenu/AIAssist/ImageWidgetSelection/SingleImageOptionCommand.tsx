//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

import Box from '@mui/material/Box';

//** Import CommandType */
import CommandItem from '../CommandType/CommandItem';

const PREFIX = 'SingleImageOptionCommand';
const classes = {};

const StyledBox = styled(Box)((
  { theme }
) => ({}));

export default function SingleImageOptionCommand({ handleClickImageSelectionCommand }) {


  return (
    <Box sx={{ pl: '10px' }}>
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
  //   description: 'Compose a description of the image',
  //   height: '',
  //   icon: window.location.origin + 'images/SingleImageOptionCommandIcon.svg',
  //   isFeatured: false,
  //   name: 'Decribe image',
  //   section: '',
  //   usedTimes: 32,
  //   weight: '',
  //   width: ''
  // },
  {
    backgroundUrl: '',
    category: 'image',
    command: '{input}',
    description: 'Create image in similiar styles',
    height: '',
    icon: window.location.origin + 'images/SingleImageOptionCommandIcon.svg',
    isFeatured: false,
    name: 'Replicate image',
    section: '',
    usedTimes: 32,
    weight: '',
    width: '',
    num: '1'
  }
];
