//** Import react
import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import { useState, useRef } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleUpdataAvatar } from '../../../store/user';
import {
  useUpdateUserAvatarToAwsMutation,
  useUpdateUserAccountMutation,
  useGetUserInfoQuery,
  useCalculationUserXPValueQuery
} from '../../../redux/UserAPISlice';

import Box from '@mui/material/Box';
import Avatar from '@mui/material/Avatar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Autocomplete from '@mui/material/Autocomplete';
import Stack from '@mui/material/Stack';
import LoadingButton from '@mui/lab/LoadingButton';
import Select, { SelectChangeEvent } from '@mui/material/Select';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import Chip from '@mui/material/Chip';
import MenuList from '@mui/material/MenuList';

import UserProfilePhotoUploadButton from './UserProfilePhotoUploadButton';

//**Import Services
import { FileService, UtilityService } from '../../../services';
import $ from 'jquery';

const PREFIX = 'UserAccount';

const classes = {
  avatar: `${PREFIX}-avatar`,
  userInfoBox: `${PREFIX}-userInfoBox`,
  userNameText: `${PREFIX}-userNameText`,
  XPBox: `${PREFIX}-XPBox`,
  useRegisterTime: `${PREFIX}-useRegisterTime`,
  changeAuatarBtn: `${PREFIX}-changeAuatarBtn`,
  categoryText: `${PREFIX}-categoryText`,
  textFieldBox: `${PREFIX}-textFieldBox`,
  textFieldBox2: `${PREFIX}-textFieldBox2`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  textFieldRoot2: `${PREFIX}-textFieldRoot2`,
  saveBtn: `${PREFIX}-saveBtn`,
  selecIcon: `${PREFIX}-selecIcon`,
  select: `${PREFIX}-select`,
  selectMenuItemRoot: `${PREFIX}-selectMenuItemRoot`,
  autocompleteIcon: `${PREFIX}-autocompleteIcon`,
  chipRoot: `${PREFIX}-chipRoot`,
  autocompleteClearIcon: `${PREFIX}-autocompleteClearIcon`,
  autocompletePopper: `${PREFIX}-autocompletePopper`
};

const StyledBox = styled(Box)((
  { theme }
) => ({
  [`& .${classes.avatar}`]: {
    width: '116px',
    height: '116px',
    marginRight: '24px'
  },

  [`& .${classes.userInfoBox}`]: {
    display: 'flex',
    alignItems: 'center',
    cursor: 'text',
    marginBottom: '3px'
  },

  [`& .${classes.userNameText}`]: {
    color: 'rgba(58, 53, 65, 0.87)',
    textAlign: 'center',
    letterSpacing: '0.15px',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '133.4%',
    fontFamily: 'Roboto',
    marginRight: '12px'
  },

  [`& .${classes.XPBox}`]: {
    letterSpacing: '0.16px',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '18px',
    color: '#FFB400',
    padding: '3px 10px',
    background:
      'linear-gradient(0deg, rgba(255, 255, 255, 0.88), rgba(255, 255, 255, 0.88)), #ED6C02',
    borderRadius: '4px'
  },

  [`& .${classes.useRegisterTime}`]: {
    fontWeight: 400,
    fontSize: '12px',
    lineHeight: '143%',
    color: 'rgba(58, 53, 65, 0.38)',
    letterSpacing: '0.15px',
    marginBottom: '16px'
  },

  [`& .${classes.changeAuatarBtn}`]: {
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px',
    letterSpacing: '0.4px',
    padding: 0
  },

  [`& .${classes.categoryText}`]: {
    marginBottom: '16px',
    fontFamily: 'Roboto',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '20px',
    lineHeight: '133.4%'
  },

  [`& .${classes.textFieldBox}`]: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: '16px'
  },

  [`& .${classes.textFieldBox2}`]: {
    display: 'flex',
    marginBottom: '16px',
    flexDirection: 'column',
    width: '49%'
  },

  [`& .${classes.textFieldRoot}`]: {
    width: '49%'
  },

  [`& .${classes.textFieldRoot2}`]: {
    marginTop: '16px',
    marginBottom: '16px'
  },

  [`& .${classes.saveBtn}`]: {
    padding: '7px 22px',
    letterSpacing: '0.4px',
    textTransform: 'uppercase',
    fontWeight: 500,
    fontSize: '14px',
    lineHeight: '24px'
  },

  [`& .${classes.selecIcon}`]: {
    color: '#150D33',
    right: '16px'
  },

  [`& .${classes.select}`]: {
    padding: '15px 17px',
    borderRadius: '6px',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    color: 'rgba(58, 53, 65, 0.87)',
  },

  [`& .${classes.selectMenuItemRoot}`]: {
    color: 'rgba(58, 53, 65, 0.87)',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    padding: '9px 16px'
  },

  [`& .${classes.autocompleteIcon}`]: {
    top: 'calc(50% - 22px)'
  },

  [`& .${classes.chipRoot}`]: {
    background: 'rgba(0, 0, 0, 0.08)',
    border: '1px solid rgba(0, 0, 0, 0.08)'
  },

  [`& .${classes.autocompleteClearIcon}`]: {
    display: 'none'
  },

  [`& .${classes.autocompletePopper}`]: {
    border: '1px solid rgba(58, 53, 65, 0.23)',
    borderRadius: '6px'
  }
}));

