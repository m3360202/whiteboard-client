//** Import react
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import * as fabric from '@boardxus/x-canvas';
// import rehypeMathjax from 'rehype-mathjax';
//** Import i18n
import { useTranslation } from 'react-i18next';
import { CodeBlock } from './CodeBlock';
//** Import Redux kit
import store, { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateAIChatMsgInfoMutation } from 'redux/AiAssistApiSlice';
import { handleSetAiToolBar } from 'store/domArea';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';


//** Import MUI Icons
import MoreVertIcon from 'mui/icons/MoreVertIcon';
import ChatAIAgreeIcon from 'mui/icons/ChatAIAgreeIcon';
import ChatAIDisagreeIcon from 'mui/icons/ChatAIDisagreeIcon';
import ChatItemAudioPlayer from './ChatItemAudioPlayer';
import server from 'startup/serverConnect';


const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '5px 8px',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    color: 'rgba(58, 53, 65, 0.87)',
    letterSpacing: '0.15px'
}));


function ChatItemVoice({ fileUrl, index, message, openMoreMenu, setOpenMoreMenu, openVoiceMenu, setOpenVoiceMenu, }) {

    const { t } = useTranslation();

    const [isShowVoiceText, setIsShowVoiceText] = useState(false);
    const handleCloseVoiceMenu = () => {
        setOpenVoiceMenu(false);
    };

    const handleClickTransferText = text => {
        handleCloseVoiceMenu();
        if (text.trim().length > 0) {
            setIsShowVoiceText(true);
        } else {
            setIsShowVoiceText(false);
            Boardx.Util.Msg.info(t('chatAi.failedToConvertText'));
        }
    };

    return (
        <Box>
            <Box sx={{ display: 'flex', alignItems: 'flex-end' }}>
                <ChatItemAudioPlayer
                    audioSrc={fileUrl}
                    ChatAIVersions="desktopChatAI"
                />
                <IconButton
                    id={`chatVoiceMessageMoreMenu${index}`}
                    onClick={() => setOpenVoiceMenu(!openMoreMenu)}
                    sx={{
                        padding: 0,
                        display: 'flex',
                        alignItems: 'center',
                        width: '24px',
                        height: '38px',
                        // backgroundColor: '#D3F4F4 !important',
                        marginLeft: '6px',
                        borderRadius: '4px',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
                        justifyContent: 'center'
                    }}
                >
                    <MoreVertIcon />
                </IconButton>
                <Menu
                    sx={{
                        padding: '3px 0px',
                        boxShadow:
                            '0px 5px 5px -3px rgba(58, 53, 65, 0.2)',
                        borderRadius: '6px',
                        background: '#FFFFFF'
                    }}
                    anchorEl={document.getElementById(
                        `chatVoiceMessageMoreMenu${index}`
                    )}
                    open={openVoiceMenu}
                    onClose={handleCloseVoiceMenu}
                >
                    <StyledMenuItem

                        onClick={() => handleClickTransferText(message)}
                    >
                        {t('chatAi.conversionText')}
                    </StyledMenuItem>
                </Menu>
            </Box>
            {isShowVoiceText && (
                <Typography
                    sx={{
                        fontWeight: 400,
                        fontSize: '14px',
                        lineHeight: '17px',
                        color: '#232930',
                        padding: '10px',
                        maxWidth: '100%',
                        wordBreak: 'normal',
                        whiteSpace: 'pre-wrap',
                        height: 'auto',
                        background: '#FFFFFF',
                        boxShadow: '0px 1px 2px rgba(0, 0, 0, 0.21)',
                        borderRadius: '4px 4px 4px 4px',
                        boxSizing: 'border-box',
                        overflow: 'hidden',
                        marginTop: '5px'
                    }}
                >
                    {message}
                </Typography>
            )}
        </Box>
    );
}

export default ChatItemVoice;