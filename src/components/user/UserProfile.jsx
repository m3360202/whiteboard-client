//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useState, useRef } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleUpdataNickname, handleUpdataAvatar } from '../../store/user';
import { handleSetRoomMemberList } from '../../store/room';
import { handleSetOrgMemberList } from '../../store/org';
import {useUpdateUserAvatarToAwsMutation,useSaveUserProfileMutation} from '../../redux/UserAPISlice';
import { useGetOrgMemberListQuery } from '../../redux/OrgAPISlice';

//**Import Mui
import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import DialogContent from '@mui/material/DialogContent';
import { useTheme } from '@mui/material/styles';
import Divider from '@mui/material/Divider';
import useMediaQuery from '@mui/material/useMediaQuery';
import { ThemeProvider, Button} from '@mui/material';
import TextField from '@mui/material/TextField';
import lightTheme from '../../mui/theme/lightTheme';
import Typography from '@mui/material/Typography';
import BootstrapDialog, {
  BootstrapDialogTitle
} from '../../mui/components/BootstrapDialog';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { FileService,UtilityService } from '../../services';

const PREFIX = 'UserProfile';

const classes = {
  inviteLink: `${PREFIX}-inviteLink`,
  paper: `${PREFIX}-paper`,
  roomSetting: `${PREFIX}-roomSetting`,
  container: `${PREFIX}-container`,
  avatarLarge: `${PREFIX}-avatarLarge`,
  avatarUpdateImage: `${PREFIX}-avatarUpdateImage`,
  avatarUpdateImageSize: `${PREFIX}-avatarUpdateImageSize`,
  input: `${PREFIX}-input`,
  profileLink: `${PREFIX}-profileLink`,
  profileLinkText: `${PREFIX}-profileLinkText`,
  profileDialogContent: `${PREFIX}-profileDialogContent`,
  profileDialogTitle: `${PREFIX}-profileDialogTitle`,
  emailFlexbox: `${PREFIX}-emailFlexbox`,
  divider: `${PREFIX}-divider`
};

const StyledThemeProvider = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.inviteLink}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    width: '100%'
  },

  [`& .${classes.paper}`]: {
    position: 'absolute',
    maxWidth: 386,
    width: 386,
    backgroundColor: theme.palette.background.paper,
    border: '0px solid #000',
    outline: 'none'
  },

  [`& .${classes.roomSetting}`]: {
    width: '100%',
    [theme.breakpoints.up('sm')]: {
      float: 'left'
    }
  },

  [`& .${classes.container}`]: {
    height: '100%'
  },

  [`& .${classes.avatarLarge}`]: {
    width: theme.spacing(10),
    height: theme.spacing(10),
    cursor: 'pointer',
    margin: 'auto'
  },

  [`& .${classes.avatarUpdateImage}`]: {
    marginLeft: 174,
    marginTop: -18,
    marginBottom: -16,
    float: 'left',
    position: 'relative'
  },

  [`& .${classes.avatarUpdateImageSize}`]: {
    width: 24,
    height: 24,
    zIndex: 10
  },

  [`& .${classes.input}`]: {
    size: 100
  },

  [`& .${classes.profileLink}`]: {
    padding: 0,
    margin: '8px 0',
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
  },

  [`& .${classes.profileLinkText}`]: {
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '24px',
    color: '#232930'
  },

  [`& .${classes.profileDialogContent}`]: {
    paddingLeft: 32,
    paddingRight: 32,
    paddingTop: 0
  },

  [`& .${classes.profileDialogTitle}`]: {
    height: 50,
   
    left: 264,
    top: 108
  },

  [`& .${classes.emailFlexbox}`]: {
    display: 'flex',
    justifyContent: 'center',
    flexDirection: 'column',
    rowGap: 2
  },

  [`& .${classes.divider}`]: {
    marginTop: 24,
    marginBottom: 24
  }
}));

