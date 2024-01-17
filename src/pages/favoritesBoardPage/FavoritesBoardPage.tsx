//** Import react
import React, { useRef, useState, useEffect } from 'react';
import { useLocation, useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { RootState } from '../../store';
import { handleSetInFavoriteBoardPage } from '../../store/boardList';
import { useGetTeamFavoriteBoardQuery } from '../../redux/BoardListAPISlice';
import { useSelector, useDispatch } from 'react-redux';

//**Import Mui
import { styled } from '@mui/material/styles';
import currentTheme from '../../mui/theme/lightTheme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import MoreVertOutlinedIcon from '@mui/icons-material/MoreVertOutlined';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, Box, Menu, MenuItem } from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import Tooltip, { TooltipProps, tooltipClasses } from '@mui/material/Tooltip';
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import Switch from '@mui/material/Switch';
import TabContext from '@mui/lab/TabContext';
import TabList from '@mui/lab/TabList';
import TabPanel from '@mui/lab/TabPanel';
import Tab from '@mui/material/Tab';
import lightTheme from '../../mui/theme/lightTheme';

//**Import Services
import { UserService } from '../../services';

//** Imort components
import { Board } from '../../components/board/Board';
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';
import UserMenu from '../../components/user/UserMenu';
import AutoSearchBoard from '../../components/search/AutoSearchBoard';
import OrganizationInviteMembersModal from '../../components/org/OrganizationInviteMembersModal';
import i18n from '../../i18n';
//**Import others
import AppBarHeader from '../../components/common/AppBarHeader';



const drawerWidth = 240;
const winHeight = window.innerHeight;

export default function FavoritesBoardPage() {
  //use
  const dispatch = useDispatch();
  const theme = useTheme();

  const contentRef: any = useRef();
  const { t } = useTranslation();
  const [value, setValue] = useState('1');

  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);



  //board
  const { data: favoriteBoardListData = [] } = useGetTeamFavoriteBoardQuery(
    orgInfo.orgId
  );
  const favoriteBoardList: any = favoriteBoardListData;

  const boardList = useSelector(
    (state: RootState) => state.boardList.currentBoardList
  );

  const inFavoriteBoardPage = useSelector(
    (state: RootState) => state.boardList.inFavoriteBoardPage
  );

  //search
  const keywords = useSelector((state: RootState) => state.boardList.keyword);



  //** Effect events
  useEffect(() => {
    document.title = t('pages.listPage.recentBoardsTagTitle');
  }, []);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  /**
   * Toggle the search setting for favorite boards.
   * If currently in the favorite board page, set it to false.
   * If not in the favorite board page, set it to true and possibly update the value.
   */
  const changeSearchInFavoritesBoard = () => {
    // Check if currently in the favorite board page.
    if (inFavoriteBoardPage) {
      // If in the favorite board page, set it to false.
      dispatch(handleSetInFavoriteBoardPage(false));

    } else {
      // If not in the favorite board page, set it to true.
      dispatch(handleSetInFavoriteBoardPage(true));

      // Possibly update the value, e.g., setting it to '1'.
      setValue('1');
    }
  };

  const handleFavoriteBoardTitleDOM = () => {
    return (
      <>
        <Box sx={{
          display: 'flex',
          flexDirection: 'row',
          alignItems: 'center',
          flexWrap: 'nowrap',
        }} >
          <Typography variant="h4">
            {keywords
              ? t('pages.listPage.boardFilter.searchResult')
              : t('pages.listPage.favorites')}
          </Typography>
          {!keywords ? (
            <BetaContentTooltip
              title={t('components.board.betaContent')}
              placement="bottom-start"
            >
              <BetaTypography>BETA</BetaTypography>
            </BetaContentTooltip>
          ) : null}
        </Box>

        {keywords && (
          <Box
            sx={{
              flexGrow: 1,
              paddingLeft: (theme) => theme.spacing(3),
              paddingRight: (theme) => theme.spacing(3),
              overflowX: 'hidden',
              display: 'grid',
              gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
              gap: '1rem',
            }}
          >
            <FormGroup>
              <FormControlLabel
                sx={{ mr: 0 }}
                control={
                  <Switch
                    id="roomChecked"
                    onChange={changeSearchInFavoritesBoard}
                    defaultChecked
                  />
                }
                label={t(
                  'pages.listPage.boardFilter.ShowBoardsInFavorites'
                )}
              />
            </FormGroup>
          </Box>
        )}
      </>
    );
  };

  return (

    <Box sx={{ height: '100%', width: '100%', display: 'flex', flexDirection: 'row' }}>
      <RoomLeftDrawer parentComponent="favoritesBoardPage" />
      <Box sx={{
        width: '100%',
        height: '100%',
        flexGrow: 1,
        backgroundColor: theme.palette.background.paper
      }}
        id="mainBoard2">
        <Box sx={{
          flexGrow: 1,
          width: '100%'
        }}>
          <AppBarHeader />
          <Toolbar sx={{
            paddingTop: '16px',
            background: 'rgba(255,255,255,0.85)',
            backdropFilter: 'blur(16px)',
            width: '100%',
            display: 'flex',
            flexDirection: 'row',
            alignItems: 'center',
            flexWrap: 'nowrap',
            justifyContent: 'space-between',

            zIndex: 1001
          }}>
            {handleFavoriteBoardTitleDOM()}
          </Toolbar>


          {!keywords && (
            <div
              id="content2"
              ref={contentRef}
              style={{
                overflowY: 'scroll',
                height: winHeight
              }}
            >
              {favoriteBoardList && favoriteBoardList.length !== 0 ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    paddingLeft: (theme) => theme.spacing(3),
                    paddingRight: (theme) => theme.spacing(3),
                    overflowX: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem',
                  }}
                  id="FavoritesBoardContent"
                >
                  {favoriteBoardList.map(d => (
                    <Board board={d} key={d._id} type="recentPageBoard" />
                  ))}
                </Box>
              ) : null}

              {favoriteBoardList && favoriteBoardList.length === 0 ? (
                <Box
                  sx={{
                    flexGrow: 1,
                    paddingLeft: (theme) => theme.spacing(3),
                    paddingRight: (theme) => theme.spacing(3),
                    overflowX: 'hidden',
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                    gap: '1rem',
                  }}
                  id="NoFavoritesBoardContent"
                >
                  <Box
                    sx={{
                      display: 'flex',
                      width: '460px',
                      flexDirection: 'column',
                      alignItems: 'center',
                      position: 'absolute',
                      top: '50%',
                      left: '50%',
                      transform: 'translate(-50%, -50%)'
                    }}
                  >
                    <img
                      width="160px"
                      height="160px"
                      src="/images/favoritesPageBgImg.svg"
                      alt="收藏页面背景图"
                    />
                    <Typography sx={{ mt: '24px' }}>
                      {t('pages.listPage.favoritesPageBgText')}
                    </Typography>
                  </Box>
                </Box>
              ) : null}
            </div>
          )}

          {keywords && (
            <ThemeProvider theme={lightTheme}>
              <TabContext value={value}>
                <TabList onChange={handleChange} sx={{
                  flexGrow: 1,
                  paddingLeft: theme.spacing(3),
                  paddingRight: theme.spacing(3),

                  // marginTop: '120px',
                  fontSize: '12px',
                }}>
                  <Tab
                    label={
                      boardList.length > 1 && i18n.language === 'en'
                        ? boardList.length +
                        t('pages.listPage.roomSettings.boards') +
                        's'
                        : boardList.length +
                        t('pages.listPage.roomSettings.boards')
                    }
                    value="1"
                  />
                  {!inFavoriteBoardPage && (
                    <Tab
                      label={
                        favoriteBoardList.length +
                        t('pages.listPage.roomSettings.favoriteBoard')
                      }
                      value="2"
                    />
                  )}
                </TabList>
                <TabPanel sx={{ p: 0 }} value="1">
                  <Box sx={{ flexGrow: 1 }}>
                    {boardList.length > 0 && (
                      <Box
                        sx={{
                          flexGrow: 1,
                          paddingLeft: (theme) => theme.spacing(3),
                          paddingRight: (theme) => theme.spacing(3),
                          overflowX: 'hidden',
                          display: 'grid',
                          gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                          gap: '1rem',
                        }}>
                        {boardList.map(d => (
                          <Board
                            board={d}
                            isAll={true}
                            key={d._id}
                            type="recentPageBoard"
                          />
                        ))}
                      </Box>
                    )}
                    {boardList.length == 0 && (
                      <div
                        id="boardContent"
                        style={{
                          width: '100%',
                          textAlign: 'center',
                          marginTop: '150px',
                          fontSize: '16px'
                        }}
                      >
                        {t('pages.listPage.roomSettings.noBoard')}
                      </div>
                    )}
                  </Box>
                </TabPanel>
                {!inFavoriteBoardPage && (
                  <TabPanel sx={{ p: 0 }} value="2">
                    <Box sx={{ flexGrow: 1 }}>
                      {favoriteBoardList.length > 0 && (
                        <Box
                          sx={{
                            flexGrow: 1,
                            paddingLeft: (theme) => theme.spacing(3),
                            paddingRight: (theme) => theme.spacing(3),
                            overflowX: 'hidden',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))',
                            gap: '1rem',
                          }}
                          id="boardContent"

                        >
                          {favoriteBoardList.map(d => (
                            <Board
                              board={d}
                              isAll={true}
                              key={d._id}
                              type="recentPageBoard"
                            />
                          ))}
                        </Box>
                      )}
                      {favoriteBoardList.length == 0 && (
                        <div
                          id="boardContent"
                          style={{
                            width: '100%',
                            textAlign: 'center',
                            marginTop: '150px',
                            fontSize: '16px'
                          }}
                        >
                          {t('pages.listPage.roomSettings.noBoard')}
                        </div>
                      )}
                    </Box>
                  </TabPanel>
                )}
              </TabContext>
            </ThemeProvider>
          )}
        </Box>
      </Box>
    </Box>

  );
}

const BetaContentTooltip = styled(({ className, ...props }: TooltipProps) => (
  <Tooltip {...props} classes={{ popper: className }} />
))({
  [`& .${tooltipClasses.tooltip}`]: {
    maxWidth: 230,
    width: '230px',
    padding: '10px',
    margin: '8px 0px !important',
    boxSizing: 'border-box',
    fontSize: '0.875rem',
    fontWeight: 400,
    fontStyle: 'normal',
    lineHeight: '20px'
  }
});

const BetaTypography = styled(Typography)({
  margin: '0px 22px 0px 8px',
  fontSize: '0.75rem',
  fontWeight: 700,
  width: '36px',
  height: '15px',
  backgroundColor: '#65E9E9',
  borderRadius: '2px',
  color: '#FFFFFF',
  textAlign: 'center',
  lineHeight: '15px',
  cursor: 'pointer'
});
