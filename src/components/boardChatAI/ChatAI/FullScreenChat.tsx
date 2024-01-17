
//** Import react
import React, { useEffect, useState, useRef } from 'react';
import { styled } from '@mui/material/styles';
import { useLocation } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { handleOpenChatUI } from '../../../store/sideBar';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOpenTemplate } from '../../../store/resource';
import {
    handleSetIsPanMode,
    handleSetBoardPanelClicked,
    handleSetDrawingEraseMode,
    handleSetShowAiChatLoading
} from '../../../store/board';
import { changeMode } from '../../../store/mode';
import { handleSetAiToolBar } from '../../../store/domArea';
import {
    useGetAIChatSessionListQuery,
    useGetAllAiCommandQuery
} from '../../../redux/AiAssistApiSlice';
import { useCheckCreditsIsEnoughMutation } from '../../../redux/PricingApiSlice';
import {
    handleSetCurrentChatSession,
    handleSetChatSessionList,
    handleSetCurrentChatAiPersonaData,
    handleSetShowChatAiMaskingLayer
} from '../../../store/AIAssist';
import AIService from '../../../services/AIService';
//** Import Material UI
import Tooltip from '@mui/material/Tooltip';
import { Dialog, DialogTitle, DialogActions } from '@mui/material';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';
import MenuItem from '@mui/material/MenuItem';
import Button from '@mui/material/Button';
import Divider from '@mui/material/Divider';
import FitScreenIcon from '@mui/icons-material/FitScreen';
import CloseFullscreenIcon from '@mui/icons-material/CloseFullscreen';
import ListItemText from '@mui/material/ListItemText';
import ListItemIcon from '@mui/material/ListItemIcon';
import IconButton from '@mui/material/IconButton';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import clsx from 'clsx';
import Drawer from '@mui/material/Drawer';

//** Import MUI Icons
import ChatAIIcon20x20 from '../../../mui/icons/ChatAIIcon20x20';
import ClosePopupIcon from '../../../mui/icons/ClosePopupIcon';
import ChatAIIcon20x20v2 from '../../../mui/icons/ChatAIIcon20x20v2';
import ChatAIIcon24x24 from '../../../mui/icons/ChatAIIcon24x24';
import ClosePopupIcon24x24 from '../../../mui/icons/ClosePopupIcon24x24';
import ChatAIIcon24x24v2 from '../../../mui/icons/ChatAIIcon24x24v2';
import SettingsIcon from '@mui/icons-material/Settings';

//**Import Services
import { BoardService, UtilityService, SysService } from '../../../services';

//**Import Components
import ChatDialogContent from 'components/boardChatAI/ChatAI/ChatDialogContent';
import ChatAISettings from './ChatAISettings';

import AIAssistanChatRecordList from 'pages/aiAssistantPage/AIAssistanChatRecordList';
import ChatAgentComponent from 'components/boardChatAI/agent/ChatAgentComponent';

