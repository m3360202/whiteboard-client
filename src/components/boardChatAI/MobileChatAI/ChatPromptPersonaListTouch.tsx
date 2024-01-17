//** Import react
import React from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useUpdateAIChatSessionMutation } from '../../../redux/AiAssistApiSlice';
import { handleSetAiToolBar } from '../../../store/domArea';
import {
  useGetMyAgentListQuery,
} from '../../../redux/AiAssistApiSlice';
import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ListItemText from '@mui/material/ListItemText';
import ListItemButton from '@mui/material/ListItemButton';





const ChatPromptPersonaList = props => {
  const {
    openPromptPersonaSelectDialog,
    setOpenPromptPersonaSelectDialog,
    setSystemMessage,
    setPromptPersonaIconLink,
    setPromptPersonaDescription
  } = props;

  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const orgInfo = useSelector((state:RootState) => state.org.orgInfo);

  // const { data: aiAgentData } = useGetAllAiAgentListQuery({});
  const { data: myAgentList } = useGetMyAgentListQuery({ orgId: orgInfo.orgId});
  const newAiAgentData = [...myAgentList]

  const { t } = useTranslation();
  const handleClose = () => {
    setOpenPromptPersonaSelectDialog(false);
    store.dispatch(handleSetAiToolBar(false));
  };

  const [updateAIChatSession] = useUpdateAIChatSessionMutation();

  const allPromptPersonaData = useSelector(
    (state: RootState) => state.AIAssist.allPromptPersonaData
  );

  return (
    <Dialog
      open={openPromptPersonaSelectDialog}
      onClose={handleClose}
      sx={{
        width: '500px',
        maxWidth: '700px',
        maxHeight: '300px'
      }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 10px 24px'
      }}>
        <Typography sx={{
          fontSize: '16px',
          fontWeight: 'bolder',
          textAlign: 'center'
        }}>
          {t('chatAi.selectARole')}
        </Typography>
      </DialogTitle>
      <DialogContent sx={{ pb: '16px' }}>
        {newAiAgentData &&
          newAiAgentData.map((data, dataIndex) => (
            <PromptPersona
              data={data}
              dataIndex={dataIndex}
              key={dataIndex}
              setSystemMessage={setSystemMessage}
              setPromptPersonaIconLink={setPromptPersonaIconLink}
              setPromptPersonaDescription={setPromptPersonaDescription}
              handleClose={handleClose}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
};

const PromptPersona = props => {
  const {
    data,
    dataIndex,
    setSystemMessage,
    handleClose,
    setPromptPersonaIconLink,
    setPromptPersonaDescription
  } = props;


  const handleClickSelectPromptPersona = data => {
    setSystemMessage(data.command);
    setPromptPersonaIconLink(data.icon);
    setPromptPersonaDescription(data.description);
    handleClose();
  };

  return (
    <ListItemButton
      key={dataIndex}
      onClick={() => handleClickSelectPromptPersona(data)}
      sx={{
        m: '3px 10px 3px 0px', alignItems: 'flex-start', padding: '8px',
        borderRadius: '4px',
        transition: 'none',
        '&:hover': {
          backgroundColor: '#EEEEEE',
          '& #AiFavoriteCommandIcon': {
            display: 'block',
            top: '0px'
          }
        }
      }}

    >
      <img
        style={{ width: '32px', height: '32px' }}
        src={data.icon ? data.icon : '/images/android-icon-36x36.png'}
        alt="command icon"
      />
      <ListItemText
        primary={data.name}
        secondary={data.description}
        sx={{
          primary: {
            fontSize: '12px',
            fontWeight: 500,
            lineHeight: '16px',
            marginLeft: '12px'
          },
          root: { margin: '0px' },
          secondary: {
            fontSize: '12px',
            lineHeight: '16px',
            marginTop: '4px',
            marginLeft: '12px'
          }
        }}

      />
    </ListItemButton>
  );
};

export default ChatPromptPersonaList;
