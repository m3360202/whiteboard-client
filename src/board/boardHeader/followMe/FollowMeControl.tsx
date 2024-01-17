import React, { useEffect, useState } from 'react';
import store, { RootState } from '../../../store';
import { useSelector } from 'react-redux';
import { handleChangeFollowMe, handleSetFollowMode } from '../../../store/board';
import { Box } from '@mui/system';

import BoardService from '../../../services/BoardService';

//** Import i18n
import { useTranslation } from 'react-i18next';


export default function FollowMeControl () {

    const { t } = useTranslation();
    const board = useSelector((state: RootState) => state.board.board);
    const followMode = useSelector((state: RootState) => state.board.followMode);
    const [followingLabel, setFollowingLabel] = useState('');
    const followMe = useSelector((state: RootState) => state.board.followMe);
    const boardFollow = useSelector((state: RootState) => state.board.board.follow);
    const followViewport = useSelector((state: RootState) => state.board.followViewport);
    const stopFollowOtherUserFlag = useSelector((state: RootState) => state.board.stopFollowOtherUserFlag);
    const onlineUsers = useSelector((state: RootState) => state.user.onlineUsers);

    useEffect(() => {

        let canvas = (window as any).canvas;

        if (!canvas) return;

        const followViewPortFlag = followViewport;

        if (followViewPortFlag && !stopFollowOtherUserFlag) {
            const vp = followViewport;
            canvas.animateToRect(vp.vw2, vp.vh2, vp.v, vp.vpc);
            canvas.requestRenderAll();
        }

    }, [followViewport]);

    useEffect(() => {

        let followingInner = false;
        // const board = store.getState().board.board;
        if (boardFollow && boardFollow.followUserNo) {
            const onlinePresdent = onlineUsers?.filter((u) => u.userNo === boardFollow.followUserNo);
            if (!onlinePresdent) {
                BoardService.getInstance().exitFollowMe(board);
            }
        }

        if (boardFollow && boardFollow.followMode) {
            followingInner = true;
        }

        if (followMe) {
            followingInner = followMe;
        }
        // BoardService.getInstance().setFollowing(followingInner);
        store.dispatch(handleSetFollowMode(followingInner));

    }, [boardFollow]);

    let lastFollowMeHostName;

    useEffect(() => {
        let followingLabelInner;
        if (
            followMode &&
            boardFollow &&
            boardFollow.followUserId !== store.getState().user.userInfo.userId &&
            boardFollow.followUserName
        ) {
            const userName = boardFollow.followUserName;
            lastFollowMeHostName = userName || lastFollowMeHostName;
            const followingLabelInner = `${t('board.header.youAreFollowing')} ${lastFollowMeHostName}`;
            setFollowingLabel(followingLabelInner);
        }
        if (
            followMode &&
            boardFollow &&
            boardFollow.followUserId === store.getState().user.userInfo.userId
        ) {
            followingLabelInner = t('board.header.followMembersFollowingYou');
            setFollowingLabel(followingLabelInner);
        }
        //setShowRejoinFollowing(followingLabelInner);
    }, [boardFollow, followMode]);

    useEffect(() => {

        return () => {
            store.dispatch(handleSetFollowMode(false));
            store.dispatch(handleChangeFollowMe(false));
            if (boardFollow && boardFollow.followUserId && boardFollow.followUserId === store.getState().user.userInfo.userId) {
                BoardService.getInstance().exitFollowMe(board);
            }

        }

    }, []);

    useEffect(() => {
        if (boardFollow && boardFollow.followUserId) {
            const onlinePresdent = onlineUsers?.filter((u) => u.userId === boardFollow.followUserId);
            if (onlinePresdent && onlinePresdent.length === 0) {
                BoardService.getInstance().exitFollow(board);
            }
        }

    }, [onlineUsers]);

    return (
        <Box id="main">
            {followMode ? (
                <div id="followInfoPanel">
                    <div
                        style={{
                            marginLeft: 12,
                            marginRight: 12,
                            float: 'left',
                            position: 'absolute',
                            top: '18px',
                            borderBottomRightRadius: 8,
                            borderBottomLeftRadius: 8,
                            fontFamily: 'Inter',
                            fontWeight: 500,
                            left: '50%',
                            transform: 'translate(-50%, -50%)',
                            height: 30,
                            backgroundColor: '#F21D6B',
                            color: '#FFFFFF',
                            textAlign: 'center',
                            fontSize: 16,
                            paddingTop: 3
                        }}
                    >
                        {followingLabel
                            ? followingLabel
                            : t('board.header.followMembersFollowingYou')}
                    </div>
                </div>
            ) : null}

        </Box>
    );

}