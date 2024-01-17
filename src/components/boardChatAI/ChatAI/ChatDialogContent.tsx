//** Import react
import React, { useEffect, useState, useRef } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector } from 'react-redux';

//** Import i18n
import { useTranslation } from 'react-i18next';

import Stack from '@mui/material/Stack';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Chip from '@mui/material/Chip';

//** Import MUI Icons
import LoadingIcon from '../../../mui/icons/LoadingIcon';

//**Import Services
import { BoardService } from '../../../services';

//**Import Components
import ChatItem from './ChatItem/ChatItem';
import SendMsgForm from './SendMsgForm';

let interval = null;

function ChatDialogContent(props) {
  const { dialogFullScreen, chatType } = props;

  const { t } = useTranslation();

  const messagesEndRef: any = React.useRef();

  const aiChatRows = useSelector((state: RootState) => state.AIAssist.aiChatRows);

  const isReading = useSelector((state: RootState) => state.board.isReading);

  const uiType = useSelector((state: RootState) => state.system.currentUIType);
  const showAiChatLoading = useSelector(
    (state: RootState) => state.board.showAiChatLoading
  );

  const currentChatAiPersonaData = useSelector(
    (state: RootState) => state.AIAssist.currentChatAiPersonaData
  );

  const scrollToBottom = () => {
    if (!messagesEndRef.current) return;
    messagesEndRef.current.scrollTop = messagesEndRef.current?.scrollHeight;
  };

  useEffect(() => {
    const scrollAction = event => {
      const distanceFromBottom =
        messagesEndRef.current.scrollHeight -
        (messagesEndRef.current.scrollTop +
          messagesEndRef.current.offsetHeight);
      const reading = store.getState().board.isReading;
      if (distanceFromBottom > 50) {
        if (interval) {
          clearInterval(interval);
          interval = null;
        }
      }
      if (distanceFromBottom < 50) {
        const distanceFromBottom =
          messagesEndRef.current.scrollHeight -
          (messagesEndRef.current.scrollTop +
            messagesEndRef.current.offsetHeight);
        if (distanceFromBottom < 50 && reading && !interval) {
          interval = setInterval(() => {
            scrollToBottom();
          }, 100);
        }
      }
    };

    const chatAIUIRef = messagesEndRef.current;
    chatAIUIRef.addEventListener('scroll', scrollAction, true);
    return () => {
      chatAIUIRef.removeEventListener('scroll', scrollAction, true);
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
    };
  }, []);

  useEffect(() => {
    if (isReading) {
      scrollToBottom();
      if (!interval) {
        interval = setInterval(() => {
          scrollToBottom();
        }, 500);
      }
    }
    if (!isReading) {
      if (interval) {
        clearInterval(interval);
        interval = null;
      }
      setTimeout(() => {
        scrollToBottom();
      }, 1000);
    }
    scrollToBottom();
  }, [aiChatRows]);

  useEffect(() => {
    document
      .getElementById('chatAIUI')
      .addEventListener('scroll', scrollChatAIUIHandler);
    return () => {
      document
        .getElementById('chatAIUI')
        ?.removeEventListener('scroll', scrollChatAIUIHandler);
    };
  }, []);

  function scrollChatAIUIHandler(e) {
    if (e.target.scrollTop == 0) {
      const currentValue = BoardService.getInstance().getChatLimt();
      BoardService.getInstance().setChatLimt(currentValue + 5);
    }
  }


  const EmptyChatComponent = () => {
    return (<Box sx={{ width: 'calc(100% - 12px)' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: '12px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            paddingLeft: '8px'
          }}
        >
          <Avatar
            style={{
              width: '36px',
              height: '36px',
              marginRight: '10px',
              background: '#FFFFFF',
              boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
              borderRadius: '20px'
            }}
            alt={'ChatAIAvatarIcon'}
            id="avatar-AI-img"
          >
            {/* <ChatAIIcon24x24v3 /> */}
            <img
              style={{ width: '24px', height: '24px' }}
              src="/images/aiChat/ChatAI.png"
            />
          </Avatar>

          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography style={{
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '25px',
              color: '#232930',
              padding: '15px',
              // maxWidth: '280px',
              wordBreak: 'normal',
              // whiteSpace: 'pre-wrap',
              height: 'auto',
              background: '#FFFFFF',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
              borderRadius: '4px 0px 4px 4px',
              boxSizing: 'border-box',
              overflow: 'hidden',

            }}>
              {t('chatAi.chatAIPresentation')}
            </Typography>
          </Box>
        </Box>

        <Typography style={{
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '15px',
          color: 'rgba(0, 0, 0, 0.4)',
          marginTop: '8px',
          marginLeft: '53px',
          textAlign: 'left'
        }} variant="caption">
          {new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: '2-digit',
            hour12: true
          })}
        </Typography>
      </Box>
    </Box>)
  }

  const AgentCompontent = () => {
    return (<Box sx={{ width: 'calc(100% - 12px)' }}>
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'flex-end',
          flexDirection: 'column',
          alignItems: 'flex-start',
          mt: '12px'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            alignItems: 'flex-start',
            paddingLeft: '8px'
          }}
        >
          <Avatar
            style={{
              width: '36px',
              height: '36px',
              marginRight: '10px',
              background: '#FFFFFF',
              boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
              borderRadius: '20px'
            }}
            alt={'ChatAIAvatarIcon'}
            id="avatar-AI-img"
          >
            {/* <ChatAIIcon24x24v3 /> */}
            <img
              style={{ width: '24px', height: '24px' }}
              src="/images/aiChat/ChatAI.png"
            />
          </Avatar>

          <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
            <Typography style={{
              fontWeight: 400,
              fontSize: '14px',
              lineHeight: '25px',
              color: '#232930',
              padding: '15px',
              // maxWidth: '280px',
              wordBreak: 'normal',
              // whiteSpace: 'pre-wrap',
              height: 'auto',
              background: '#FFFFFF',
              boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
              borderRadius: '4px 0px 4px 4px',
              boxSizing: 'border-box',
              overflow: 'hidden'
            }}>
              {currentChatAiPersonaData.description}
            </Typography>
          </Box>
        </Box>

        <Typography style={{
          fontWeight: 400,
          fontSize: '12px',
          lineHeight: '15px',
          color: 'rgba(0, 0, 0, 0.4)',
          marginTop: '8px',
          marginLeft: '53px',
          textAlign: 'left'
        }} variant="caption">
          {new Date().toLocaleString('en-US', {
            month: 'numeric',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: '2-digit',
            hour12: true
          })}
        </Typography>
      </Box>
    </Box>);
  };


  const getWidth = () => {
    const isMobile = Boardx.Util.isMobile();
    if (chatType === 'agent') {
      return '680px';
    }
    if (isMobile) {
      return '100%';
    }
    if (dialogFullScreen) {
      if (window.innerWidth > 680)
        return 'calc(70vw-240px )';
      else {
        return '100%';
      }
    }
  }

  const getMinWidth = () => {
    const isMobile = Boardx.Util.isMobile();
    if (chatType == 'agent') {
      return '480px';
    }
    if (isMobile) {
      return '400px';
    }
    if (dialogFullScreen && chatType=='dashboard') {
 
        return 'calc(100vw-240px )';
    }


    if (dialogFullScreen) {
      
        return '680px';
   
    }
  }


  const getHeight = () => {
    const isMobile = Boardx.Util.isMobile();
    if (chatType == 'agent') {
      return 'calc(100vh - 150px)';
    }
    if (isMobile) {
      return 'calc(100vh - 140px)';
    }
    if (dialogFullScreen && chatType=='dashboard') {
      return 'calc(100vh - 180px)';
    }

    if (dialogFullScreen ) {
      return 'calc(100vh - 140px)';
    }

    return '420px';

  }

  const getPadding = () => {
    if (chatType == 'agent') {
      return '0px';
    }

    if (chatType == "boardChat" && !dialogFullScreen) {
      return '0px';
    }
    return '0px';

  }
  return (
    <Box sx={{ alignSelf: 'center', width:getWidth() }}>


      <Box
        id="chatAIUI"
        sx={{
           display:'flex',
          maxWidth: '1024px',
          overflowX: 'scroll',
          flexDirection:'column',
          pointerEvents: 'all',
          width: getWidth(),
          height: getHeight(),
          minWidth: getMinWidth(),
          alignSelf: 'center',
          paddingTop: getPadding(),
          // padding: dialogFullScreen ? '25px calc((100vw - 300px) / 10) 0px' : 0,
          boxSizing: 'border-box'
        }}
        ref={messagesEndRef}
      >
        {dialogFullScreen && <Box sx={{ height: 20 }}></Box>}

        {aiChatRows.length === 0 && (
          <EmptyChatComponent />
        )}

        {currentChatAiPersonaData &&
          currentChatAiPersonaData.description &&
          currentChatAiPersonaData.description.length !== 0 && (
            <AgentCompontent />
          )}

        {aiChatRows &&
          aiChatRows.map((item, index) => {
            return (
              <ChatItem
                key={index}
                item={item}
                index={index}
                dialogFullScreen={dialogFullScreen}
                chatType={chatType}
              />
            );
          })}



        {dialogFullScreen && <Box sx={{ height: 20 }}></Box>}

      </Box>

    
        <SendMsgForm dialogFullScreen={dialogFullScreen} chatType={chatType} />
   

    </ Box>
  );
}

export default ChatDialogContent;
