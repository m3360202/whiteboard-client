import React from 'react';

import { useSelector } from 'react-redux';
import { RootState } from '../../../store';
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';


import { useState } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';
import ChatAgentList from './ChatAgentList';

function ChatAgentComponent() {

    const { t } = useTranslation();

    const currentChatAiPersonaData = useSelector((state: RootState) => state.AIAssist.currentChatAiPersonaData);
    const [openPromptPersonaSelectDialog, setOpenPromptPersonaSelectDialog] =
        useState(false);

    const handleOpenPromptPersonaSelectDialog = () => {
        setOpenPromptPersonaSelectDialog(true);
    };


    return (
        <Box>
            <Box
                sx={{

                    zIndex: 100,
                    backgroundColor: 'rgba(255,255,255,0.85)',
                    width: '100%',
                    justifySelf: 'center',
                }}
            >
                {currentChatAiPersonaData && (<Chip
                    style={{
                        color: 'white',
                        fontSize: '14px',
                        fontWeight: 400,
                        lineHeight: '18px',
                        letterSpacing: '0.16px',
                        border: '1px #31B8FF solid',
                        background: '#16B1FF',
                        marginRight: '12px',
                        marginLeft: '12px',
                    }}
                    label={
                        currentChatAiPersonaData
                            ? currentChatAiPersonaData.name
                            : t('chatAi.personaNotSelected')
                    }
                    variant="outlined"
                />)}
                <Chip
                    style={{
                        color: '#31B8FF',
                        fontSize: '13px',
                        fontWeight: 400,
                        lineHeight: '18px',
                        letterSpacing: '0.16px',
                        border: '1px #31B8FF solid',
                        marginRight: '12px',
                        marginLeft: '12px',
                    }}
                    label={t('chatAi.selectPersona')}
                    variant="outlined"
                    onClick={handleOpenPromptPersonaSelectDialog}
                />
            </Box>

            <ChatAgentList
                openPromptPersonaSelectDialog={openPromptPersonaSelectDialog}
                setOpenPromptPersonaSelectDialog={setOpenPromptPersonaSelectDialog}
            />


        </Box>

    );
}

export default ChatAgentComponent;