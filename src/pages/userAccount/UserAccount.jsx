//** Import React
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import MUI
import TextField from '@mui/material/TextField';
import { Paper, Grid, CssBaseline, Hidden, ThemeProvider } from '@mui/material';
import Avatar from '@mui/material/Avatar';
import { useTranslation } from 'react-i18next';
import IconButton from '@mui/material/IconButton';
import lightTheme from '../../mui/theme/lightTheme';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import LazyLoad from 'react-lazyload';
import MenuIcon from '@mui/icons-material/Menu';
import RoomLeftDrawer from '../../components/room/RoomLeftDrawer';
import { useTag } from '../../state/TagState';
import Button from '@mui/material/Button';

//** Import Redux kit
import store, { RootState } from '../../store';
import { handleUpdataAvatar } from '../../store/user';
import {
  useUpdateUserAvatarToAwsMutation,
  useSaveUserProfileMutation
} from '../../redux/UserAPISlice';
import { useSelector } from 'react-redux';
import { FileService, UtilityService } from '../../services';

const drawerWidth = 240;

function UserAccount() {

  const [roomList, setRoomList] = React.useState([]);
  const [tag, setTag] = useTag();
  const { t } = useTranslation();
  const user = useSelector((state) => state.user.userInfo);
  const avaUrl = `${user.avatar}`;
  const [url, setUrl] = useState(avaUrl);

  const [updateUserAvatarToAws] = useUpdateUserAvatarToAwsMutation();
  const [saveUserProfile] = useSaveUserProfileMutation();

  const handleSaveUserProfile = async data => {
    await saveUserProfile(data);
  };

  // Define a function called onSubmit that takes an event object 'e' as a parameter.
  const onSubmit = async e => {
    // Prevent the default behavior of the event, typically form submission.
    e.preventDefault();

    // Retrieve values from input fields using jQuery selectors.
    const newName = $('#fullname').val();
    const oldpassword = $('#standard-password-current').val();
    const password = $('#standard-password-input').val();
    const password2 = $('#standard-password-input2').val();

    let data = {};

    // Check if there are no changes to the user's name, old password, and new passwords.
    if (
      newName === store.getState().user.userInfo.userName &&
      !oldpassword &&
      !password &&
      !password2
    ) {
      // Display an informational message and exit the function.
      Boardx.Util.Msg.info(t('pages.authPageJoin.noChange'));
      return;
    }

    // Check if there is a new name and it's different from the current name.
    if (newName && newName !== store.getState().user.userInfo.userName) {
      data = { name: newName };
    }
    // Check if there are new passwords and they match.
    if (password !== '' && password2 !== '' && password === password2) {
      data = { ...data, newPassword: password };
    } else if (password !== '' && password2 !== '' && password !== password2) {
      Boardx.Util.Msg.info(t('pages.authPageJoin.passwordCheck'));
      return;
    }

    // Call a function 'handleSaveUserProfile' to save/update the user profile with the 'data' object.
    handleSaveUserProfile(data);
  };

  const handleUpdateUserAvatarToAws = async key => {
    await updateUserAvatarToAws(key);
  };

  // Define a function called updateAvatar that takes an event object 'e' as a parameter.
  const updateAvatar = async e => {
    // Display an informational message indicating that the avatar is being updated.
    Boardx.Util.Msg.info(t('pages.authPageJoin.avatarUpdating'));

    // Retrieve the selected file from the event.
    const file = e.target.files[0];

    // Create a FormData object and append the selected file to it.
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);

    // Find the avatar image element using jQuery.
    const avatarImage = $($('#avatar-img').find('img')[0]);

    // Retrieve organization information from the Redux store.
    const orgInfo = store.getState().org.orgInfo;

    // Get the upload path for R2 using a utility service and organization information.
    const r2UploadPath =
      UtilityService.getInstance().getr2UploadPathByOrg(orgInfo);

    // Upload the avatar file to R2 and get the key.
    const key = await FileService.getInstance().uploadAvatarToR2(
      r2UploadPath,
      file,
      {
        progress(ee) {}
      }
    );

    // Check if the key is missing, indicating an upload failure.
    if (!key) {
      Boardx.Util.Msg.warning(t('pages.authPageJoin.avatarUpdateFailed'));
      return;
    }

    // Create a FileReader to read the uploaded file as a data URL.
    const reader = new FileReader();
    reader.onloadend = function () {
      // Set the source of the avatar image to the data URL.
      avatarImage.prop('src', reader.result);
    };
    reader.readAsDataURL(file);

    // Update the user's avatar in the Redux store.
    const newImg = key;
    store.dispatch(handleUpdataAvatar(newImg));

    // Call a function to update the user's avatar to AWS.
    handleUpdateUserAvatarToAws(newImg);
  };

  const content = (
    <div style={{ maxWidth: 800, marginTop: 20, padding: 18 }}>
      <CssBaseline />

      <form autoComplete="off" noValidate>
        <Paper style={{ padding: 16 }}>
          <Grid
            alignItems="flex-start"
            container
            justifyContent="center"
            spacing={9}
          >
            <Grid item sm={4} xs={12}>
              <label htmlFor="icon-button-file">
                <input
                  accept="image/*"
                  sx={{ display: 'none'}}
                  id="icon-button-file"
                  onChange={updateAvatar}
                  style={{ display: 'none' }}
                  type="file"
                />

                <Avatar
                  {...Boardx.Util.stringAvatar(
                    store.getState().user.userInfo&& store.getState().user.userInfo.userName
                  )}
                  alt={
                    store.getState().user.userInfo&&
                    store.getState().user.userInfo.userName &&
                    store.getState().user.userInfo.userName.toUpperCase()
                  }
                  sx={{ width: theme.spacing(20),
                    height: theme.spacing(20),
                    cursor: 'pointer',
                    margin: 'auto'}}
                  id="avatar-img"
                  src={`${url}?tag=${tag}`}
                />

                <Button
                  aria-label="upload picture"
                  color="primary"
                  component="span"
                  size="small"
                  style={{ width: '100%' }}
                  variant="text"
                >
                  Update
                </Button>
              </label>
            </Grid>

            <Grid item sm={8} xs={12} sx={{'.text':{padding: theme.spacing(2)}}}>
              <Grid className={'text'} item xs={12}>
                <TextField
                  defaultValue={store.getState().user.userInfo&& store.getState().user.userInfo.userName}
                  fullWidth
                  id="fullname"
                  label="Name"
                  variant="standard"
                />
              </Grid>
              <Grid className={'text'} item xs={12}>
                <TextField
                  defaultValue={store.getState().user.userInfo&& store.getState().user.userInfo.userName}
                  disabled
                  fullWidth
                  id="standard-password-current"
                  label="username"
                  name="username"
                  variant="standard"
                />
              </Grid>
              <Grid className={'text'} item xs={12}>
                <TextField
                  defaultValue={
                    store.getState().user.userInfo && store.getState().user.userInfo.email[0] && store.getState().user.userInfo.email[0].address
                  }
                  disabled
                  fullWidth
                  id="email"
                  label="Email Address"
                  variant="standard"
                />
              </Grid>
              <Grid className={'text'} item xs={12}>
                <TextField
                  fullWidth
                  id="standard-password-input"
                  label="New Password"
                  name="password"
                  type="password"
                  variant="standard"
                />
              </Grid>
              <Grid className={'text'} item xs={12}>
                <TextField
                  fullWidth
                  id="standard-password-input2"
                  label="Confirm Password"
                  name="typedpassword"
                  type="password"
                  variant="standard"
                />
              </Grid>
              <Grid className={'text'} item style={{ marginTop: 16 }}>
                <Button
                  sx={{ background: '#f21d6b'}}
                  color="primary"
                  onClick={onSubmit}
                  type="submit"
                  variant="contained"
                >
                  Save
                </Button>
              </Grid>
            </Grid>
          </Grid>
        </Paper>
      </form>
    </div>
  );

  return (
    <Box theme={lightTheme}>
      <div>
        <AppBar
          sx={{ [theme.breakpoints.up('sm')]: {
            width: `calc(100% - ${drawerWidth}px)`,
            marginLeft: drawerWidth
          }}}
          elevation={0}
          position="fixed"
          style={{ backgroundColor: '#FFF', paddingTop: 24 }}
        >
          <Toolbar style={{ minHeight: 50 }}>
            <Hidden implementation="js" smUp>
              <IconButton
                aria-label="open drawer"
                color="inherit"
                edge="start"
                onClick={() => window.setMobileOpen(true)}
                size="large"
                style={{ color: '#828282' }}
              >
                <MenuIcon />
              </IconButton>
            </Hidden>
          </Toolbar>
        </AppBar>
        <LazyLoad once>
          <RoomLeftDrawer
            parentComponent="userAccount"
            roomList={roomList}
            setRoomList={setRoomList}
            user={user}
          />
        </LazyLoad>
        <div style={{[theme.breakpoints.up('sm')]: {
      width: `calc(100% - ${drawerWidth}px)`,
      marginLeft: drawerWidth
    },
    flexGrow: 1,
    marginTop: 50,
    overflowX: 'hidden',
    display: 'grid',
   /* gridTemplateColumns:
      'repeat(auto-fill, minmax(var(--auto-grid-min-size), 1fr))',*/
    gridGap: '1rem'}}>{content}</div>
      </div>
    </Box>
  );
}

export default UserAccount;
