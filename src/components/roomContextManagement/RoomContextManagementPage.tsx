import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import { useTranslation } from 'react-i18next';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useSaveRoomAiContextContentMutation,
  useGetRoomAiContextContentQuery
} from '../../redux/AiAssistApiSlice';


export default function RoomContextManagementPage() {

  const { t } = useTranslation();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [contextContent, setContextContent] = React.useState('');

  const roomId = useSelector((state: RootState) => state.room.roomId);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [saveRoomAiContextContent] = useSaveRoomAiContextContentMutation();
  const { data: roomAiContextContent = {} } =
    useGetRoomAiContextContentQuery(roomId);

  React.useEffect(() => {
    if (roomAiContextContent.roomContext) {
      setContextContent(roomAiContextContent.roomContext);
    }
  }, [roomAiContextContent]);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleClickSave = async () => {
    setOpenDialog(false);

    let contextData;

    if (roomAiContextContent.roomContext) {
      contextData = {
        ...roomAiContextContent,
        roomContext: contextContent,
        updateUserId: userInfo.userId,
        updateUsername: userInfo.userName,
        updateTime: new Date().getTime()
      };
    } else {
      contextData = {
        roomId: roomId,
        roomContext: contextContent,
        userId: userInfo.userId,
        createUsername: userInfo.userName,
        createTime: new Date().getTime()
      };
    }

    await saveRoomAiContextContent(contextData)
      .unwrap()
      .then(res => {
        Boardx.Util.Msg.success(t('chatAi.saveSuccessfully'));
      })
      .catch(err => {
        Boardx.Util.Msg.error(t('chatAi.saveFailed'));
        console.log('saveRoomAiContextContent', err);
      });
  };

  return (
    <div>
      <Button sx={{ mr: '20px' }} variant="contained" onClick={handleClickOpen}>
        {t('pages.listPage.roomSettings.roomContextSetting')}
      </Button>

      <Dialog
        fullWidth
        onClose={handleClose}
        open={openDialog}
      >
        <DialogTitle sx={{ fontSize: '16px',
    fontWeight: 500}}>
          {t('pages.listPage.roomSettings.roomContextTitle')}
        </DialogTitle>

        <DialogContent sx={{  maxHeight: '500px',
    overflowX: 'hidden'}}>
          <TextareaAutosize
            minRows={6}
            value={contextContent}
            id="roomContext"
            onChange={e => setContextContent(e.target.value)}
            style={{ width: '638px',
            resize: 'none',
            border: '1px solid rgba(0, 0, 0, 0.23)',
            fontSize: '16px',
            fontWeight: 400,
            lineHeight: '24px',
            letterSpacing: '0.15px',
            padding: '5px',
            overflow: 'unset !important'}}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClickSave}>
            {t('pages.listPage.roomSettings.roomContextSave')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
