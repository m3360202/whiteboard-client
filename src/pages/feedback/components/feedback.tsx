import React, { useCallback, useEffect, useRef, useState } from 'react';
import { styled } from '@mui/material/styles';
import { Typography, Box } from '@mui/material';
import Upload from './upload';
import { SlideService, BoardService, UtilityService, FileService } from '../../../services';
import { LoadingButton } from '@mui/lab';
import { useTranslation } from 'react-i18next';
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import {handleSetFeedbackContent} from '../../../store/board';
import { useHandleSendFeedbackMsgToGitHubMutation } from '../../../redux/BoardAPISlice';
interface FeedbackProps {
  onCancel?: Function;
}

const palceholderStr = ``;

export default (props: FeedbackProps) => {
  const { onCancel } = props;
  const dispatch = useDispatch();
  const { t } = useTranslation();
  const [uploadText, setUploadText] = useState('');
  const [uploadFiles, setUploadFiles] = useState([]);
  const inputTimer: any = useRef(null);
  const [onSubmit, setOnSubmit] = useState(false);
  const feedbackContent = useSelector((state: RootState) => state.board.feedbackContent);
  let board = useSelector((state: RootState) => state.board.board)
  let r2UploadPath = UtilityService.getInstance().getr2UploadPath(board);
  const [handleSendFeedbackMsgToGithub, { data, error }] = useHandleSendFeedbackMsgToGitHubMutation();
  const handleFilesChange = files => {
    setUploadFiles(files);
  };

  const handleTextInput = e => {
    if (inputTimer.current) {
      clearTimeout(inputTimer.current);
    }

    inputTimer.current = setTimeout(() => {
      // console.log('handleTextInput: ', e.target.value);
      setUploadText(e.target.value);
    }, 300);
  };

  const handleSubmit = useCallback(async () => {
    console.log('handleSubmit: ', uploadText, uploadFiles);
    try {
      const filesArr = [];
      const currentUser = store.getState().user.userInfo;

      if (!uploadText.trim()) {
        throw t('feedback.submitInfoEmptyText');
      }

      setOnSubmit(true);

      for (let i = 0; i < uploadFiles.length; i++) {
        const key =
          await FileService.getInstance().uploadFileToR2inBoard(
            r2UploadPath,
            uploadFiles[i], {}
          );

        if (key) {
          filesArr.push(
            `![${uploadFiles[i].name}](${key})`
          );
        }
      }

      const msg = `>${uploadText}
                    ${filesArr.join('\n')}
                    >userAgent: ${window.navigator.userAgent}
                    email: ${currentUser.email}
                    username: ${currentUser.userName} `;
      handleSendFeedbackMsgToGithub(msg);
      onCancel();
      Boardx.Util.Msg.success(`${t('feedback.submitSuccessInfo')}`);
    } catch (err) {
      Boardx.Util.Msg.warning(
        `${t('feedback.submitErrorInfo')}：${err.toString()}`
      );
    } finally {
      setOnSubmit(false);
    }
  }, [uploadText, uploadFiles]);

  const handleCancel = () => {
    onCancel();
  };

  useEffect(() => {
    return () => {
      if (inputTimer.current) {
        clearTimeout(inputTimer.current);
        inputTimer.current = null;
      }
    };
  }, []);

  useEffect(() => {
    if (feedbackContent && feedbackContent.boardId === board._id) {
      setUploadText(feedbackContent.content);
    }
  }, [])

  const handleFeedbackTextChange = (e) => {
    dispatch(
      handleSetFeedbackContent({
        boardId: board._id,
        content: e.target.value
      })
    );
  }

  return (
    <FeedbackContent>
      <FeedbackTitle>{t('feedback.title')}</FeedbackTitle>
      <FeedbackTextField
        placeholder={t('feedback.palceholderStr')}
        onInput={handleTextInput}
        defaultValue={uploadText}
        onChange={handleFeedbackTextChange}
      />
      <Upload onChange={handleFilesChange} />
      <FeedbackBtn
        loading={onSubmit}
        onClick={handleSubmit}
        sx={{ marginBottom: '16px' }}
        variant="contained"
      >
        {t('feedback.submitBtn')}
      </FeedbackBtn>
      <FeedbackCancelBtn variant="text" onClick={handleCancel}>
        {t('feedback.cancelBtn')}
      </FeedbackCancelBtn>
    </FeedbackContent>
  );
};

const FeedbackContent = styled(Box)`
  display: flex;
  width: 370px;
  padding: 24px;
  height: auto;
  border-radius: 8px;
  flex-direction: column;
  box-sizing: border-box;
  align-items: flex-start;
  background-color: #fff;
  box-shadow: 0 0 5px #ddd;
`;

const FeedbackTitle = styled(Typography)`
  flex: 0;
  height: 34px;
  width: 100%;
  font-size: 28px;
  color: #232930;
  font-weight: 500;
  line-height: 34px;
  font-style: normal;
  font-family: 'Inter';
  margin-bottom: 24px;
`;

const FeedbackTextField = styled('textarea')`
  width: 100%;
  height: 245px;
  resize: none;
  padding: 8px;
  outline: none;
  border-radius: 4px;
  margin-bottom: 16px;
  font-family: 'Inter';
  box-sizing: border-box;
  border: 1px solid #908ea5;

  &::placeholder {
    font-family: 'Inter';
    color: rgba(0, 0, 0, 0.48);
  }
`;

const FeedbackBtn = styled(LoadingButton)`
  width: 100%;
  height: 48px;
  padding: 12px 24px;
  border-radius: 4px;
`;

const FeedbackCancelBtn = styled(LoadingButton)`
  width: 100%;
  height: auto;
  padding: 0px;
  border-radius: 4px;
`;
