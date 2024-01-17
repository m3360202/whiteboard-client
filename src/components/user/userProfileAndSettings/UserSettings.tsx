//** Import react
import React, { useState, useRef, useEffect } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { useSaveUserProfileMutation } from '../../../redux/UserAPISlice';

import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import LoadingButton from '@mui/lab/LoadingButton';
import MenuItem from '@mui/material/MenuItem';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import IconButton from '@mui/material/IconButton';
import OutlinedInput from '@mui/material/OutlinedInput';
import InputLabel from '@mui/material/InputLabel';
import InputAdornment from '@mui/material/InputAdornment';
import FormControl from '@mui/material/FormControl';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import Button from '@mui/material/Button';
import i18n from '../../../i18n';
//**Import Services
import { SysService } from '.././../../services';

function UserSettings() {

  const { t } = useTranslation();
  const valueRefNewPassword: any = useRef('');
  const valueRefConfirmPassword: any = useRef('');
  const [currentLanguage, setCurrentLanguage] = React.useState('English');
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [resetPasswordBtnLoading, setResetPasswordBtnLoading] = useState(false);

  const [saveUserProfile] = useSaveUserProfileMutation();

  const languageData = ['English', 'Chinese(简体中文)'];

  useEffect(() => {
    if (i18n.language.indexOf('en') > -1) {
      setCurrentLanguage(languageData[0]);
    } else {
      setCurrentLanguage(languageData[1]);
    }
  }, []);

  const handleChangeLanguageSelect = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    event.preventDefault();
    if (event.target.value) {
      setCurrentLanguage(event.target.value);
      SysService.setLocale(event.target.value === 'English' ? 'en' : 'zh-CN');
      location.reload();
    }
  };

  const handleClickResetPassword = async e => {
    e.preventDefault();

    const newPassword:any = valueRefNewPassword.current
      ? valueRefNewPassword.current.value
      : '';
    const confirmPassword:any = valueRefConfirmPassword.current
      ? valueRefConfirmPassword.current.value
      : '';

    let data = {};
    if (!newPassword || !confirmPassword) {
      Boardx.Util.Msg.info(t('pages.authPageJoin.passwordCheck'));
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
    } 
    else if (confirmPassword !== newPassword) {
      Boardx.Util.Msg.info(t('pages.authPageJoin.passwordCheck'));
      return;
    }else {
      setResetPasswordBtnLoading(true);
      data = { newPassword: newPassword };
      await saveUserProfile(data);
      Boardx.Util.Msg.info(t('pages.authPageJoin.passwordChange'));
      valueRefNewPassword.current.value = '';
      valueRefConfirmPassword.current.value = '';
      setResetPasswordBtnLoading(false);
    }
  };

  return (
    <Box>
      {/* <Box sx={{ marginBottom: '20px' }}>
        <Typography sx={{    marginBottom: '16px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '133.4%'}} variant="h6">
          {t('components.userProfileAndSettingsPage.language')}
        </Typography>
        <Select
          sx={{ width: '450px' }}
          id="language-select"
          onChange={handleChangeLanguageSelect}
          value={currentLanguage}
          classes={{
            select: classes.select,
            icon: classes.selecIcon
          }}
          IconComponent={ExpandMoreIcon}
        >
          {languageData && languageData.length > 0
            ? languageData.map((item, index) => {
                return (
                  <MenuItem key={index} value={item}>
                    {item}
                  </MenuItem>
                );
              })
            : null}
        </Select>
      </Box> */}

      <Box>
        <Typography sx={{    marginBottom: '16px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '133.4%'}} variant="h6">
          {t('components.userProfileAndSettingsPage.password')}
        </Typography>
        <Box sx={{   display: 'flex',
    flexDirection: 'column'}}>
          <FormControl sx={{ width: '450px' }} variant="outlined" fullWidth>
            <InputLabel style={{ backgroundColor: '#FFFFFF' }}>
              {t('pages.resetPasswordPage.newPassword')}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showNewPassword ? 'text' : 'password'}
              inputRef={valueRefNewPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowNewPassword(!showNewPassword)}
                    onMouseDown={event => event.preventDefault()}
                    edge="end"
                  >
                    {showNewPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>

          <FormControl
            sx={{ width: '450px', mt: '12px' }}
            variant="outlined"
            fullWidth
          >
            <InputLabel style={{ backgroundColor: '#FFFFFF' }}>
              {t('pages.resetPasswordPage.confirmPassword')}
            </InputLabel>
            <OutlinedInput
              id="outlined-adornment-password"
              type={showConfirmPassword ? 'text' : 'password'}
              inputRef={valueRefConfirmPassword}
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseDown={event => event.preventDefault()}
                    edge="end"
                  >
                    {showConfirmPassword ? <VisibilityOff /> : <Visibility />}
                  </IconButton>
                </InputAdornment>
              }
              label="Password"
            />
          </FormControl>
          <Box>
            <LoadingButton
              loading={resetPasswordBtnLoading}
              onClick={handleClickResetPassword}
              sx={{  fontWeight: 500,
                fontSize: '14px',
                lineHeight: '24px',
                letterSpacing: '0.4px',
                textTransform: 'uppercase',
                padding: '7px 22px',
                marginTop: '80px'}}
              variant="contained"
            >
              {t('components.userProfileAndSettingsPage.saveChanges')}
            </LoadingButton>
          </Box>
        </Box>
      </Box>
    </Box>
  );
}

export default UserSettings;
