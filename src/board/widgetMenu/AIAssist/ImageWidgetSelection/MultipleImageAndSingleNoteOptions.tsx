//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//** Import CommandType */
import CommandItem from '../CommandType/CommandItem';

const PREFIX = 'MultipleImageAndSingleNoteOptions';
const classes = {};

const StyledBox = styled(Box)((
  { theme }
) => ({}));

export default function MultipleImageAndSingleNoteOptions(handleCommand) {


  const handleClick = command => {
  };

  const getImageFileFromUrl = (url, imageName) => {
    return new Promise((resolve, reject) => {
      var blob = null;
      var xhr = new XMLHttpRequest();
      xhr.open('GET', url);
      xhr.setRequestHeader('Accept', 'image/png');
      xhr.responseType = 'blob';
      // 加载时处理
      xhr.onload = () => {
        // 获取返回结果
        blob = xhr.response;
        let imgFile = new File([blob], imageName, { type: 'image/png' });
        // 返回结果
        resolve(imgFile);
      };
      xhr.onerror = e => {
        reject(e);
      };
      // 发送
      xhr.send();
    });
  };

  return (
    <Box>
      {singleImageOptionCommandData.map((data, dataIndex) => {
        return (
          <CommandItem
            handleCommand={handleClick}
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
  {
    backgroundUrl: '',
    category: 'image',
    command: '',
    description: 'Create a new image based on the description',
    height: '',
    icon: window.location.origin + 'images/SingleImageOptionCommandIcon.svg',
    isFeatured: false,
    name: 'Create image',
    section: '',
    usedTimes: 32,
    weight: '',
    width: ''
  }
];
