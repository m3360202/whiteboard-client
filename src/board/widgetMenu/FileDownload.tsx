//** Import react
import React from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

import ToggleButton from '@mui/material/ToggleButton';
import FileDownloadIcon from '../../mui/icons/FileDownloadIcon';

const PREFIX = 'FileDownload';

const classes = {
  toggleButtonRoot: `${PREFIX}-toggleButtonRoot`
};

const Root = styled('div')((
  { theme }
) => ({
  [`& .${classes.toggleButtonRoot}`]: {
    height: '44px'
  }
}));

export default function FileDownload({ fileDownloadSrc, fileName }) {

  const { t } = useTranslation();
  const handleClickFileDownload = () => {
    if (fileDownloadSrc) {
      let data = {
        url: fileDownloadSrc,
        type: fileName.substring(fileName.lastIndexOf('.') + 1),
        name: fileName
      };
      Boardx.Util.Msg.warning(t('board.filedrop.downloadStart'));
      fetch(fileDownloadSrc)
        .then(response => {
          if (!response.ok) {
            throw new Error('Network response was not ok');
          }
          return response.blob();
        })
        .then(blob => {
          // 创建下载链接并自动下载
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.setAttribute('download', data.name);
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);
          Boardx.Util.Msg.success(t('board.filedrop.downloadSuccess'));
        })
        .catch(error => {
          Boardx.Util.Msg.warning(t('board.filedrop.fileDownloadError'));
          console.error('Error fetching file:', error);
        });
        return;
    }
    Boardx.Util.Msg.warning(t('board.filedrop.fileDownloadError'));
  };

  return (
    <Root>
      <ToggleButton
        value="fileDownload"
        classes={{ root: classes.toggleButtonRoot }}
        onClick={handleClickFileDownload}
      >
        <FileDownloadIcon />
      </ToggleButton>
    </Root>
  );
}
