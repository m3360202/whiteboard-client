//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';

//** Import Material UI
import Box from '@mui/material/Box';

// import AIAgentChatContent from './AIAgentChatContent';
import ChatDialogContent from 'components/boardChatAI/ChatAI/ChatDialogContent';
import SendMsgForm from 'components/boardChatAI/ChatAI/SendMsgForm';  
function AIAgentChat(props) {
  return (
    <Box sx={{
      width: '100%',
      height: 'calc(100% - 20px)',
      display: 'flex',
      flexDirection: 'column',
      padding: '0px 20px'
    }}>
      <ChatDialogContent dialogFullScreen={true}
        chatType={'agent'} />
     
    </Box>
  );
}

export default AIAgentChat;
