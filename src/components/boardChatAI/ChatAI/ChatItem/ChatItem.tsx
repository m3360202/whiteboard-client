//** Import react
import React, { useEffect, useState } from 'react';

// import rehypeMathjax from 'rehype-mathjax';
//** Import i18n
import { useTranslation } from 'react-i18next';
import { CodeBlock } from './CodeBlock';
//** Import Redux kit
import store, { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateAIChatMsgInfoMutation } from 'redux/AiAssistApiSlice';
import { handleSetAiToolBar } from 'store/domArea';

import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';


//** Import MUI Icons
import ChatItemAudioPlayer from './ChatItemAudioPlayer';
import ChatItemVoice from './ChatItemVoice';
import ChatItemMenu from './ChatItemMenu';
import ChatItemFile from './ChatItemFile';
import ChatItemMarkdown from './ChatItemMarkdown';
import ChatItemFooter from './ChatItemFooter';

function ChatItem({ item, index, dialogFullScreen, chatType }) {
  const { t } = useTranslation();
  const [openMoreMenu, setOpenMoreMenu] = React.useState(false);
  const [openVoiceMenu, setOpenVoiceMenu] = React.useState(false);
  const [updateAIChatMsgInfo] = useUpdateAIChatMsgInfoMutation();



  return (
    <Box sx={{ margin: '5px' }}>
      {item.type === 'user' && (
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'flex-end',
            flexDirection: 'column',
            alignItems: 'flex-start',
            mt: '14px',
          }}
        >
          <Box sx={{ display: 'flex', alignItems: 'flex-start', pl: '8px' }}>
            {/* 头像 */}
            <Avatar
              key={store.getState().user.userInfo.name}
              alt={
                store.getState().user.userInfo.name &&
                store.getState().user.userInfo.name.toUpperCase()
              }
              {...Boardx.Util.stringAvatar(item.username)}
              // alt={user.username.toUpperCase()}
              style={{
                width: '36px',
                height: '36px',
                marginRight: '10px'
              }}
              id="avatar-img"
              src={store.getState().user.userInfo.avatar}
            >
              {store.getState().user.userInfo.name?.toUpperCase().charAt(0)}
            </Avatar>

            {/* 消息 */}
            {item.msgType && item.msgType === 'voice' && (
              <ChatItemVoice index={index} fileUrl={item.fileUrl} message={item.message} openMoreMenu={openMoreMenu} setOpenMoreMenu={setOpenMoreMenu} openVoiceMenu={openVoiceMenu} setOpenVoiceMenu={setOpenVoiceMenu} />
            )}

            {item.msgType && item.msgType === 'file' && (
              <ChatItemFile item={item} index={index} />
            )}

            {!item.msgType && (
              <ChatItemMarkdown item={item} index={index} dialogFullScreen={dialogFullScreen} openMoreMenu={openMoreMenu} setOpenMoreMenu={setOpenMoreMenu} />
            )}
          </Box>

          <ChatItemFooter item={item} includeFeedback={false} />

          <ChatItemMenu chatType={chatType} item={item} index={index} openMoreMenu={openMoreMenu} setOpenMoreMenu={setOpenMoreMenu} />
        </Box>
      )}

      {item.type !== 'user' && 
        item.message !== '' 
        && (
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
                pl: '8px'
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
                alt="ChatAIAvatarIcon"
                id="avatar-AI-img"
              >
                {/* <ChatAIIcon24x24v3 /> */}
                <img
                  style={{ width: '24px', height: '24px' }}
                  src="/images/aiChat/ChatAI.png"
                />
              </Avatar>

              {item.msgType && item.msgType === 'voice' && (
                <ChatItemAudioPlayer
                  audioSrc={item.fileUrl}
                  ChatAIVersions="desktopChatAI"
                />
              )}

              {item.msgType !== 'voice' && (
                <ChatItemMarkdown item={item} index={index} dialogFullScreen={dialogFullScreen} openMoreMenu={openMoreMenu} setOpenMoreMenu={setOpenMoreMenu} />
              )}
            </Box>

            <ChatItemFooter item={item} includeFeedback={true} />

            <ChatItemMenu chatType={chatType} item={item} index={index} openMoreMenu={openMoreMenu} setOpenMoreMenu={setOpenMoreMenu} />
          </Box>
        )
      }
    </Box>
  );
}

const ChatItemMemo = React.memo(ChatItem);

export default ChatItemMemo;
