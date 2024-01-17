//** Import react
import React from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetAiToolBar } from '../../../store/domArea';


import {
   useGetMyAgentListQuery,
} from '../../../redux/AiAssistApiSlice';


import Dialog from '@mui/material/Dialog';
import Typography from '@mui/material/Typography';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import ChatAgentItem from './ChatAgentItem';

const ChatAgentList = props => {
  const { openPromptPersonaSelectDialog, setOpenPromptPersonaSelectDialog } =
    props;

  const { t } = useTranslation();
  const handleClose = () => {
    setOpenPromptPersonaSelectDialog(false);
    store.dispatch(handleSetAiToolBar(false));
  };
  const userInfo = useSelector((state: RootState) => state.user.userInfo);
  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

   const { data: myAgentData = [] } = useGetMyAgentListQuery({ orgId: orgInfo.orgId });

  let newAIAgentData =  myAgentData ;

  return (
    <Dialog
      open={openPromptPersonaSelectDialog}
      onClose={handleClose}
      aria-labelledby="alert-dialog-title"
      aria-describedby="alert-dialog-description"
      sx={{ height: '80vh', }}
    >
      <DialogTitle sx={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px 10px 24px',
        fontSize: '14px',

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
        {newAIAgentData &&
          newAIAgentData.map((data, dataIndex) => (
            <ChatAgentItem
              data={data}
              dataIndex={dataIndex}
              key={dataIndex}
              handleClose={handleClose}
            />
          ))}
      </DialogContent>
    </Dialog>
  );
};



export default ChatAgentList;
