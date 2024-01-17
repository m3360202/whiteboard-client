//** Import react
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';


//** Import Redux kit
import { RootState } from '../../store';
import { handleInitRoom } from '../../store/room';
import { useSelector, useDispatch } from 'react-redux';
import AppBarHeader from '../../components/common/AppBarHeader';
//** Import Mui
import {
  AppBar,
  CssBaseline,
  ThemeProvider,
  Toolbar,
  IconButton,
  Box,
  Menu,
  MenuItem
} from '@mui/material';
import currentTheme from '../../mui/theme/lightTheme';
import { useTheme } from '@mui/material/styles';

//** Imort components
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';
import UserMenu from '../../components/user/UserMenu';
import OrganizationInviteMembersModal from '../../components/org/OrganizationInviteMembersModal';
import ExploreBoardXPrompts from '../../components/prompt/ExploreBoardXPropmts';




const drawerWidth = 240;
const winHeight = window.innerHeight;

export default function PromptPage() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();
  const { t } = useTranslation();

  const history = useHistory();
  const contentRef: any = useRef();
  const [startIndex, setStartIndex] = useState(0);
  const [limit, setLimit] = useState(25);
  const [orgId, setOrgId] = useState('');


  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  //dom & control 
  //** Effect events
  useEffect(() => {
    dispatch(handleInitRoom(''));
    document.title = t('pages.listPage.recentBoardsTagTitle');
  }, []);
  useEffect(() => {
    if (!orgInfo?.orgId) return;
    setOrgId(orgInfo.orgId);
    setStartIndex(0);
    setLimit(30);
  }, [orgInfo]);


  return (
    <Box  >

      <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
        <RoomLeftDrawer parentComponent="promptPage" />
        <Box sx={{

          width: '100%',
          height: '100%',
          flexGrow: 1,
          backgroundColor: theme.palette.background.paper
        }} id="mainBoard2">
          <AppBarHeader />
          <div
            id="content2"
            ref={contentRef}
            style={{
              overflowY: 'scroll',
              height: winHeight
            }}
          >
            <Box sx={{
              [theme.breakpoints.up('sm')]: {
                width: `calc(100% - ${drawerWidth}px)`,
                marginLeft: drawerWidth
              },
              paddingLeft: theme.spacing(3),
              paddingRight: theme.spacing(3),
              overflow: 'hidden',
              marginTop: '129px'
            }}>
              <ExploreBoardXPrompts />
            </Box>
          </div>
        </Box>
      </Box>
    </Box>
  );
}
