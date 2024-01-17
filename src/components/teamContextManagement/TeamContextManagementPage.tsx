//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

//** Import Meteor
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../store';
import {
  useSaveTeamAiContextContentMutation,
  useGetTeamAiContextContentQuery
} from '../../redux/AiAssistApiSlice';

//** Import Mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { TextareaAutosize } from '@mui/base/TextareaAutosize';

const PREFIX = 'TeamContextManagementPage';

const classes = {
  titleTypography: `${PREFIX}-titleTypography`,
  contextBox: `${PREFIX}-contextBox`,
  textAreaStyle: `${PREFIX}-textAreaStyle`,
  btnBox: `${PREFIX}-btnBox`
};

const StyledBox = styled(Box)(() => ({
  [`& .${classes.titleTypography}`]: {
    fontSize: '16px',
    fontWeight: 500,
    marginBottom: '16px'
  },

  [`& .${classes.contextBox}`]: {
    maxHeight: 'calc(100vh - 400px)',
    paddingRight: '5px',
 
  },

  [`& .${classes.textAreaStyle}`]: {
    width: '100%',
    resize: 'none',
    border: '1px solid rgba(0, 0, 0, 0.23)',
    fontSize: '16px',
    fontWeight: 400,
    lineHeight: '24px',
    letterSpacing: '0.15px',
    padding: '5px',
    overflow: 'unset !important'
  },

  [`& .${classes.btnBox}`]: {
    display: 'flex',
    marginTop: '16px',
    justifyContent: 'flex-end'
  }
}));

const TeamContextManagementPage = () => {

  const { t } = useTranslation();
  const [contextContent, setContextContent] = React.useState('');

  const teamId = useSelector((state: RootState) => state.org.orgInfo.orgId);
  const userInfo = useSelector((state: RootState) => state.user.userInfo);

  const [saveTeamAiContextContent] = useSaveTeamAiContextContentMutation();
  const { data: teamAiContextContent = {} } =
    useGetTeamAiContextContentQuery(teamId);

  React.useEffect(() => {
    if (teamAiContextContent.teamContext) {
      setContextContent(teamAiContextContent.teamContext);
    }
  }, [teamAiContextContent]);

  const handleClickSave = async () => {
    let contextData;

    if (teamAiContextContent.teamContext) {
      contextData = {
        ...teamAiContextContent,
        teamContext: contextContent,
        updateUserId: userInfo.userId,
        updateUsername: userInfo.userName,
        updateTime: new Date().getTime()
      };
    } else {
      contextData = {
        teamId: teamId,
        teamContext: contextContent,
        userId: userInfo.userId,
        createUsername: userInfo.userName,
        createTime: new Date().getTime()
      };
    }

    await saveTeamAiContextContent(contextData)
      .unwrap()
      .then(res => {
        Boardx.Util.Msg.success(t('chatAi.saveSuccessfully'));
      })
      .catch(err => {
        Boardx.Util.Msg.error(t('chatAi.saveFailed'));
        console.log('saveTeamAiContextContent', err);
      });
  };

  return (
    <StyledBox sx={{ position: 'relative', mt: '24px', width: '70%' }}>
      <Typography className={classes.titleTypography}>
        {t('pages.listPage.roomSettings.teamsContextTitle')}
      </Typography>

      <Box className={classes.contextBox}>
        <TextareaAutosize
          minRows={10}
          value={contextContent}
          id="teamContext"
          onChange={e => setContextContent(e.target.value)}
          className={classes.textAreaStyle}
        />
      </Box>

      <Box className={classes.btnBox}>
        <Button onClick={handleClickSave}>
          {t('pages.listPage.roomSettings.teamsContextSave')}
        </Button>
      </Box>
    </StyledBox>
  );
};

export default TeamContextManagementPage;
