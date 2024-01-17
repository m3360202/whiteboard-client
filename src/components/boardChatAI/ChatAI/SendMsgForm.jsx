// ** React Imports
import React, { useState, SyntheticEvent, useEffect, useRef } from 'react';
import RecordRTC from 'recordrtc';

//** Import i18n
import { useTranslation } from 'react-i18next';

// ** Import Redux
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  handleSetShowRecordButton,
  handleSetShowRecordingImg,
  handleSetShowAiChatLoading,
  handleSetIsReading
} from '../../../store/board';

import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import IconButton from '@mui/material/IconButton';
import Box, { BoxProps } from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import CachedIcon from '@mui/icons-material/Cached';
import Typography from '@mui/material/Typography';
//** Import MUI Icons
import LoadingIcon from '../../../mui/icons/LoadingIcon';

// ** Import Services
import {
  BoardService,
  UtilityService,
  FileService,
  AIService
} from '../../../services';

// ** Icons Imports
import ChatAIMikrofonIcon from '../../../mui/icons/ChatAIMikrofonIcon';
import ChatAIKeyboardIcon from '../../../mui/icons/ChatAIKeyboardIcon';
import ChatAIUploadFileIcon from '../../../mui/icons/ChatAIUploadFileIcon';
import SendMsgIcon from '../../../mui/icons/SendMsgIcon';
import server, { CLOUD_FUNCTION_URL } from '../../../startup/serverConnect';

import ChatUploadFile from './ChatUploadFile';
import AIModelSelectComponent from '../AIModelSelectComponent';



const Form = styled('form')(({ theme }) => ({
  padding: theme.spacing(1, 1, 1)
}));



// ** Styled Components
const ChatFormWrapper = styled(Box)(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  boxShadow: theme.shadows[1],
  justifyContent: 'space-between',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: theme.palette.background.paper
}));

/***
 * @description: Send the message to the AI assistant
 * 
 */
