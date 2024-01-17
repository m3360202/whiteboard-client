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
import Typography from '@mui/material/Typography';
import clsx from 'clsx';


//** Import MUI Icons
import ChatAIAgreeIcon from 'mui/icons/ChatAIAgreeIcon';
import ChatAIDisagreeIcon from 'mui/icons/ChatAIDisagreeIcon';

function ChatItemFooter({ item, includeFeedback }) {
    const [updateAIChatMsgInfo] = useUpdateAIChatMsgInfoMutation();


    const handleIsAgreeChatAIMsg = async message => {
        let updateInfo = {
            agree: message && message.agree ? false : true,
            disagree: false,
            chatAIMessage: message
        };
        await updateAIChatMsgInfo({ ...updateInfo });
    };

    const handleIsDisagreeChatAIMsg = async message => {
        let updateInfo = {
            agree: false,
            disagree: message && message.disagree ? false : true,
            chatAIMessage: message
        };
        await updateAIChatMsgInfo({ ...updateInfo });
    };



    return (
        <Box sx={{
            display: 'flex',
            alignItems: 'center'
        }}>
            <Typography sx={{
                fontWeight: 400,
                fontSize: '12px',
                lineHeight: '15px',
                color: 'rgba(0, 0, 0, 0.4)',
                marginTop: '8px',
                marginLeft: '53px',
                textAlign: 'left'
            }} variant="caption">
                {item.createdAt
                    ? new Date(item.createdAt).toLocaleString('en-US', {
                        month: 'numeric',
                        day: 'numeric',
                        hour: 'numeric',
                        minute: 'numeric',
                        second: '2-digit',
                        hour12: true
                    })
                    : null}
            </Typography>
            {
                includeFeedback && (
                    <Box sx={{ mt: '2px' }}>
                        <IconButton
                            onClick={() => handleIsAgreeChatAIMsg(item)}
                            sx={{
                                padding: 0,
                                marginLeft: '12px',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                            }}
                        >
                            <ChatAIAgreeIcon
                                fill={item && item.agree ? '#007FFF' : '#3A3541'}
                                fillOpacity={item && item.agree ? '1' : '0.54'}
                            />
                        </IconButton>
                        <IconButton
                            onClick={() => handleIsDisagreeChatAIMsg(item)}
                            sx={{
                                padding: 0,
                                marginLeft: '12px',
                                width: '18px',
                                height: '18px',
                                cursor: 'pointer'
                            }}
                        >
                            <ChatAIDisagreeIcon
                                fill={item && item.disagree ? 'rgb(235, 0, 20)' : '#3A3541'}
                                fillOpacity={item && item.disagree ? '1' : '0.54'}
                            />
                        </IconButton>
                    </Box>
                )
            }
        </Box>
    );
}


export default ChatItemFooter;