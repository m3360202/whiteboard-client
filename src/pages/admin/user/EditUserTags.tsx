//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import { useGetUserTagsQuery } from '../../../redux/UserAPISlice';

//** Import Mui
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Dialog from '@mui/material/Dialog';
import Chip from '@mui/material/Chip';
import clsx from 'clsx';
import server from '../../../startup/serverConnect';

const PREFIX = 'EditUserTags';

const classes = {
  paperDialog: `${PREFIX}-paperDialog`,
  dialogTitleRoot: `${PREFIX}-dialogTitleRoot`,
  titleText: `${PREFIX}-titleText`,
  chipLabel: `${PREFIX}-chipLabel`,
  chipLabelSelected: `${PREFIX}-chipLabelSelected`,
  chipRoot: `${PREFIX}-chipRoot`,
  chipRootSelected: `${PREFIX}-chipRootSelected`,
  btnBox: `${PREFIX}-btnBox`,
  buttonPublicStyle: `${PREFIX}-buttonPublicStyle`,
  removeBtn: `${PREFIX}-removeBtn`
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.paperDialog}`]: {
    background: '#FFFFFF',
    boxShadow: '0px 2px 10px rgba(58, 53, 65, 0.1)',
    borderRadius: '6px',
    width: '460px',
    height: '540px',
    padding: '40px 24px 20px',
    position: 'relative'
  },

  [`& .${classes.dialogTitleRoot}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '24px',
    lineHeight: '133.4%',
    textAlign: 'center',
    color: 'rgba(58, 53, 65, 0.87)',
    padding: 0,
    marginBottom: '8px'
  },

  [`& .${classes.titleText}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 600,
    fontSize: '16px',
    lineHeight: '24px',
    letterSpacing: '0.15px',
    color: 'rgba(58, 53, 65, 0.87)',
    marginBottom: '10px'
  },

  [`& .${classes.chipLabel}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '13px',
    lineHeight: '18px',
    letterSpacing: '0.16px',
    color: 'rgba(58, 53, 65, 0.87)'
  },

  [`& .${classes.chipLabelSelected}`]: {
    color: '#FFFFFF'
  },

  [`& .${classes.chipRoot}`]: {
    padding: '3px 10px',
    background: 'rgba(58, 53, 65, 0.08)',
    borderRadius: '16px',
    height: '24px',
    margin: '0px 16px 12px 0px',
    cursor: 'pointer'
  },

  [`& .${classes.chipRootSelected}`]: {
    background: '#4D5056'
  },

  [`& .${classes.btnBox}`]: {
    display: 'flex',
    position: 'absolute',
    bottom: '24px',
    right: '24px'
  },

  [`& .${classes.buttonPublicStyle}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.46px',
    textTransform: 'capitalize',
    color: '#F21D6B',
    background: 'none !important',
    marginRight: '16px'
  },

  [`& .${classes.removeBtn}`]: {
    color: '#FF4C51'
  }
}));

function EditUserTags(props) {

  const {
    openEditTagsUserPopper,
    setOpenEditTagsUserPopper,
    selectionUsers,
    userList,
    setUserList
  } = props;
  const { t } = useTranslation();
  const [currentSelectedTags, setCurrentSelectedTags] = useState([]);
  const { data: userTags = [] } = useGetUserTagsQuery(undefined);
  const handleCloseEditTagDialog = () => {
    setOpenEditTagsUserPopper(false);
    setCurrentSelectedTags([]);
  };

  const handleSelectTag = tag => {
    if (currentSelectedTags.some(t => t._id === tag._id)) {
      setCurrentSelectedTags(
        currentSelectedTags.filter(item => item._id !== tag._id)
      );
    } else {
      setCurrentSelectedTags([...currentSelectedTags, tag]);
    }
  };

  // 替换
  const handleClickReplaceUserTags = () => {
    if (selectionUsers.length > 0 && currentSelectedTags.length > 0) {
      handleCloseEditTagDialog();
      server.call( 'editUserTags',
      selectionUsers,
      currentSelectedTags,
      'replace').then(res => {
        let newUserList = [];
            let newtags = [];
            currentSelectedTags.forEach(tag => newtags.push(tag.tagName));
            userList.forEach(user => {
              if (selectionUsers.some(u => u._id === user._id)) {
                user = { ...user, tags: newtags };
              }
              newUserList.push(user);
            });
            setUserList(newUserList);
            Boardx.Util.Msg.success(t('adminPage.updateSuccessfully'));
      }).catch(err => {
        Boardx.Util.Msg.info(err.message);
      });

    } else {
      Boardx.Util.Msg.warning(t('adminPage.pleaseSelectUsersAndTags'));
    }
  };

  // 追加
  const handleClickAppendUserTags = () => {
    if (selectionUsers.length > 0 && currentSelectedTags.length > 0) {
      handleCloseEditTagDialog();
      server.call('editUserTags',
      selectionUsers,
      currentSelectedTags,
      'append').then(res => {
        let newUserList = [];
            let newtags = [];
            currentSelectedTags.forEach(tag => newtags.push(tag.tagName));
            userList.forEach(user => {
              if (selectionUsers.some(u => u._id === user._id)) {
                // 去掉重复的tag
                let userTags = user.tags || [];
                let tags:any = new Set([...userTags, ...newtags]);
                user = {
                  ...user,
                  tags: [...tags]
                };
              }
              newUserList.push(user);
            });
            setUserList(newUserList);
            Boardx.Util.Msg.success(t('adminPage.addSuccessfully'));
      }).catch(err => {
        Boardx.Util.Msg.info(err.message);
      });
    } else {
      Boardx.Util.Msg.warning(t('adminPage.pleaseSelectUsersAndTags'));
    }
  };

  // 判断当前选择的tag在用户中是否存在
  const checkUserSelectTags = (userExistingTags, currentSelectedTagsName) => {
    for (let i = 0; i < currentSelectedTagsName.length; i++) {
      if (userExistingTags.includes(currentSelectedTagsName[i])) {
        return true;
      }
    }
    return false;
  };

  // 在选择的用户中删除当前选择的tags, 并返回新的用户tags
  const removeUsersInCurrentSelectTags = (userTags, selectTags) => {
    for (let i = 0; i < selectTags.length; i++) {
      const index = userTags.indexOf(selectTags[i]);
      if (index !== -1) {
        userTags.splice(index, 1);
      }
    }

    return userTags;
  }

  const handleClickRemoveUserTags = () => {
    let userExistingTags = [];
    let currentSelectedTagsName = [];
    selectionUsers.forEach(user => {
      if (user.tags && user.tags.length > 0) {
        userExistingTags = [...userExistingTags, ...user.tags];
      }
    });
    currentSelectedTags.forEach(tag =>
      currentSelectedTagsName.push(tag.tagName)
    );

    if (currentSelectedTagsName && currentSelectedTagsName.length === 0) {
      Boardx.Util.Msg.warning(t('adminPage.pleaseSelectTags'));
      return;
    }

    // const isExisting = checkUserSelectTags(
    //   userExistingTags,
    //   currentSelectedTagsName
    // );
    // if (!isExisting) {
    //   Boardx.Util.Msg.warning(
    //     'Please select tags that are already in the user'
    //   );
    //   return;
    // }

    handleCloseEditTagDialog();
    server.call('editUserTags',
    selectionUsers,
    currentSelectedTags,
    'remove').then(res => {
      let newUserList = [];
      let newtags = [];
      currentSelectedTags.forEach(tag => newtags.push(tag.tagName));
      userList.forEach(user => {
        if (selectionUsers.some(u => u._id === user._id)) {
          let tags = removeUsersInCurrentSelectTags(user.tags, newtags);
          user = { ...user, tags: tags };
        }
        newUserList.push(user);
      });
      setUserList(newUserList);
      Boardx.Util.Msg.success(t('adminPage.updateSuccessfully'));
    }).catch(err => {
      Boardx.Util.Msg.info(err.message);
    });

  };

  return (
    <StyledDialog
      open={openEditTagsUserPopper}
      onClose={handleCloseEditTagDialog}
      classes={{ paper: classes.paperDialog }}
    >
      <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
        Edit Tags
      </DialogTitle>
      <Box>
        <Typography className={classes.titleText}>All Tags</Typography>
        <Box>
          {userTags?.map((tag, index) => (
            <Chip
              classes={{
                root: clsx(
                  classes.chipRoot,
                  currentSelectedTags.some(t => t._id === tag._id)
                    ? classes.chipRootSelected
                    : ''
                ),
                label: clsx(
                  classes.chipLabel,
                  currentSelectedTags.some(t => t._id === tag._id)
                    ? classes.chipLabelSelected
                    : ''
                )
              }}
              label={tag.tagName}
              key={tag._id}
              onClick={() => handleSelectTag(tag)}
            />
          ))}
        </Box>
      </Box>
      <Box className={classes.btnBox}>
        <Button
          onClick={handleClickReplaceUserTags}
          variant="text"
          className={classes.buttonPublicStyle}
        >
          Replace
        </Button>
        <Button
          onClick={handleClickAppendUserTags}
          variant="text"
          className={classes.buttonPublicStyle}
        >
          Append
        </Button>
        <Button
          onClick={handleClickRemoveUserTags}
          variant="text"
          className={clsx(classes.buttonPublicStyle, classes.removeBtn)}
        >
          Remove
        </Button>
      </Box>
    </StyledDialog>
  );
}

export default EditUserTags;