const SendMsgForm = props => {
  const { dialogFullScreen, chatType } = props;
  const isReading = useSelector((state: RootState) => state.board.isReading);
  const currentChatSession = useSelector(
    state => state.AIAssist.currentChatSession
  );
  const showAiChatLoading = useSelector((state: RootState) => state.board.showAiChatLoading);

  const { t } = useTranslation();

  const dispatch = useDispatch();

  // ** State
  const [msg, setMsg] = useState('');
  const textAreaRef = useRef(null);
  const showRecordButton = useSelector(
    (state) => state.board.showRecordButton
  );
  const showRecordingImg = useSelector(
    (state) => state.board.showRecordingImg
  );

  const aiChatMessages = useSelector((state) => state.AIAssist.aiChatMessages);
  const messages = [...aiChatMessages];
  // voice
  const [recording, setRecording] = useState(false);
  const [audioRecorder, setAudioRecorder] = useState(null);
  const [recordAudioFile, setRecordAudioFile] = useState(null);
  const [accessRecord, setAccessRecord] = useState(false);
  const [isComposing, setIsComposing] = useState(false);
  const [voiceTime, setVoiceTime] = useState(0);
  const [isTouchDev, setIsTouchDev] = useState(false);
  const [isShowCancelTheAvaRequestBtn, setIsShowCancelTheAvaRequestBtn] = useState(false);
  const [abortController, setAbortController] = useState(null);




  useEffect(() => {
    return () => {
      abortController?.abort();
    };
  }, []);

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = () => {
    setIsComposing(false);
  };



  /***
   * @description: Send the message to the AI assistant
   */
  const handleSendMsg = async (e) => {
    e.preventDefault();

    if (msg?.trim().length == 0) return;

    const userMessage = msg.trim();
    let contentOnTheBoard = await getContentOnTheBoard();

    dispatch(handleSetIsReading(true));
    dispatch(handleSetShowAiChatLoading(true));
    setIsShowCancelTheAvaRequestBtn(true);

    setMsg('');
    setAbortController(null);
    let abortController1 = new AbortController();
    setAbortController(abortController1);
    await AIService.getInstance().handleRequestAIChat(userMessage, abortController, contentOnTheBoard, chatType);

  };


  /***
   * @description: Get the content on the board
   */
  const getContentOnTheBoard = async () => {
    if (!location.pathname.includes('/board/')) return false;

    if (currentChatSession.isIncludeBoardContent) {
      const currentViewportTextArr =
        await BoardService.getInstance().getCurrentOptionTextArr();

      if (currentViewportTextArr.length === 0) return false;

      let textArray = [
        `${t('chatAi.contentOnTheBoardTitle')}`,
        ...currentViewportTextArr
      ];

      return textArray.join('\n').trim();
    }

    return false;
  };


  const handleShowRecordBtn = () => {
    let showBtn = store.getState().board.showRecordButton;
    if (!accessRecord) {
      navigator.mediaDevices
        .getUserMedia({ audio: true, video: false })
        .then(stream => {
          // 用户已授权录音
          setAccessRecord(true);
        })
        .catch(error => {
          // 用户未授权录音
          setAccessRecord(false);
        });
    } else {
      if (showBtn) {
        store.dispatch(handleSetShowRecordButton(false));
      } else {
        store.dispatch(handleSetShowRecordButton(true));
      }
    }
  };

  /***
   * @description: Start recording
   */
  const handleStartRecord = async () => {

    const startRecordTime = new Date().getTime();
    setVoiceTime(startRecordTime);
    //show gif
    store.dispatch(handleSetShowRecordingImg(true));


    const stream = await navigator.mediaDevices.getUserMedia({
      audio: true,
      video: false
    });

    // 使用RecordRTC创建录音机
    const recorder = new RecordRTC(stream, {
      type: 'audio',
      mimeType: 'audio/mp3',
      recorderType: RecordRTC.StereoAudioRecorder,
      numberOfAudioChannels: 1,
      desiredSampRate: 16000,
      disableLogs: true,
      timeSlice: 5000,
      bitsPerSecond: 16
    });
    setAudioRecorder(recorder);

    // 开始录音
    recorder.startRecording();
    setRecording(true);
  };



  /***
   * @description: Stop recording
   */
  const handleStopRecord = () => {


    store.dispatch(handleSetShowRecordingImg(false));


    const endRecordTime = new Date().getTime();

    if (endRecordTime - voiceTime > 1500) {
      if (audioRecorder) {
        audioRecorder.stopRecording(() => {
          const audioBlob = audioRecorder.getBlob();
          // 下载录音文件
          setRecordAudioFile(audioBlob);
          setAudioRecorder(null);
        });
      }
      setRecording(false);
      return;
    }

    dispatch(handleSetShowAiChatLoading(false));
    setIsShowCancelTheAvaRequestBtn(false);
    setRecording(false);
    Boardx.Util.Msg.info(t('chatAi.recordingVoiceTips'));
  };




  /***
   * @description: Handle the recording file
   */
  useEffect(() => {
    if (recordAudioFile && recording === false) {
      if (!recordAudioFile.size || recordAudioFile.size === 0) {
        //console.log('recordAudiofilesize---', recordAudioFile.size);
        return;
      }

      (async () => {
        let contentOnTheBoard = await getContentOnTheBoard();
        await AIService.getInstance().handleVoiceChat(recordAudioFile, currentChatSession, contentOnTheBoard, abortController);
        setRecordAudioFile(null);
        // setIsShowCancelTheAvaRequestBtn(true);
      })();

    }

  }, [recordAudioFile]);


  useEffect(() => {
    (async () => {
      const permission = await navigator.permissions.query({
        name: 'microphone'
      });
      if (permission.state === 'granted') {
        console.log('Microphone access granted');
        setAccessRecord(true);
      } else {
        console.log('Microphone permission is still pending');
      }
    })();

    if (
      store.getState().system.currentUIType === 'mobile' ||
      window.navigator.userAgent.indexOf('iPad') > 0
    ) {
      setIsTouchDev(true);
    }

    return () => {
      handleStopRecord();
    };
  }, []);


  const handleKeyDownSend = event => {
    if (isComposing) {
      return;
    }

    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      handleSendMsg(event);
    }
  };

  const handleClickcancelTheAvaRequest = () => {
    abortController?.abort('user cancel the request');
    // reciveData = false;
    dispatch(handleSetShowAiChatLoading(false));
    setIsShowCancelTheAvaRequestBtn(false);
    dispatch(handleSetIsReading(false));
    setAbortController(null);
  }
  const getWidth = () => {
    const isMobile = Boardx.Util.isMobile();
    if (chatType === 'agent') {
      return '100%';
    }
    if (isMobile) {
      return '95%';
    }

    if(chatType === 'recentChat'){
      if(dialogFullScreen){
        return '95%';
      }else{
        return '450px'
      }
    }

    return '99%';
    // if (dialogFullScreen) {
    //   if (window.innerWidth > 680)
    //     return 'calc(70vw - 240px)';
    //   else {
    //     return '480px';
    //   }
    // }
  }

  const getHeight = () => {
    const isMobile = Boardx.Util.isMobile();
    if (isMobile) {
      return 'calc(100vh - 100px)';
    }
    if (dialogFullScreen) {
      return 'calc(100vh - 100px)';
    }
  }
  const getMinWidth = () => {
    const isMobile = Boardx.Util.isMobile();
    if (chatType == 'agent') {
      return '635px';
    }
    if (isMobile) {
      return '400px';
    }
    if (dialogFullScreen) {

      return '635px';

    }
  }
  return (
    <Box id="abc" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: getWidth(), minWidth: getMinWidth(), }}>
      <Box sx={{
        display: 'flex', width:  getWidth(), minWidth: getMinWidth(), flexWrap: 'nowrap',
       justifyContent: 'space-between',
        padding: '0px',
        maxWidth: '1024px',
        flexDirection: 'row', alignItems: 'center', height: '30px'
      }}>
        <Box sx={{ alignSelf: 'flex-start', width: '150px', height: '30px', marginLeft: '12px' }}>
          <AIModelSelectComponent save={true} changeModel={() => { }} />

        </Box>
        <Box sx={{ width: '180px', height: '20px' }}>
        {showRecordingImg && (
              <Box
                style={{
                  textAlign: 'center',
                  height: '30px',
                  padding: '20px 0',
            
                  // background: '',
                  boxSizing: 'unset',
 
   
      
                }}
              >
                <div style={{ height: 20 }}>
                  <div style={{
        
                    width: '120px',
                    height: 15,
                    overflow: 'hidden',
                    display: 'flex',
                    
                  }}>
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14, 15].map(
                      i => (
                        <div
                          key={i}
                          style={{
                            width: 120,
                            height: 15,
                            borderRadius: 4,
                            backgroundColor: '#008c00',
                            transformOrigin: 'bottom',
                            animationDelay: `${i * 0.08}s`
                          }}
                          className="chatAi-loading-voiceAnimation"
                        ></div>
                      )
                    )}
                  </div>
                </div>
              </Box>
            )}
          <Button
            variant="outlined"
            onClick={handleClickcancelTheAvaRequest}
            startIcon={<CachedIcon />}
            sx={{
              display: isReading & !showAiChatLoading ? 'flex' : 'none',
              border: '1px solid #a3a3a3',
              color: '#a3a3a3',
              backgroundColor: 'transparent',
              fontSize: '12px',
              padding: '4px',
              minHeight: 'unset',
              alignSelf: 'center',
              height: 'unset',
              '&:hover': {
                textDecoration: 'none',
                backgroundColor: 'rgba(25, 118, 210, 0.04)',
                border: '1px solid #a3a3a3a'
              },
              '& .MuiSvgIcon-root': {
                width: '16px',
                height: '16px'
              }
            }}
          >
            {t('chatAi.stopGenerating')}
          </Button>
          {showAiChatLoading ? (
            <Box sx={{
              margin: '10px 0px',
              display: 'flex',
              alignSelf: 'center',


            }}>
              <LoadingIcon className="chatAi-loading-icon" />
              <Typography sx={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: 'rgba(0, 0, 0, 0.4)',
                marginLeft: '12px'
              }}>
                {t('chatAi.generatingTheResult')}
              </Typography>
            </Box>
          ) : null}
        </Box>
        <Box sx={{ width: '100px', height: '20px' }}>

        </Box>

      </Box>

      <Box sx={{width: getWidth(),      maxWidth: '1024px', minWidth: getMinWidth()}}>
        <Form
          // sx={{
          //   p: 0,
          //   pointerEvents: 'all',
          //   ml: dialogFullScreen ? chatType === 'recentChat' ? 'none' : '300px' : 'none'
          // }}
          sx={{
         
            width: getWidth(),      maxWidth: '1024px', minWidth: getMinWidth()
            // minWidth: getMinWidth(),
            // padding: '10px',

            // maxWidth: '1024px',
     

          }}
        >
          <Box sx={{}}>

  

            <ChatFormWrapper

              style={{
                display: 'flex',
                flexDirection: 'column',
                boxSizing: 'border-box',
                backgroundColor: 'transparent',
                height: 'auto',
                padding: '2px',
                position: 'relative'
                // padding: dialogFullScreen
                //   ? '12px calc((100vw - 300px) / 10) 30px'
                //   : '12px'
              }}
            >


              <Box
                sx={{
                  flexGrow: 1,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  width: '100%',
                  position: 'relative'
                }}
              >
                {showRecordButton && (
                  <Button
                    sx={{
                      width: '100%',
                      height: '32px',
                      color: '#232930',
                      backgroundColor: 'rgba(58, 53, 65, 0.08) !important',
                      marginLeft: '4px',
                      borderRadius: '3px',
                      padding: 0,
                      fontSize: '14px',
                      fontWeight: 400
                    }}
                    onMouseDown={handleStartRecord}
                    onMouseUp={handleStopRecord}
                  >
                    {!showRecordingImg
                      ? t('chatAi.mouseClickAndHoldToRecord')
                      : t('chatAi.releaseSendVoice')}
                  </Button>
                )}

                {!showRecordButton && (
                  <TextField
                    placeholder={t('chatAi.typeYourPromptHere')}
                    multiline
                    ref={textAreaRef}
                    value={msg}
                    maxRows={5}
                    onChange={e => setMsg(e.target.value)}
                    onKeyDown={handleKeyDownSend}
                    onCompositionStart={handleCompositionStart}
                    onCompositionEnd={handleCompositionEnd}
                    autoFocus
                    sx={{
                      width: '100%',
                      background: '#F4F5FA',
                      boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
                      borderRadius: '3px',
                      '& .MuiInputBase-root': {
                        padding: '7px 32px 7px 7px'
                      },
                      '& .MuiInputBase-input': {
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#232930',
                        backgroundColor: "#F4F5FA",
                        // zIndex: 1
                      },
                      '& .MuiOutlinedInput-notchedOutline': {
                        display: 'none'
                      }
                    }}
                  />
                )}

                <IconButton
                  sx={{
                    width: '28px',
                    height: '28px',
                    cursor: 'pointer',
                    p: 0,
                    position: 'absolute',
                    right: !showRecordButton ? '75px' : '45px',
                    top: '50%',
                    transform: ' translate(0px, -50%)'
                  }}
                  onClick={handleShowRecordBtn}
                >
                  {showRecordButton ? (
                    <ChatAIKeyboardIcon />
                  ) : (
                    <ChatAIMikrofonIcon />
                  )}
                </IconButton>

                {!showRecordButton && (
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <IconButton
                      sx={{
                        width: '32px',
                        height: '32px',
                        cursor: 'pointer',
                        padding: 0,
                        marginLeft: '4px'
                      }}
                      onClick={handleSendMsg}
                    >
                      <SendMsgIcon color={msg.length > 0 ? '#F21D6B' : 'rgba(35, 41, 48, 0.65)'} />
                    </IconButton>
                  </Box>
                )}

                <ChatUploadFile />
              </Box>
            </ChatFormWrapper>
          </Box>
        </Form>
      </Box>
    </Box>

  );
};

export default SendMsgForm;
