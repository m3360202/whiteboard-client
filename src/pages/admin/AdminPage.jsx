import * as React from 'react';
import { useEffect } from 'react';
import { useHistory } from 'react-router-dom';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import { useSelector } from 'react-redux';
import store, { RootState } from '../../store';

//** Import Mui
import { styled, useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Drawer from '@mui/material/Drawer';
import CssBaseline from '@mui/material/CssBaseline';
import MuiAppBar from '@mui/material/AppBar';
import List from '@mui/material/List';
import Divider from '@mui/material/Divider';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemText from '@mui/material/ListItemText';

import AIModelManagementPage from './AIModel/AIModelManagementPage';
import UserManagement from './user/UserManagement';
import PermissionManagement from './permission/PermissionManagement';
//** Import components
import AIAssistantContentAdminPage from './AIAssistantContentAdmin/AIAssistantContentAdminPage';
import AIAssistantImagesAdminPage from './AICustomStyleCommand/AIAssistantImagesAdminPage';
import AIAgentManagement from './AIAgent/AIAgentManagement';

import { useCheckActionPermissionMutation } from '../../redux/PermissionApiSlice';
import {
  BoardService,
  UserService
} from '../../services';
import server from '../../startup/serverConnect';

const drawerWidth = 240;

/**
 * Styled component for the main content area, which can have an optional open prop
 * that determines the margin-left property for creating a responsive drawer effect.
 *
 * @param {object} theme - The theme object containing styling information.
 * @param {boolean} open - A boolean prop indicating whether the drawer is open or closed.
 * @returns {object} - A styled component representing the main content area.
 */
const Main = styled('main', { shouldForwardProp: prop => prop !== 'open' })(
  ({ theme, open }) => ({
    flexGrow: 1,
    padding: theme.spacing(3),
    transition: theme.transitions.create('margin', {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.leavingScreen
    }),
    marginLeft: `-${drawerWidth}px`,
    ...(open && {
      transition: theme.transitions.create('margin', {
        easing: theme.transitions.easing.easeOut,
        duration: theme.transitions.duration.enteringScreen
      }),
      marginLeft: 0
    })
  })
);

/**
 * Styled component for the AppBar, which can have an optional open prop
 * that determines the width and margin-left properties for creating a responsive drawer effect.
 *
 * @param {object} theme - The theme object containing styling information.
 * @param {boolean} open - A boolean prop indicating whether the drawer is open or closed.
 * @returns {object} - A styled component representing the AppBar.
 */
const AppBar = styled(MuiAppBar, {
  shouldForwardProp: prop => prop !== 'open'
})(({ theme, open }) => ({
  transition: theme.transitions.create(['margin', 'width'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen
  }),
  ...(open && {
    width: `calc(100% - ${drawerWidth}px)`,
    marginLeft: `${drawerWidth}px`,
    transition: theme.transitions.create(['margin', 'width'], {
      easing: theme.transitions.easing.easeOut,
      duration: theme.transitions.duration.enteringScreen
    })
  })
}));

/**
 * Styled component for a drawer header, typically used at the top of a drawer.
 *
 * @param {object} theme - The theme object containing styling information.
 * @returns {object} - A styled component representing the drawer header.
 */
const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  padding: theme.spacing(0, 1),
  ...theme.mixins.toolbar,
  justifyContent: 'flex-end'
}));