export default function UserProfile({ user, handleClose }) {
  //use now
  const theme = useTheme();

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const rsBtn = useRef(null);
  const fullNameRef = useRef();
  const newPasswordRef = useRef();
  const confirmPasswordRef = useRef();
  const fullScreen = useMediaQuery(theme.breakpoints.down('sm'));
  const [openDialog, setOpenDialog] = useState(false);
  const [displayName, setDisplayName] = useState(true);
  const [displayPassword, setDisplayPassword] = useState(true);
  const [updateUserAvatarToAws] = useUpdateUserAvatarToAwsMutation();
  const [saveUserProfile] = useSaveUserProfileMutation();
  //user
  let userInfo = useSelector((state) => state.user.userInfo);
  //room
  const roomMemberList = useSelector(
    (state) => state.room.roomMemberList
  );

  //org
  const orgInfo = useSelector((state) => state.org.orgInfo);
  const { data: orgMemberList = [] } = useGetOrgMemberListQuery({
    orgId: orgInfo.orgId
  });

  const isWechatUser = userInfo.type === 'wechatUser' ? true : false;
const handleSaveUserProfile = async(data)=>{
  await saveUserProfile(data);
}
  const handleClickOpen = () => {
    setOpenDialog(true);
  };

  const handleDialogClose = () => {
    setOpenDialog(false);
    handleClose();
  };

  const onSubmitName = async e => {
    e.preventDefault();
    setDisplayName(true);
    const newName = fullNameRef.current ? fullNameRef.current.value : '';
    let data = {};

    if (newName === userInfo.nickName) return;
    if (newName && newName !== userInfo.nickName) {
      data = { name: newName };
    }
    handleSaveUserProfile(data);
    updateUserName(newName);
  };

  const updateUserName = newName => {
    dispatch(handleUpdataNickname(newName));
    let newRoomMemberList = [];
    roomMemberList.map(item => {
      if (item._id === store.getState().user.userInfo.userId) {
        item = { ...item, name: newName };
      }
      newRoomMemberList.push(item);
    });
    dispatch(handleSetRoomMemberList(newRoomMemberList));
    let newOrgMemberList = [];
    orgMemberList.map(item => {
      if (item.userId === store.getState().user.userInfo.userId) {
        item = { ...item, user: [{ ...item.user[0], name: newName }] };
      }
      newOrgMemberList.push(item);
    });
    dispatch(handleSetOrgMemberList(newOrgMemberList));
  };

  const onSubmitPassword = async e => {
    e.preventDefault();
    setDisplayPassword(true);

    const newPassword = newPasswordRef.current
      ? newPasswordRef.current.value
      : '';
    const confirmPassword = confirmPasswordRef.current
      ? confirmPasswordRef.current.value
      : '';

    let data = {};
    if (!newPassword && !confirmPassword) {
      return;
    } else if (confirmPassword === '') {
      Boardx.Util.Msg.info(t('pages.authPageJoin.passwordCheck'));
      return;
    } else if (
      newPassword !== '' &&
      confirmPassword !== '' &&
      newPassword !== confirmPassword
    ) {
      Boardx.Util.Msg.info(t('pages.authPageJoin.passwordCheck'));
      return;
    } else {
      data = { newPassword: newPassword };
      handleSaveUserProfile(data);
    }
  };

  const stopTabPropagation = event => {
    if (event.key === 'Tab') {
      event.stopPropagation();
    }
  };

  const onUpdateName = e => {
    e.preventDefault();
    setDisplayName(false);
  };

  const onUpdatePassword = e => {
    e.preventDefault();
    setDisplayPassword(false);
  };

  const onCancelName = e => {
    e.preventDefault();
    setDisplayName(true);
  };

  const onCancelPassword = e => {
    e.preventDefault();
    setDisplayPassword(true);
  };
 const handleUpdateUserAvatarToAws=async(key)=>{
    await updateUserAvatarToAws(key);
 }
  const updateAvatar = async e => {
    //show updateing
    Boardx.Util.Msg.info(t('pages.authPageJoin.avatarUpdating'));
    // deal target file
    const file = e.target.files[0];
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    const avatarImage = $($('#avatar-img').find('img')[0]);
    const r2UploadPath = UtilityService.getInstance().getr2UploadPathByOrg(orgInfo);
    const key = await FileService.getInstance().uploadAvatarToR2(r2UploadPath,file, {
      progress(ee) {}
    });

    if (!key) {
      Boardx.Util.Msg.warning(t('pages.authPageJoin.avatarUpdateFailed'));
      return;
    }
    const reader = new FileReader();
    reader.onloadend = function () {
      avatarImage.prop('src', reader.result);
    };
    reader.readAsDataURL(file);
    const newImg = key;
    store.dispatch(handleUpdataAvatar(newImg));
    handleUpdateUserAvatarToAws(newImg);
    
  };

  const userProfileBtnDOM = (
    <Box id="rsButton" ref={rsBtn}>
      <Box
        className={classes.profileLink}
        id="id_roomsetting"
        onClick={handleClickOpen}
      >
        <Typography variant="body2" className={classes.profileLinkText}>
          {t('components.userMenu.accounts')} &{' '}
          {t('components.userMenu.settings')}
        </Typography>
        <ArrowForwardIcon />
      </Box>
    </Box>
  );

  const userProfileAvatarCOM = () => {
    return (
      <label htmlFor="icon-button-file">
        <input
          accept="image/*"
          className={classes.input}
          id="icon-button-file"
          onChange={updateAvatar}
          style={{ display: 'none' }}
          type="file"
        />
        <Avatar
          {...Boardx.Util.stringAvatar(userInfo.nickName)}
          alt={
            userInfo.avatarType === 'data'
              ? userInfo.nickName
              : userInfo.nickName.toUpperCase()
          }
          className={classes.avatarLarge}
          id="avatar-img"
          src={userInfo.avatar}
        />

        {!isWechatUser && (
          <div className={classes.avatarUpdateImage}>
            <svg
              width="16"
              height="16"
              viewBox="0 0 24 24"
              fill="none"
              xmlns="http://www.w3.org/2000/svg"
            >
              <circle
                cx="12"
                cy="12"
                r="11.5"
                fill="#D3F4F4"
                stroke="#D3F4F4"
              ></circle>
              <g clipPath="url(#clip0_36_1583)">
                <path
                  d="M18.7933 5.20666C18.5662 4.98053 18.2966 4.80164 18 4.68031C17.7033 4.55899 17.3856 4.49764 17.0651 4.49981C16.7447 4.50198 16.4278 4.56763 16.1328 4.69295C15.8379 4.81828 15.5707 5.00081 15.3467 5.22999L5.68 14.8967L4.5 19.5L9.10333 18.3193L18.77 8.65266C18.9992 8.42875 19.1818 8.16161 19.3072 7.86671C19.4326 7.5718 19.4982 7.25496 19.5004 6.93452C19.5026 6.61408 19.4412 6.29639 19.3198 5.99981C19.1985 5.70323 19.0195 5.43365 18.7933 5.20666V5.20666Z"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M15.0706 5.50665L18.4932 8.92932"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
                <path
                  d="M5.68066 14.896L9.10666 18.316"
                  stroke="black"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                ></path>
              </g>
              <defs>
                <clipPath id="clip0_36_1583">
                  <rect
                    width="16"
                    height="16"
                    fill="white"
                    transform="translate(4 4)"
                  ></rect>
                </clipPath>
              </defs>
            </svg>
          </div>
        )}
      </label>
    );
  };

  const userEmailCOM = (
    <>
      <Typography>{t('pages.account.email')}</Typography>
      <Typography>{userInfo.email}</Typography>
    </>
  );

  const updateNameBtnCOM = () => {
    if (displayName) {
      return (
        <Box sx={{ display: 'flex' }}>
          <Button
            className={classes.pink}
            color="primary"
            onClick={onUpdateName}
            type="submit"
          >
            {t('pages.account.update')}
          </Button>
        </Box>
      );
    }
    return null;
  };
const handleKeyDown = (e)=>{
  e.stopPropagation();
}
  const updateNameCOM = (
    <>
      <TextField
        defaultValue={userInfo.nickName}
        fullWidth
        id="fullname"
        inputProps={{ style: { height: '18px' } }}
        inputRef={fullNameRef}
        label={t('pages.account.name')}
        variant="outlined"
        onKeyDown={handleKeyDown}
      />
      <Button
        className={classes.pink}
        color="primary"
        onClick={onSubmitName}
        type="submit"
        variant="contained"
        style={{marginTop:'5px'}}
      >
        {t('pages.account.save')}
      </Button>
      <Button
        className={classes.pink}
        color="primary"
        onClick={onCancelName}
        type="submit"
      >
        {t('pages.account.cancel')}
      </Button>
    </>
  );

  const updatePasswordBtnCOM = () => {
    if (displayPassword && !isWechatUser) {
      return (
        <Box sx={{ display: 'flex' }}>
          <Button
            className={classes.pink}
            color="primary"
            onClick={onUpdatePassword}
            type="update"
          >
            {t('pages.account.update')}
          </Button>
        </Box>
      );
    }
    return null;
  };

  const updatePasswordCOM = (
    <>
      <TextField
        autoComplete="new-password"
        fullWidth
        inputProps={{ style: { height: '18px' } }}
        inputRef={newPasswordRef}
        label={t('pages.account.newPassword')}
        name="password"
        type="password"
        variant="outlined"
        onKeyDown={handleKeyDown}
      />
      <TextField
        autoComplete="new-password"
        fullWidth
        inputProps={{ style: { height: '18px' } }}
        inputRef={confirmPasswordRef}
        label={t('pages.account.confirmPassword')}
        name="typedpassword"
        type="password"
        variant="outlined"
        onKeyDown={handleKeyDown}
        style={{marginTop:'5px'}}
      />
      <Button
        className={classes.pink}
        color="primary"
        onClick={onSubmitPassword}
        type="submit"
        variant="contained"
        style={{marginTop:'5px'}}
      >
        {t('pages.account.save')}
      </Button>
      <Button
        className={classes.pink}
        color="primary"
        onClick={onCancelPassword}
        type="submit"
      >
        {t('pages.account.cancel')}
      </Button>
    </>
  );

  return (
    <StyledThemeProvider theme={lightTheme}>
      <div className={classes.roomSetting}>
        <div style={{ width: '100%' }}>
          {userProfileBtnDOM}
          <BootstrapDialog
            PaperProps={{ className: classes.paper }}
            aria-labelledby="responsive-dialog-title"
            classes={{ container: classes.container }}
            fullScreen={fullScreen}
            onBackdropClick={handleClose}
            onKeyDown={stopTabPropagation}
            open={openDialog}
          >
            <BootstrapDialogTitle
              className={classes.profileDialogTitle}
              id="responsive-dialog-title"
              onClose={handleDialogClose}
            >
              {t('components.userMenu.accounts')}
            </BootstrapDialogTitle>
            <DialogContent className={classes.profileDialogContent}>
              <Box>{userProfileAvatarCOM()}</Box>
              <Box style={{ marginTop: 24 }}>
                {!isWechatUser && (
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      rowGap: 2
                    }}
                  >
                    {userEmailCOM}
                  </Box>
                )}
                {!isWechatUser && <Divider className={classes.divider} />}

                <Box>
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      flexDirection: 'row',
                      alignItems: 'center',
                      marginBottom: 2
                    }}
                  >
                    <Typography sx={{ display: 'flex' }}>
                      {t('pages.account.name')}
                    </Typography>
                    {updateNameBtnCOM()}
                  </Box>
                  <Typography
                    id="displayName"
                    sx={{ display: displayName ? 'flex' : 'none' }}
                  >
                    {userInfo.nickName}
                  </Typography>
                  <Box
                    id="updateName"
                    sx={{
                      display: displayName ? 'none' : 'flex',
                      justifyContent: 'center',
                      flexDirection: 'column',
                      rowGap: 1
                    }}
                  >
                    {updateNameCOM}
                  </Box>
                </Box>
                <Divider className={classes.divider} />
                {!isWechatUser && (
                  <Box>
                    <Box
                      sx={{
                        display: 'flex',
                        justifyContent: 'space-between',
                        flexDirection: 'row',
                        alignItems: 'center',
                        rowGap: 1,
                        marginBottom: 2
                      }}
                    >
                      <Typography sx={{ display: 'flex' }}>
                        {t('pages.account.password')}
                      </Typography>
                      {updatePasswordBtnCOM()}
                    </Box>
                    <Typography
                      id="displayPassword"
                      sx={{ display: displayPassword ? 'flex' : 'none' }}
                    >
                      {' '}
                      **********{' '}
                    </Typography>
                    <Box
                      id="updatePassword"
                      sx={{
                        display: displayPassword ? 'none' : 'flex',
                        justifyContent: 'center',
                        flexDirection: 'column',
                        rowGap: 1
                      }}
                    >
                      {updatePasswordCOM}
                    </Box>
                  </Box>
                )}
              </Box>
            </DialogContent>
          </BootstrapDialog>
        </div>
      </div>
    </StyledThemeProvider>
  );
}
