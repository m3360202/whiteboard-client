//** Import react
import React, { useRef, Component, useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import LoadingButton from '@mui/lab/LoadingButton';
import Typography from '@mui/material/Typography';
import server from '../../../startup/serverConnect';

const PREFIX = 'AIAssistantImagesPreview';

const classes = {
  inputBox: `${PREFIX}-inputBox`,
  inputTitle: `${PREFIX}-inputTitle`,
  previewImageBox: `${PREFIX}-previewImageBox`,
  textFieldRoot3: `${PREFIX}-textFieldRoot3`,
  executeButton: `${PREFIX}-executeButton`
};

const StyledBox = styled(Box)(({ theme }) => ({
  padding: '0 20px',

  [`& .${classes.inputBox}`]: {
    marginTop: '12px'
  },

  [`& .${classes.inputTitle}`]: {
    fontWeight: 600,
    fontSize: '12px',
    lineHeight: '15px',
    marginBottom: '6px'
  },

  [`& .${classes.previewImageBox}`]: {
    borderRadius: '3px',
    width: '358px',
    height: '316px',
    overflow: 'hidden',
    backgroundColor: '#D9D9D9',
    marginLeft: '12px',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat'
  },

  [`& .${classes.textFieldRoot3}`]: {
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    }
  },

  [`& .${classes.executeButton}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
    borderRadius: '5px',
    padding: '7px 22px !important',
    background: '#F21D6B !important'
  }
}));

export default function AIAssistantImagesPreview(props) {
  const currentRowData = useSelector(
    (state: RootState) => state.AIAssist.currentAdminAiImagePromptData
  );
  const valueRefCategory: any = useRef('');
  const [previewImageUrl, setPreviewImageUrl] = useState('');
  const [loadingExecute, setLoadingExecute] = useState(false);

  function dataURItoBlob(dataURI) {
    // 将 base64 数据去除开头部分，只保留数据部分
    const byteString = atob(dataURI);
    // 构造 Uint8Array 数组，将每个字符转为 ASCII 码对应的数字
    const ab = new ArrayBuffer(byteString.length);
    const ia = new Uint8Array(ab);
    for (let i = 0; i < byteString.length; i++) {
      ia[i] = byteString.charCodeAt(i);
    }
    // 返回 Blob 对象
    return new Blob([ab], { type: 'image/png' });
  }

  const handleExecutePreview = () => {
    const commandData = {
      ...currentRowData,
      command: currentRowData.command,
      targetContent: valueRefCategory.current.value
    };
    const prompt = commandData.command.replace(
      '{input}',
      commandData.targetContent
    );
    setLoadingExecute(true);
    const user = store.getState().user.userInfo;

    server
      .call('ai.textToImage', commandData, prompt, '', user)
      .then(data => {
        const file = new File(
          [dataURItoBlob(data.image[0].base64)],
          'image.png',
          {
            type: 'image/png'
          }
        );
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onload = function (e) {
          const url: any = e.target.result;
          setPreviewImageUrl(url);
          setLoadingExecute(false);
        };
      })
      .catch(e => {
        Boardx.Util.Msg.warning(e.error);
        setLoadingExecute(false);
        return;
      });
  };

  return (
    <StyledBox>
      {/* target content */}
      <Box className={classes.inputBox}>
        <Typography className={classes.inputTitle} variant="body1">
          TARGET CONTENT
        </Typography>
        <TextField
          fullWidth
          autoFocus
          classes={{ root: classes.textFieldRoot3 }}
          inputRef={valueRefCategory}
          id="targetContent"
          placeholder="Content"
          type="text"
          variant="outlined"
        />
      </Box>
      <Box
        sx={{ display: 'flex', justifyContent: 'flex-end' }}
        className={classes.inputBox}
      >
        <LoadingButton
          loading={loadingExecute}
          className={classes.executeButton}
          onClick={handleExecutePreview}
          variant="outlined"
        >
          Execute
        </LoadingButton>
      </Box>
      <Box className={classes.inputBox}>
        <Typography className={classes.inputTitle} variant="body1">
          RESULTS
        </Typography>
        <Box
          className={classes.previewImageBox}
          style={{
            backgroundImage: `url(${previewImageUrl})`
          }}
        ></Box>
      </Box>
    </StyledBox>
  );
}
