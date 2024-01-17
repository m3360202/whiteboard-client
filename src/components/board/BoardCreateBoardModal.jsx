//** Import react
import React, { useState } from 'react';
import { styled } from '@mui/material/styles';
import { useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetBoardList, handleSetCurrentBoardList } from '../../store/boardList';
import {useAddWhiteboardMutation} from '../../redux/BoardAPISlice';

//** Import Mui
import { useTheme } from '@mui/material/styles';
import Card from '@mui/material/Card';
import useMediaQuery from '@mui/material/useMediaQuery';
import LoadingButton from '@mui/lab/LoadingButton';
import Dialog from '@mui/material/Dialog';
import DialogContent from '@mui/material/DialogContent';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import TextField from '@mui/material/TextField';
import CardHeader from '@mui/material/CardHeader';
import CardMedia from '@mui/material/CardMedia';
import Box from '@mui/material/Box';

//** Import components
import { DashboardButtonId } from '../../constants/Tutorial';

export default function BoardCreateBoardModal({ roomData }) {
  //use
  const dispatch = useDispatch();

  const theme = useTheme();
  const history = useHistory();
  const { t } = useTranslation();
  
  //dom
  const [createBoardButtonLoading, setCreateBoardButtonLoading] = useState(false);
  const [open, setOpen] = useState(false);
  const fullScreen = useMediaQuery(theme.breakpoints.up('xl'));

  //org
  const orgInfo = useSelector((state) => state.org.orgInfo);
  //boardList
  const boardList = useSelector((state) => state.boardList.boardList);

  const [addWhiteboard,{error}] = useAddWhiteboardMutation();

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleCreateBoard = async () => {
    setCreateBoardButtonLoading(true);
    let path = location.pathname + location.search;
    let currentRoomId = 'none';
    let isTeamsTemplate = false;
    let boardName = document.getElementById('inputBoardName').value.toString().trim();
    if (boardName.length === 0) {
      boardName = t('components.board.defaultBoardName');
    }

    if (path.indexOf('/recent') > -1) {
      currentRoomId = 'none';
      localStorage.setItem('pageFrom', 'recent');
    } else if (path.indexOf('/teamsetting') > -1) {
      currentRoomId = 'none';
      isTeamsTemplate = true;
      localStorage.setItem('pageFrom', 'teamsetting');
    } else {
      currentRoomId = roomData.roomId ? roomData.roomId : 'none';
      localStorage.setItem('pageFrom', 'room');
    }

    const boardData = {
      name: boardName,
      userId: store.getState().user.userInfo.userId,
      roomId: currentRoomId,
      createdByName: store.getState().user.userInfo.userName,
      allowAnonymous: true,
      orgId: orgInfo.orgId,
      isTeamsTemplate: isTeamsTemplate,
    };

    const  response  = await addWhiteboard({ boardData: boardData });
    if(error) {
      Boardx.Util.Msg.warning(t('pages.listPage.createFailed'));
    }
    history.push({ pathname: `/board/${response.data._id}` });
    setCreateBoardButtonLoading(false);
  };

  const handleAddBoardClick = async () => {
    await handleOpen();
    document.getElementById('inputBoardName').focus();
  };

  const handleInputBoardFocus = () => {
    document.getElementById('inputBoardName').select();
  };

  const handleCreateBoardKeyDown = (e) => {
    if (e.keyCode === 13) return handleCreateBoard();
  };

  const createBoardDialog = (
    <Dialog

      sx={{ '& .MuiDialog-paper': { width: '424px', height: '258px' } }}
      fullScreen={fullScreen}
      onClose={handleClose}
      open={open}
    >
      <DialogTitle id="responsive-dialog-title" onClose={handleClose}>
        {t('pages.listPage.createNewBoard')}
      </DialogTitle>
      <DialogContent
        sx={{ overflow: 'hidden', p: '24px 24px 0 24px !important' }}
      >
        <DialogContentText
          id="alert-dialog-description"
          sx={{
            fontFamily: 'Inter',
            fontStyle: 'normal',
            fontWeight: 400,
            fontSize: '16px',
            lineHeight: '24px'
          }}
        >
          <span>{t('pages.listPage.newBoardName')}</span>
        </DialogContentText>
        <TextField
          defaultValue={t('components.board.defaultBoardName')}
          id="inputBoardName"
          onFocus={handleInputBoardFocus}
          onKeyDown={handleCreateBoardKeyDown}
          fullWidth
          sx={{
            pt: '8px',
            '& input': {
              p: '5px !important'
            }
          }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
          <LoadingButton
            loading={createBoardButtonLoading}
            color="primary"
            onClick={handleCreateBoard}
            size="small"
            type="button"
            variant="contained"
            sx={{mt: '32px'}}
          >
            {t('pages.create')}
          </LoadingButton>
        </Box>
      </DialogContent>
    </Dialog>
  );

  const cardHeaderTitle = (
    <div style={{  width: '100%',
    marginLeft: 'auto',
    marginRight: 'auto',
    boxShadow: 'none',
    borderWidth: '0px',
    position: 'relative',
    display: 'block',
    cursor: 'pointer'}}>
      <img height="15px" src="/images/celebration.png" width="auto" />
      {t('pages.listPage.newBoard')}
    </div>
  );

  return (
    <div sx={{display: 'inline-block',
    verticalAlign: 'top'}}>
      <Card
        
        id={DashboardButtonId.CREATE_BOARD_ID}
        onClick={handleAddBoardClick}

        sx={{  width: '100%',
        marginLeft: 'auto',
        marginRight: 'auto',
        boxShadow: 'none',
        borderWidth: '0px',
        position: 'relative',
        display: 'block',
        cursor: 'pointer',
        '.media':{ width: '100%',
        overflow: 'hidden',
        height: '80%',
        minHeight: '200px',
        backgroundRepeat: 'no-repeat',
        cursor: 'pointer',
        borderRadius: 2,
        background: '#F21D6B',
        backgroundSize: 290,
        alignItems: 'center',
        display: 'flex',
        justifyContent: 'center'}}}
      >
        <CardMedia 
        className={'media'}
        >
          <Box sx={{ display: 'flex',
    fontSize: 50,
    color: '#FFFFFF',
    alignItems: 'center',
    justifyContent: 'center'}}> + </Box>
        </CardMedia>
        <CardHeader
          sx={{ paddingTop: 1,
            paddingLeft: 0,
            paddingBottom: 0,
            paddingRight: 0}}
          title={cardHeaderTitle}
        />
      </Card>
      {createBoardDialog}
    </div>
  );
}