export default function AdminPage() {
  const history = useHistory();
  const { t } = useTranslation();
  const [open, setOpen] = React.useState(true);
  const [value, setValue] = React.useState('Task Prompt');
  const [loading, setLoading] = React.useState(true);
  const leftListData = [
    'Task Prompt',
    'Agent Prompt',
    'Image Prompt',
    'AI Model',
    // 'Operation',
    'Users',
    // 'Referral',
    'Permission'
  ];

  const userInfo = store.getState().user.userInfo;

  useEffect(() => {
    BoardService.getInstance();
    UserService.getInstance();
    const token = localStorage.getItem('token');
    if (!store.getState().user.userInfo.userId) {
      if (!token && !store.getState().user.createVistorDone) {
        store.dispatch(handleSetCreateVistorDone(true));
      } else {

        loadUser();
        async function loadUser() {
          let user = await server.login({ resume: token });
          const userId = user.id;
          await server.call('saveLoginToken', token,userId);
          if (user && user.token) {
            // store.dispatch(handleSetInitDone(true));
            let user = await server.call('getUserInfo');
            UserService.getInstance().saveStore(user);

          }
        }


        // server.call('loginWithToken', token).then(async res => {
        //   if (res && res.status) {
        //     UserService.getInstance().saveStore(res.user);
        //   }
        // });
      }
    }
  }, []);

  const [handleCheckActionPermission] = useCheckActionPermissionMutation();

  const checkActionPermission = async permissionName => {
    let data = {
      permissionName: permissionName,
      roles: JSON.parse(localStorage.getItem('userRoles'))
    };
    return await handleCheckActionPermission(data);
  };

  const handleClickTogglePage = async value => {
    await checkActionPermission(`Enter ${value}`).then((data) => {
      if (data.data) {
        setValue(value);
      } else {
        alert(t('adminPage.alertTips'));
      }
    });
  };

  const checkIndexPermission = () => {
    checkActionPermission('Enter Task Prompt').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem0');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
    checkActionPermission('Enter Agent Prompt').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem1');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
    checkActionPermission('Enter Image Prompt').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem2');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
    checkActionPermission('Enter AI Model').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem3');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
    checkActionPermission('Enter Operation').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem4');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
    checkActionPermission('Enter Users').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem5');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
    checkActionPermission('Enter Referral').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem6');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
    checkActionPermission('Enter Permission').then((data) => {
      if (data.data) {
        const element = document.getElementById('indexItem7');
        if (element) {
          element.style.display = 'block';
        }
      }
    });
  };

  useEffect(() => {
    async function deal() {
      checkActionPermission('EnterAdminDashBoard').then((data) => {
        if (!data.data) {
          history.push('/recent');
        } else {
          setLoading(false);
        }
      });
      await checkIndexPermission();
    }
    deal();
  }, []);

  return (
    <Box sx={{ height: '100vh' }}>
      {!loading && (
        <Box sx={{ display: 'flex', height: '100%' }}>
          <CssBaseline />
          <AppBar position="fixed" open={open}></AppBar>
          <Drawer
            sx={{
              width: drawerWidth,
              flexShrink: 0,
              '& .MuiDrawer-paper': {
                width: drawerWidth,
                boxSizing: 'border-box'
              }
            }}
            variant="persistent"
            anchor="left"
            open={open}
          >
            <DrawerHeader></DrawerHeader>
            <Divider />
            <List>
              {leftListData.map((text, index) => (
                <ListItem
                  id={'indexItem' + index}
                  style={{
                    backgroundColor: value === text ? '#D3F3F3' : 'transparent'
                  }}
                  key={index}
                  disablePadding
                  onClick={() => handleClickTogglePage(text)}
                >
                  <ListItemButton>
                    <ListItemText primary={text} />
                  </ListItemButton>
                </ListItem>
              ))}
            </List>
          </Drawer>
          <Main
            style={{ background: '#f5f5f5', padding: '0 24px 20px' }}
            open={open}
          >
            {value === 'Task Prompt' && <AIAssistantContentAdminPage />}
            {value === 'Agent Prompt' && <AIAgentManagement />}
            {value === 'Image Prompt' && <AIAssistantImagesAdminPage />}
            {value === 'AI Model' && <AIModelManagementPage />}
            {value === 'Users' && <UserManagement />}
            {value === 'Permission' && <PermissionManagement />}
          </Main>
        </Box>
      )}
    </Box>
  );
}