function UserAccount() {

  const { t } = useTranslation();
  const valueRefUserName: any = useRef('');
  const valueRefName: any = useRef('');
  const valueRefEmail: any = useRef('');
  const valueRefPhone: any = useRef('');
  const valueRefCity: any = useRef('');
  const valueRefZipCode: any = useRef('');
  const valueRefState: any = useRef('');
  const valueRefCountry: any = useRef('');
  const valueRefOrganization: any = useRef('');

  const [userName, setUserName] = useState('');
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [city, setCity] = useState('');
  const [zipCode, setZipCode] = useState('');
  const [state, setState] = useState('');
  const [country, setCountry] = useState('');
  const [createdAt, setCreateAt] = useState('');
  const [organization, setOrganization] = useState('');
  const [interests, setInterests] = useState([]);
  const [skillLevel, setSkillLevel] = useState('');
  const [occupation, setOccupation] = useState('');

  const occupationData = [
    'Accounting',
    'Administrative',
    'Arts & Design',
    'Business Development',
    'Community & Social Services',
    'Consulting',
    'Customer Success & Support',
    'Education',
    'Engineering',
    'Entrepreneur/Founder',
    'Finance',
    'Healthcare Services',
    'Human Resources',
    'Information Technology',
    'Legal',
    'Marketing',
    'Media & Communication',
    'Operations',
    'Product Management',
    'Program & Project Management',
    'Purchasing',
    'Quality Assurance',
    'Real Estate',
    'Research',
    'Sales',
    'Other'
  ];

  const interestsData = [
    'Design',
    'Marketing',
    'Research',
    'Product Management',
    'Development',
    'Consultation & Strategy',
    'Education',
    'Other'
  ];
  const skillLevelData = ['Novice', 'Intermediate', 'Expert'];

  const [saveBtnLoading, setSaveBtnLoading] = useState(false);

  const { data: userInfo = [] } = useGetUserInfoQuery({
    userId: store.getState().user.userInfo.userId
  });

  const { data: xpValue = 0 } = useCalculationUserXPValueQuery({
    userId: store.getState().user.userInfo.userId
  });
  const [updateUserAvatarToAws] = useUpdateUserAvatarToAwsMutation();
  const [updateUserAccount] = useUpdateUserAccountMutation();

  const orgInfo = useSelector((state: RootState) => state.org.orgInfo);

  // 格式化时间
  const formattedDate = date => {
    const newDate = new Date(date);
    const formattedDate = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(newDate);
    return formattedDate;
  };

  useEffect(() => {
    setUserName((userInfo as any).username);
    setName(
      (userInfo as any).nickName
        ? (userInfo as any).nickName
        : (userInfo as any).name
    );
    setEmail(
      (userInfo as any).emails ? (userInfo as any).emails[0].address : ''
    );
    setPhone((userInfo as any).phone ? (userInfo as any).phone : '');
    setCity((userInfo as any).city ? (userInfo as any).city : '');
    setZipCode((userInfo as any).zipCode ? (userInfo as any).zipCode : '');
    setState((userInfo as any).state ? (userInfo as any).state : '');
    setCountry((userInfo as any).country ? (userInfo as any).country : '');
    setCreateAt(
      (userInfo as any).createdAt
        ? formattedDate((userInfo as any).createdAt)
        : formattedDate(new Date())
    );
    setOccupation(
      (userInfo as any).occupation ? (userInfo as any).occupation : ''
    );
    setOrganization(
      (userInfo as any).organization ? (userInfo as any).organization : ''
    );
    setInterests(
      (userInfo as any).interests ? (userInfo as any).interests : []
    );
    setSkillLevel(
      (userInfo as any).skillLevel ? (userInfo as any).skillLevel : ''
    );
  }, [userInfo]);

  const handleUpdateUserInfo = async () => {
    if (
      valueRefUserName.current.value === (userInfo as any).userName &&
      valueRefName.current.value === (userInfo as any).name &&
      valueRefEmail.current.value === (userInfo as any).email &&
      valueRefPhone.current.value === (userInfo as any).phone &&
      valueRefCity.current.value === (userInfo as any).city &&
      valueRefZipCode.current.value === (userInfo as any).zipCode &&
      valueRefState.current.value === (userInfo as any).state &&
      valueRefCountry.current.value === (userInfo as any).country &&
      valueRefOrganization.current.value === (userInfo as any).organization &&
      interests.length === (userInfo as any).interests.length &&
      interests.some(
        (elem, index) => elem !== (userInfo as any).interests[index]
      ) &&
      skillLevel === (userInfo as any).skillLevel
    ) {
      Boardx.Util.Msg.info(t('pages.authPageJoin.noChange'));
      return;
    }

    setSaveBtnLoading(true);
    const newUserInfo = {
      userName: valueRefUserName.current.value,
      nickName: valueRefName.current.value,
      email: valueRefEmail.current.value,
      phone: valueRefPhone.current.value,
      city: valueRefCity.current.value,
      zipCode: valueRefZipCode.current.value,
      state: valueRefState.current.value,
      country: valueRefCountry.current.value,
      occupation: occupation,
      organization: valueRefOrganization.current.value,
      interests: interests,
      skillLevel: skillLevel
    };

    await updateUserAccount({ userId: store.getState().user.userInfo.userId, data: newUserInfo });
    Boardx.Util.Msg.success(t('pages.authPageJoin.updateSuccess'));
    setSaveBtnLoading(false);
  };

  const handleUserChangeProfilePhoto = async file => {
    Boardx.Util.Msg.info(t('pages.authPageJoin.avatarUpdating'));
    // deal target file
    const bodyFormData = new FormData();
    bodyFormData.append('image', file);
    const avatarImage = $($('#avatar-img').find('img')[0]);
    const r2UploadPath =
      UtilityService.getInstance().getr2UploadPathByOrg(orgInfo);
    const key:any = await FileService.getInstance().uploadAvatarToR2(
      r2UploadPath,
      file,
      {
        progress(ee) {}
      }
    );

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

  const handleUpdateUserAvatarToAws = async key => {
    await updateUserAvatarToAws(key);
  };

  const handleChangeInterestsSelect = e => {
    let newInterests = [];
    if (interests.includes(e.target.innerText)) {
      newInterests = interests.filter(item => item !== e.target.innerText);
    } else {
      newInterests = [...interests, e.target.innerText];
    }
    setInterests(newInterests);
  };

  const handleDeleteCurrentInterests = deleteInterests => {
    let newInterests = interests.filter(item => item !== deleteInterests);
    setInterests(newInterests);
  };

  return (
    <StyledBox>
      {/* 头像 */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: '34px' }}>
        <Box>
          <Avatar
            aria-label="user"
            id="avatarMenu"
            {...Boardx.Util.stringAvatar((userInfo as any).nickName)}
            alt={
              (userInfo as any).avatarType === 'data'
                ? (userInfo as any).nickName
                : (userInfo as any).nickName?.toUpperCase()
            }
            className={classes.avatar}
            src={(userInfo as any).head_url}
          />
        </Box>
        <Box>
          <Box className={classes.userInfoBox}>
            <Typography variant="body1" className={classes.userNameText}>
              {name}
            </Typography>
            <Box className={classes.XPBox}>
              XP: {xpValue.toLocaleString('en-US')}
            </Box>
          </Box>
          <Typography className={classes.useRegisterTime}>
            {t('components.userProfileAndSettingsPage.memberSince')}
            {createdAt}
          </Typography>
          <UserProfilePhotoUploadButton
            onChange={handleUserChangeProfilePhoto}
          />
        </Box>
      </Box>
      {/* 个人信息 */}
      <Box>
        {/* Contact info */}
        <Box>
          <Typography className={classes.categoryText} variant="h6">
            {t('components.userProfileAndSettingsPage.contactInfo')}
          </Typography>
          <Box className={classes.textFieldBox}>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              inputRef={valueRefUserName}
              value={userName}
              id="userName"
              label={t('components.userProfileAndSettingsPage.username')}
              placeholder={t('components.userProfileAndSettingsPage.username')}
              type="text"
              variant="outlined"
              disabled
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              classes={{ root: classes.textFieldRoot }}
              value={name}
              inputRef={valueRefName}
              id="name"
              label={t('components.userProfileAndSettingsPage.name')}
              placeholder={t('components.userProfileAndSettingsPage.name')}
              type="text"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
              onChange={() => setName(valueRefName.current.value)}
            />
          </Box>
          <Box className={classes.textFieldBox}>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              value={email}
              inputRef={valueRefEmail}
              id="email"
              label={t('components.userProfileAndSettingsPage.email')}
              placeholder={t('components.userProfileAndSettingsPage.email')}
              type="text"
              variant="outlined"
              disabled
              InputLabelProps={{
                shrink: true
              }}
            />
            <TextField
              classes={{ root: classes.textFieldRoot }}
              value={phone}
              inputRef={valueRefPhone}
              id="phone"
              label={t('components.userProfileAndSettingsPage.phone')}
              type="text"
              variant="outlined"
              InputLabelProps={{
                shrink: true
              }}
              onChange={() => setPhone(valueRefPhone.current.value)}
            />
          </Box>
          <Box className={classes.textFieldBox}>
            <Box className={classes.textFieldBox} sx={{ width: '49%' }}>
              <TextField
                classes={{ root: classes.textFieldRoot }}
                value={city}
                inputRef={valueRefCity}
                id="city"
                label={t('components.userProfileAndSettingsPage.city')}
                type="text"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={() => setCity(valueRefCity.current.value)}
              />
              <TextField
                classes={{ root: classes.textFieldRoot }}
                value={zipCode}
                inputRef={valueRefZipCode}
                id="zipCode"
                label={t('components.userProfileAndSettingsPage.zipCode')}
                type="text"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={() => setZipCode(valueRefZipCode.current.value)}
              />
            </Box>

            <Box className={classes.textFieldBox} sx={{ width: '49%' }}>
              <TextField
                classes={{ root: classes.textFieldRoot }}
                value={state}
                inputRef={valueRefState}
                id="state"
                label={t('components.userProfileAndSettingsPage.state')}
                type="text"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={() => setState(valueRefState.current.value)}
              />
              <TextField
                classes={{ root: classes.textFieldRoot }}
                value={country}
                inputRef={valueRefCountry}
                id="country"
                label={t('components.userProfileAndSettingsPage.country')}
                type="text"
                variant="outlined"
                InputLabelProps={{
                  shrink: true
                }}
                onChange={() => setCountry(valueRefCountry.current.value)}
              />
            </Box>
          </Box>
        </Box>
        {/* work education */}
        <Box>
          <Typography className={classes.categoryText} variant="h6">
            {t('components.userProfileAndSettingsPage.work')}
          </Typography>
          <Box className={classes.textFieldBox2}>
            <FormControl>
              <InputLabel
                style={{ background: '#FFFFFF' }}
                shrink
                id="occupation-select-autowidth-label"
              >
                {t('components.userProfileAndSettingsPage.occupation')}
              </InputLabel>
              <Select
                id="occupation"
                labelId="occupation-select-autowidth-label"
                onChange={event => setOccupation(event.target.value)}
                value={occupation}
                classes={{
                  select: classes.select,
                  icon: classes.selecIcon
                }}
                //TODO: MenuProps={MenuProps}
                // MenuProps={MenuProps}
              >
                {occupationData && occupationData.length > 0
                  ? occupationData.map((item, index) => {
                      return (
                        <MenuItem
                          classes={{ root: classes.selectMenuItemRoot }}
                          key={index}
                          value={item}
                        >
                          {item}
                        </MenuItem>
                      );
                    })
                  : null}
              </Select>
            </FormControl>

            <TextField
              classes={{ root: classes.textFieldRoot2 }}
              value={organization}
              inputRef={valueRefOrganization}
              id="organization"
              label={t('components.userProfileAndSettingsPage.organization')}
              type="text"
              variant="outlined"
              onChange={() =>
                setOrganization(valueRefOrganization.current.value)
              }
              InputLabelProps={{
                shrink: true
              }}
            />
          </Box>
        </Box>

        {/* interests skillLevel */}
        <Box>
          <Typography className={classes.categoryText} variant="h6">
            {t('components.userProfileAndSettingsPage.interests')} &{' '}
            {t('components.userProfileAndSettingsPage.skillLevel')}
          </Typography>
          <Box>
            <Stack spacing={3} sx={{ width: '49%' }}>
              <Autocomplete
                multiple
                id="interests"
                onChange={handleChangeInterestsSelect}
                options={interestsData}
                getOptionLabel={option => option}
                value={[...interests]}
                filterSelectedOptions
                renderTags={(value: readonly string[], getTagProps) =>
                  value.map((option: string, index: number) => (
                    <Chip
                      variant="outlined"
                      label={option}
                      {...getTagProps({ index })}
                      classes={{ root: classes.chipRoot }}
                      onDelete={handleDeleteCurrentInterests.bind(this, option)}
                    />
                  ))
                }
                renderInput={params => (
                  <TextField
                    {...params}
                    label={t('components.userProfileAndSettingsPage.interests')}
                    InputLabelProps={{
                      shrink: true
                    }}
                  />
                )}
                classes={{
                  endAdornment: classes.autocompleteIcon,
                  clearIndicator: classes.autocompleteClearIcon,
                  popper: classes.autocompletePopper
                }}
              />
              <FormControl>
                <InputLabel
                  style={{ background: '#FFFFFF' }}
                  shrink
                  id="skillLevel-select-autowidth-label"
                >
                  {t('components.userProfileAndSettingsPage.skillLevel')}
                </InputLabel>
                <Select
                  id="skillLevel-select"
                  labelId="skillLevel-select-autowidth-label"
                  onChange={event => setSkillLevel(event.target.value)}
                  value={skillLevel}
                  classes={{
                    select: classes.select,
                    icon: classes.selecIcon
                  }}
                  label={t('components.userProfileAndSettingsPage.skillLevel')}
                  //TODO: MenuProps={MenuProps}
                  // MenuProps={MenuProps}
                >
                  {skillLevelData && skillLevelData.length > 0
                    ? skillLevelData.map((item, index) => {
                        return (
                          <MenuItem
                            classes={{ root: classes.selectMenuItemRoot }}
                            key={index}
                            value={item}
                          >
                            {item}
                          </MenuItem>
                        );
                      })
                    : null}
                </Select>
              </FormControl>
            </Stack>
          </Box>
        </Box>
      </Box>

      <Box sx={{ mt: '80px' }}>
        <LoadingButton
          loading={saveBtnLoading}
          className={classes.saveBtn}
          variant="contained"
          onClick={handleUpdateUserInfo}
        >
          {t('components.userProfileAndSettingsPage.save')}
        </LoadingButton>
      </Box>
    </StyledBox>
  );
}

const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: 300,
      overflowY: 'scroll'
    }
  }
};

export default UserAccount;
