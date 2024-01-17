//**Import React */
import React, { useEffect, useState } from 'react';
import { useParams, useHistory } from 'react-router-dom';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetBoardId, handleSetBoard } from '../../store/board';
import {
  handleSetShare,
  handleSetDisabledShareSelect
} from '../../store/permission';
import {handleSetCreateVistorDone} from '../../store/user';
import { handleAddOnlineUser } from '../../store/system';
//**Import Service */
import {
  BoardService,
  EventService,
  SyncService,
  UserService,
} from '../../services';

//**Import Mui */
import { ThemeProvider } from '@mui/material';
import currentTheme from '../../mui/theme/lightTheme';

//**Import Others */
import BoardTouch from '../../board/BoardTouch';
import BoardEntity from '../../board/BoardEntity';
import server from '../../startup/serverConnect';

export default function BoardPage() {
  const dispatch = useDispatch();
  const history = useHistory();
  //basic
  const { id } = useParams<any>();
  const boardId = id;
  const board = useSelector((state: RootState) => state.board.board);
  const user = useSelector((state: RootState) => state.user.userInfo);
  const [checkPermissionFlag, setCheckPermissionFlag] = useState(false);
  const systemInitDone = useSelector((state: RootState) => state.system.initDone);
  //check user accountType
  const setBoardPermission = async board => {
    if (board && (!board.permission || board.permission == 'all')) {
      dispatch(handleSetShare('all'));
    }

    //if the permission is room, then check if the user is in the room
    if (board.permission == 'room') {
      dispatch(handleSetShare(board.permission)); //select the permission option
    }
    //if the permission is org, then check if the user is in the org
    if (board.permission == 'org') {
      dispatch(handleSetShare(board.permission)); //select the permission option
    }

    if (board.permission != 'room' && board.permission != 'org') {
      dispatch(handleSetShare('all'));
    }

    //disabled select if current user is not createBy, permssion control
    dispatch(
      handleSetDisabledShareSelect(
        board.createdBy != store.getState().user.userInfo.userId ? true : false
      )
    );
  };
 
  const exitOnlineUserOfBoard = () => {
    const userId = store.getState().user.userInfo.userId;
    const userNo = store.getState().user.userInfo.userNo;
    EventService.getInstance().exitRecentOnlineUsers(userId, boardId, userNo);
    store.dispatch(handleAddOnlineUser(false));
  }

  /**
   * useEffect to initialize services and create a visitor account.
   */
  useEffect(() => {
    if (boardId) {
      server.call('getBoardById', boardId).then((data: any) => {
        store.dispatch(handleSetBoard(data));
      }).catch((err: any) => {
        console.log(err);
      });
    }

  }, [boardId]);

  useEffect(() => {
    if (!boardId || !systemInitDone ) return;
    //Initialize user service

    if (
      location.pathname.indexOf('/board/') > -1
    ) {
      const token = localStorage.getItem('token');
      if(token && user.userId){
        UserService.getInstance().pubsub(boardId);
      }else{
        if (!token  ) {
          // store.dispatch(handleSetCreateVistorDone(true));
          // UserService.getInstance().createVisitorAccount(boardId);
          
        } else {
          UserService.getInstance().pubsub(boardId);
        }
      }
      

    }
  }, [boardId,systemInitDone,user]);

  useEffect(() => {
    if(!user.userId || !boardId || !board) return;

    dispatch(handleSetBoardId(boardId));

    BoardService.getInstance().changeBoard(boardId, () => { });

    if (board && boardId && user.userId) {
      setBoardPermission(board);

      EventService.getInstance()
        .checkUserHasPermissionVisitBoard(board)
        .then((data: any) => {
          console.log('data--------------',data)
          if (data && !data.state && data.msg && data.action === 1) {
            Boardx.Util.Msg.warning(data.msg);
            UserService.getInstance().logout();
            window.location.href = '/signin';
          }

            else if (data && !data.state && data.msg && !data.action) {
            Boardx.Util.Msg.warning(data.msg);
            setTimeout(() => {
              history.push('/recent');
            }, 1000);
          }

          else{
            setCheckPermissionFlag(true);
          }
        });
    }
  }, [boardId, user,board]);

  useEffect(() => {
    window.addEventListener('beforeunload', exitOnlineUserOfBoard, true);
    return () => {
      store.dispatch(handleAddOnlineUser(false));
      exitOnlineUserOfBoard();
      BoardService.getInstance().removeSub();
      window.removeEventListener('beforeunload', exitOnlineUserOfBoard, true);

    };
  }, []);

  return (
    <ThemeProvider theme={currentTheme}>
      {checkPermissionFlag && (
        <div style={{ position: 'relative' }} id="mainBoardcontainer">
          {store.getState().system.currentUIType !== 'mobile' ? (
            <BoardEntity />
          ) : (
            <BoardTouch />
          )}
        </div>
      )}
    </ThemeProvider>
  );
}
