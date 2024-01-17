//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useDispatch, useSelector } from 'react-redux';
import store, { RootState } from '../../store';
import { useGetTeamsManagementTemplatesQuery } from '../../redux/BoardAPISlice';
import { useGetOrgTemplatesQuery } from '../../redux/ResourceAPISlice';

//** Import Mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';

//** Import components
import BoardCreateBoardModal from '../board/BoardCreateBoardModal';
import ImportOfficialTemplate from './ImportOfficialTemplate';
import { Board } from '../board/Board';

const PREFIX = 'TeamTemplateManagementPage';

const classes = {
  teamsTemplateContent: `${PREFIX}-teamsTemplateContent`,
  importOfficialTemplateBtn: `${PREFIX}-importOfficialTemplateBtn`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.teamsTemplateContent}`]: {
    [theme.breakpoints.up('sm')]: {},
    flexGrow: 1,
    overflowX: 'hidden',
    display: 'grid',
    gridTemplateColumns:
      'repeat(auto-fill, minmax(var(--auto-grid-min-size), 1fr))',
    gridGap: '1rem',
    '--auto-grid-min-size': '300px',
    paddingTop: '10px'
  },

  [`& .${classes.importOfficialTemplateBtn}`]: {
    position: 'fixed',
    bottom: '30px',
    right: '30px'
  }
}));

const TeamTemplateManagementPage = () => {

  const { t } = useTranslation();
  const [openImportOfficialTemplateDialog, setOpenImportOfficialTemplateDialog] = useState(false);
  const orgId = useSelector((state: RootState) => state.org.orgInfo.orgId);

  const { data: teamsTemplateList = [] } = useGetTeamsManagementTemplatesQuery({
    orgId: orgId
  });

  const { data: orgTemplateList = [] } = useGetOrgTemplatesQuery(orgId) as {
    data: any;
  };

  const allBoardList = [...teamsTemplateList, ...orgTemplateList];

  const handleOpenImportOfficialTemplateDialog = () => {
    setOpenImportOfficialTemplateDialog(true);
  }

  return (
    <StyledBox sx={{ position: 'relative' }}>
      <Box className={classes.teamsTemplateContent} id="teamsTemplateContent">
        <BoardCreateBoardModal roomData={null} />
        {allBoardList.map(d => (
          <Board board={d} key={d._id} type="teamsTemplate" />
        ))}
      </Box>
      <ImportOfficialTemplate
        openImportOfficialTemplateDialog={openImportOfficialTemplateDialog}
        setOpenImportOfficialTemplateDialog={
          setOpenImportOfficialTemplateDialog
        }
      />
    </StyledBox>
  );
};

export default TeamTemplateManagementPage;
