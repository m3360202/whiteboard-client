//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect } from 'react';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

//** Import CommandType */
import CommandItem from '../CommandType/CommandItem';

const PREFIX = 'MultipleImageOptionsCommand';
const classes = {};

const StyledBox = styled(Box)((
  { theme }
) => ({}));

export default function MultipleImageOptionsCommand(handleCommand) {


  const handleClick = command => {
    if (
      command.category.toLocaleLowerCase() === 'image' &&
      command.name === 'Decribe image'
    ) {
      const currentWidget = canvas.getActiveObject();
      const imageSrc = currentWidget.src;
      let imageFile = null;
      getImageFileFromUrl(imageSrc, 'fileName')
        .then(response => {
          // 返回的是文件对象，使用变量接收即可
          imageFile = response;
          console.warn('imageFile', imageFile);
        })
        .catch(e => {
          console.error(e);
        });

      console.warn('imageSrc', imageSrc);
    }
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
    description: 'Combine selected images',
    height: '',
    icon: window.location.origin + 'images/SingleImageOptionCommandIcon.svg',
    isFeatured: false,
    name: 'Combine images',
    section: '',
    usedTimes: 32,
    weight: '',
    width: ''
  }
];
