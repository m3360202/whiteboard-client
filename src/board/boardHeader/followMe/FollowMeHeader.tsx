import { Box } from "@mui/material"
import { styled } from '@mui/material/styles';
import Tooltip from "@mui/material/Tooltip"
import IconButton from "@mui/material/IconButton"
import FollowMeIcon from '../../../mui/icons/FollowMeIcon';
import React, { useEffect, useState } from 'react';

import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';

import { handleChangeFollowMe } from '../../../store/board';
import { useUpdateBoardByIdMutation } from '../../../redux/BoardAPISlice';

import { useTranslation } from 'react-i18next';

const StyledBox = styled(Box)((
  { theme }
) => ({
  color: 'rgba(0,0,0,0.54)',
  cursor: 'pointer'
}));

export default function FollowMeHeader() {
  const [selectScreenShare, setSelectScreenShare] = useState(false);
  const followMe = useSelector((state: RootState) => state.board.followMe);
  const { t } = useTranslation();

  const board = useSelector((state: RootState) => state.board.board);
  const dispatch = useDispatch();

  const [updateBoardById] = useUpdateBoardByIdMutation();
  let canvas = (window as any).canvas;

  useEffect(() => {
    if (followMe) {
      setSelectScreenShare(true);
    } else {
      setSelectScreenShare(false);
    }
  }, [followMe]);

  const handleScreenShare = async (event) => {
    event.preventDefault();

    if (store.getState().board.followMe) {
      dispatch(handleChangeFollowMe(false));
      await updateBoardById({
        id: board._id,
        data: {
          follow: {
            followMode: false,
            followUserName: null,
            followUserId: null,
            followUserNo: null
          }
        }
      });
    } else {
      dispatch(handleChangeFollowMe(true));
      await updateBoardById({
        id: board._id,
        data: {
          follow: {
            followMode: true,
            followUserName: store.getState().user.userInfo.userName,
            followUserId: store.getState().user.userInfo.userId,
            followUserNo: store.getState().user.userInfo.userNo
          }
        }
      });
    }
    canvas.updateViewport();

    setSelectScreenShare(!selectScreenShare);

  };

  return (
    <StyledBox
      className={
        selectScreenShare
          ? ' Mui-selected'
          : ''
      }
    >
      <Tooltip
        arrow
        placement="bottom"
        title={t('board.header.screenShare')}
      >
        <IconButton
          id="screenIcon"
          onClick={handleScreenShare}
          style={{
            // color: screenIconColor,
            paddingLeft: 16,
            paddingRight: 12,
            width: 50
          }}
        >
          <FollowMeIcon sx={{ width: '20px', height: '20px' }} />
        </IconButton>
      </Tooltip>


    </StyledBox>
  );
}