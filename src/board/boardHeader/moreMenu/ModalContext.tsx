import * as React from 'react';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';
import MenuItem from '@mui/material/MenuItem';
import { useTranslation } from 'react-i18next';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

//** Import Redux toolkit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useSaveBoardAiContextContentMutation,
  useGetBoardAiContextContentQuery
} from '../../../redux/AiAssistApiSlice';

export default function ModalContext() {
  const { t } = useTranslation();
  const dispatch = useDispatch();
  const [openDialog, setOpenDialog] = React.useState(false);
  const [contextContent, setContextContent] = React.useState('');

  const boardId = useSelector((state: RootState) => state.board.boardId);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [saveBoardAiContextContent] = useSaveBoardAiContextContentMutation();
  const { data: boardAiContextContent = {} } =
    useGetBoardAiContextContentQuery(boardId);

  React.useEffect(() => {
    if (boardAiContextContent.boardContext) {
      setContextContent(boardAiContextContent.boardContext);
    }
  }, [boardAiContextContent]);

  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
  };

  const handleClickSave = async () => {
    setOpenDialog(false);

    let contextData;

    if (boardAiContextContent.boardContext) {
      contextData = {
        ...boardAiContextContent,
        boardContext: contextContent,
        updateUserId: userInfo.userId,
        updateUsername: userInfo.userName,
        updateTime: new Date().getTime()
      };
    } else {
      contextData = {
        boardId: boardId,
        boardContext: contextContent,
        userId: userInfo.userId,
        createUsername: userInfo.userName,
        createTime: new Date().getTime()
      };
    }

    await saveBoardAiContextContent(contextData)
      .unwrap()
      .then(res => {
        Boardx.Util.Msg.success(t('chatAi.saveSuccessfully'));
      })
      .catch(err => {
        Boardx.Util.Msg.error(t('chatAi.saveFailed'));
        console.log('saveBoardAiContextContent', err);
      });
  };

  return (
    <div>
      <MenuItem
        sx={{ gutters: { paddingTop: '8px', paddingBottom: '8px' } }}
        onClick={handleClickOpen}
      >
        {t('board.header.moreContext')}
      </MenuItem>

      <Dialog
        fullWidth
        onClose={handleClose}
        open={openDialog}
      >
        <DialogTitle sx={{
          fontSize: '16px',
          fontWeight: 500
        }}>
          {t('board.header.moreContextTitle')}
        </DialogTitle>

        <DialogContent sx={{
          maxHeight: '500px',
          overflowX: 'hidden',
          width: '100%',
          boxSizing: 'border-box',
        }}>
          <TextareaAutosize
            minRows={6}
            value={contextContent}
            id="context"
            onChange={e => setContextContent(e.target.value)}
            style={{
              width: '100%',
              boxSizing: 'border-box',
              resize: 'none',
              border: '1px solid rgba(0, 0, 0, 0.23)',
              fontSize: '16px',
              fontWeight: 400,
              lineHeight: '24px',
              letterSpacing: '0.15px',
              padding: '5px',
              overflow: 'unset !important'
            }}
          />
        </DialogContent>

        <DialogActions>
          <Button onClick={handleClickSave}>
            {t('board.header.moreContextSave')}
          </Button>
        </DialogActions>
      </Dialog>
    </div>
  );
}