const FullScreenChat = (props) => {


    const { chatType, fullScreen, showChat, exitAction } = props;
    const dispatch = useDispatch();

    const { t } = useTranslation();
    const [openChatAISettings, setOpenChatAISettings] = useState(false);


    const userInfo = useSelector((state: RootState) => state.user.userInfo);

    const orgInfo = useSelector((state: RootState) => state.org.orgInfo);



    const currentChatSession: any = useSelector(
        (state: RootState) => state.AIAssist.currentChatSession
    );

    const { data: chatSessionList = [], isLoading: isLoadingChatSessionList } =
        useGetAIChatSessionListQuery({
            userId: userInfo.userId,
            orgId: orgInfo.orgId
        });

    useEffect(() => {
        if (showChat) {
            store.dispatch(handleOpenChatUI(true));
        }
    }, [showChat]);

    // useEffect(() => {
    //     AIService.getInstance().loadChatSessionList(chatSessionList, chatType);
    // }, [chatSessionList]);

    const handleClickOpenChatAISettings = () => {
        setOpenChatAISettings(true);
        dispatch(handleSetShowChatAiMaskingLayer(true));
    };
    const handleClickChatSession = async (e, chatSession) => {
        // handleCloseNewChatDialog();
     dispatch(handleSetShowAiChatLoading(false));
    AIService.getInstance().loadChatSession(chatSession);
 
      
    };
 
  
    

    const handleClickNewChat = async e => {
        dispatch(handleSetShowAiChatLoading(false));
        const userId = userInfo.userId;
        const orgId = orgInfo.orgId;
        const includeContext = true;
        const gptModel = userInfo.status == 'free'? 'gpt-3.5-turbo' : 'gpt-4';

        const sessiondata = await AIService.getInstance().createNewChatSession(userId, orgId, includeContext, gptModel)

        // handleCloseNewChatDialog();
    };

    const handleExitAction = () => {
        exitAction();
    }
    const ChatSessionList = function () {
        return (<Box
            sx={{
                display: 'flex',
                flexDirection: 'column',
                width: '300px',
                height: '100%',
                pointerEvents: 'all',
                pt: '16px'
            }}
        >
            <Box sx={{ p: '0 20px', display: 'flex', alignItems: 'center' }}>
                <ChatAIIcon24x24 />
                <Button

                    onClick={handleClickNewChat}
                    variant="text"
                >
                    {t('chatAi.startANewChat')}
                </Button>
            </Box>
            <Divider sx={{ m: '8px 0' }} />
            <Box>
                <Typography sx={{ padding: '10px' }} >
                    {t('chatAi.orContinueWithPreviousChat')}
                </Typography>
                <Box
                    sx={{
                        overflowY: 'scroll',
                        maxHeight: 'calc(100vh - 170px)',
                        height: 'calc(100vh - 170px)'
                    }}
                >
                    {chatSessionList?.map(chatSession => {
                        return (
                            <MenuItem

                                sx={{
                                    backgroundColor: chatSession._id === currentChatSession._id ? '#D3F4F4' : 'transparent',
                                  
                                }}
                                key={chatSession._id}
                                onClick={e => {
                                    handleClickChatSession(e, chatSession);
                                }}
                            >
                                <ListItemIcon>
                                    {chatSession &&
                                        chatSession.promptPersonaData &&
                                        chatSession.promptPersonaData.icon &&
                                        chatSession.promptPersonaData.icon.length > 0 ? (
                                        <img
                                            src={chatSession.promptPersonaData.icon}
                                            style={{ width: '24px', height: '24px' }}
                                        />
                                    ) : (
                                        <ChatAIIcon24x24v2
                                            fill={
                                                chatSession._id === currentChatSession._id
                                                    ? '#3A3541'
                                                    : 'black'
                                            }
                                            fillOpacity={
                                                chatSession._id === currentChatSession._id
                                                    ? '0.87'
                                                    : '0.48'
                                            }
                                        />
                                    )}
                                </ListItemIcon>
                                <ListItemText
                                    sx={{
                                        '& .MuiListItemText-primary': {
                                            fontStyle: 'normal',
                                            fontWeight: 400,
                                            fontSize: '14px',
                                            lineHeight: '20px',
                                            letterSpacing: '0.15px',
                                            color: 'rgba(58, 53, 65, 0.87)',
                                            overflow: 'hidden',
                                            maxWidth: '135px',
                                            whiteSpace: 'nowrap',
                                            textOverflow: 'ellipsis'
                                        }
                                    }}
                                >
                                    {chatSession.name}
                                </ListItemText>
                                <Typography

                                    sx={{
                                        '& .MuiTypography-root': {
                                            fontFamily: 'Inter',
                                            fontStyle: 'normal',
                                            fontWeight: 400,
                                            fontSize: '12px',
                                            lineHeight: '15px',
                                            color: 'rgba(0, 0, 0, 0.4)'
                                        }
                                    }}
                                    variant="body2"
                                    color="text.secondary"
                                >
                                    {new Date(chatSession.createdAt).toLocaleDateString(
                                        'en-US',
                                        {
                                            month: '2-digit',
                                            day: '2-digit',
                                            year: 'numeric'
                                        }
                                    )}
                                </Typography>
                            </MenuItem>
                        );
                    })}
                </Box>
            </Box>
            <Divider sx={{ m: '8px 0' }} />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-around' }}>
                <Button

                    startIcon={<ClosePopupIcon24x24 />}
                    onClick={handleExitAction}
                    variant="text"
                >
                    {t('chatAi.exit')}
                </Button>
                <IconButton
                    style={{
                        padding: 0,
                        width: '36px',
                        height: '36px'
                    }}
                    onClick={handleClickOpenChatAISettings}
                >
                    <SettingsIcon />
                </IconButton>
            </Box>
        </Box>
        )
    }

    return (
        <Box>
            <Box sx={{ overflow: 'hidden', display: 'flex', flexDirection: 'flow' }}>
                <Box sx={{ flexShrink: 0, width: '300px', flexFlow: 0, display: { xs: 'block', md: 'block' } }}>
                    <ChatSessionList />
                </Box>
                <Box sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                    <Box sx={{ height: "100vh", width: '100%', pointerEvents: "all", overflow: 'hidden' }}>

                        <Box sx={{ height: 'calc(100vh-30px)', overflow: 'hidden' }}>

                            <Box sx={{
                                width: '100%',
                          
                             
                                display: 'flex',
                                flexDirection:'row',
                                justifyContent: 'center',
                                height: '50px',
                                alignItems: 'center'
                            }}>

                                {/* <AIAssistanChatRecordList
                                    setOpenChatAISettings={setOpenChatAISettings}
                                    currentSessionName={currentChatSession.name}
                                /> */}


                                <ChatAgentComponent />

                            </Box>
                            <Box sx={{ display: 'flex', alignItems: 'center', flexDirection: 'column' }}>
                                <ChatDialogContent
                                    dialogFullScreen={true}
                                    chatType={chatType}

                                />

                            </Box>
                        </Box>

                    </Box>
</Box>
           
            </Box>

            <ChatAISettings
                openChatAISettings={openChatAISettings}
                setOpenChatAISettings={setOpenChatAISettings}
            />
        </Box>
    );
}


export default FullScreenChat;