//** Import react
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';

// import rehypeMathjax from 'rehype-mathjax';
//** Import i18n
import { useTranslation } from 'react-i18next';
 
//** Import Redux kit
import store, { RootState } from 'store';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateAIChatMsgInfoMutation } from 'redux/AiAssistApiSlice';
import { handleSetAiToolBar } from 'store/domArea';

import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';



//**Import Services
import {
  WidgetService,
  ClipboardService,
  UtilityService
} from 'services';


const StyledMenuItem = styled(MenuItem)(({ theme }) => ({
    padding: '5px 8px',
    fontSize: '14px',
    lineHeight: '20px',
    fontWeight: 400,
    color: 'rgba(58, 53, 65, 0.87)',
    letterSpacing: '0.15px'
  }));

  

function ChatItemMenu({chatType, item, index, openMoreMenu,setOpenMoreMenu }){
   
    const { t } = useTranslation();
    const handleCloseMenu = () => {
        setOpenMoreMenu(false);
        store.dispatch(handleSetAiToolBar(false));
      };
      const userInfo = useSelector((state: RootState) => state.user.userInfo);

      
    const handleAddNoteToBoard = text => {
        handleCloseMenu();
        const newText = text;
        canvas.createWidgetatCurrentLocationByType('WBText', {
          text: newText,
          useCenterOfScreen: true,
          backgroundColor: '#d3f4f4'
        });
        Boardx.Util.Msg.info(t('chatAi.textHasBeenAddedToTheBoard'));
        setTimeout(() => {
          canvas.getActiveObject().exitEditing();
        }, 100);
      };
    
      const handleAddStickyNoteToBoard = async text => {
        handleCloseMenu();
     
        await canvas.AddMultipleStickyNoteToBoardByText(text);
     
        Boardx.Util.Msg.info(t('chatAi.textHasBeenAddedToTheBoard'));
      };


      const handleClickCopyText = text => {
        handleCloseMenu();
        ClipboardService.getInstance().clipboardCopy(text);
        Boardx.Util.Msg.info(t('chatAi.textHasBeenCopied'));
      };

      const handleClickSendEmail = async text => {
        handleCloseMenu();
    
        await UtilityService.getInstance().sendEmail(userInfo.email, 'BoardX Chat AI', text)
        Boardx.Util.Msg.success(t('chatAi.emailHasBeenSent'));
      
      };


    return (
        <Menu
        sx={{
          padding: '3px 0px',
          boxShadow:
            '0px 5px 5px -3px rgba(58, 53, 65, 0.2)',
          borderRadius: '6px',
          // background: '#FFFFFF'
        }}
        anchorEl={document.getElementById(`chatMessageMoreMenu${index}`)}
        open={openMoreMenu}
        onClose={handleCloseMenu}
      >
        {chatType === 'boardChat' && (
          <StyledMenuItem

            onClick={() => handleAddNoteToBoard(item.message)}
          >
            {t('chatAi.addAsText')}
          </StyledMenuItem>
        )}
        {chatType === 'boardChat' && (
          <StyledMenuItem

            onClick={() => handleAddStickyNoteToBoard(item.message)}
          >
            {t('chatAi.addAsStickyNote')}
          </StyledMenuItem>
        )}
        <StyledMenuItem
          onClick={() => handleClickCopyText(item.message)}
        >
          {t('chatAi.copyText')}
        </StyledMenuItem>
        <StyledMenuItem

          onClick={() => handleClickSendEmail(item.message)}
        >
          {t('chatAi.sendEmail')}
        </StyledMenuItem>
      </Menu>
    );
}



export default ChatItemMenu;