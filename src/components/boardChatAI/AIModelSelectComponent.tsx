import React, { useState, useEffect } from 'react';
import { Select, Box } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
//** Import react
import { useSelector, useDispatch } from 'react-redux';

import { styled } from '@mui/material/styles';
import store, { RootState } from '../../store';
//** Import i18n
import { useTranslation } from 'react-i18next';

import { AIService } from 'services';

const AIModelSelectComponent = ({ save, changeModel }) => {
  const { t } = useTranslation();
  const dispatch = useDispatch();

  const currentChatSession: any = useSelector(
    (state: RootState) => state.AIAssist.currentChatSession
  );


  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const [gptModel, setGpt] = useState(
    userInfo.status == 'free' ? 'gpt-3.5-turbo' : 'gpt-4');
 

const handleAIModelChange = async event => {
  // console.log('handleAIModelChange', event.target.value);
  setGpt(event.target.value);
  changeModel(event.target.value);

  if (save) {
    Boardx.Util.Msg.success(t('chatAi.changeGPTModelSuccessfully'));

    handleSaveChatSetttings(event.target.value);
  }
};

 
useEffect(() => {
  if(currentChatSession) {
    setGpt(currentChatSession.gptModel);
    return;
    }
    //check if userInfo.Status=='free' then set gptModel to gpt-3.5-turbo
    if (userInfo.status == 'free') {
      setGpt('gpt-3.5-turbo');
      handleSaveChatSetttings('gpt-3.5-turbo');
    }

}, [currentChatSession, userInfo]);

 


const handleSaveChatSetttings = async gptModel => {
  await AIService.getInstance().handleSaveChatSettings(
    gptModel,
    null,
    null,
    null
  );
};
return (
  <Select
    sx={{
      '& .MuiSelector-root': {
        border: 'none'
      }
    }}
    id="AIModelSelect"
    onChange={event => handleAIModelChange(event)}
    value={gptModel}
    // disabled={userInfo.status=='free'}
    style={{
      width: '105px',
      zIndex: 1000,
      padding: '0px',
      height: '30px',
      color: '#111111',
 

    }}
  //   IconComponent={()=><ExpandMoreIcon/>}
  >
    <MenuItem
      // classes={{ root: classes.menuItemRoot3 }}
      sx={{
        fontWeight: 400,
        fontSize: '14px',
        lineHeight: '13px'
      }}
      value="gpt-3.5-turbo"
    >
      gpt-3.5
    </MenuItem>
    {userInfo.status == 'pro' && (
      <MenuItem
        // classes={{ root: classes.menuItemRoot3 }}
        sx={{
          fontWeight: 400,
          fontSize: '14px',
          lineHeight: '13px'
        }}
        value="gpt-4"
      >
        gpt-4
      </MenuItem>
    )}
  </Select>
);
};

export default AIModelSelectComponent;
