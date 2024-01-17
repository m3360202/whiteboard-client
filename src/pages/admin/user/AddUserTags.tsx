//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import {
  useAddUserTagsMutation,
  useGetUserTagsQuery
} from '../../../redux/UserAPISlice';

//** Import Mui
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import DialogTitle from '@mui/material/DialogTitle';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import UserPhoto from '../../../mui/icons/UserPhoto';
import Chip from '@mui/material/Chip';
import UserManagementAddTagsIcon from '../../../mui/icons/UserManagementAddTagsIcon';
import UserManagementManageTagsIcon from '../../../mui/icons/UserManagementManageTagsIcon'

import store from '../../../store';
import server from '../../../startup/serverConnect';

const PREFIX = 'AddUserTags';

const classes = {
  menuPaper: `${PREFIX}-menuPaper`,
  textFieldRoot: `${PREFIX}-textFieldRoot`,
  paperDialog: `${PREFIX}-paperDialog`,
  dialogTitleRoot: `${PREFIX}-dialogTitleRoot`,
  titleText: `${PREFIX}-titleText`,
  inviteInput: `${PREFIX}-inviteInput`,
  inviteUserInputBox: `${PREFIX}-inviteUserInputBox`,
  sizeMedium: `${PREFIX}-sizeMedium`,
  chipLabel: `${PREFIX}-chipLabel`,
  chipIconMedium: `${PREFIX}-chipIconMedium`,
  btnBox: `${PREFIX}-btnBox`,
  cancelBtn: `${PREFIX}-cancelBtn`,
  saveBtn: `${PREFIX}-saveBtn`,
  addUsersBtn: `${PREFIX}-addUsersBtn`,
  menuItemGutters: `${PREFIX}-menuItemGutters`
};

// TODO jss-to-styled codemod: The Fragment root was replaced by div. Change the tag if needed.
const StyledMenu = styled(Menu)(({ theme }) => ({
  [`& .${classes.menuPaper}`]: {
    background: '#F4F5FA',
    boxShadow:
      '0px 5px 5px -3px rgba(58, 53, 65, 0.2), 0px 8px 10px 1px rgba(58, 53, 65, 0.14), 0px 3px 14px 2px rgba(58, 53, 65, 0.12)',
    borderRadius: '6px'
  },

  [`& .${classes.menuItemGutters}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 400,
    fontSize: '14px',
    lineHeight: '20px',
    letterSpacing: '0.15px',
    color: 'rgba(58, 53, 65, 0.87)',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.04) !important'
    }
  }
}));

const StyledDialog = styled(Dialog)(({ theme }) => ({
  [`& .${classes.textFieldRoot}`]: {
    '& .MuiInputBase-input': {
      padding: '9px 17px'
    },
    '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
      borderColor: '#F21D6B'
    }
  },

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

  [`& .${classes.inviteInput}`]: {
    flex: 1,
    height: '38px',
    margin: 0,
    overflow: 'hidden',
    minWidth: '200px',
    '& .MuiInputBase-fullWidth': {
      width: '115%'
    },
    '& .MuiInputBase-input': {
      width: '100%',
      height: '38px',
      padding: '3px 3px 3px 12px',
      boxSizing: 'border-box'
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0
    }
  },

  [`& .${classes.inviteUserInputBox}`]: {
    width: '100%',
    height: 'auto',
    border: '1px solid rgba(0, 0, 0, 0.16)',
    borderRadius: '2px',
    display: 'flex',
    flexWrap: 'wrap',
    maxHeight: '80px',
    overflowY: 'scroll'
  },

  [`& .${classes.sizeMedium}`]: {
    margin: '6px 0px 0px 6px',
    height: '24px'
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

  [`& .${classes.chipIconMedium}`]: {
    width: '14px',
    height: '14px'
  },

  [`& .${classes.btnBox}`]: {
    display: 'flex',
    justifyContent: 'flex-end',
    position: 'absolute',
    bottom: '20px',
    right: '24px'
  },

  [`& .${classes.cancelBtn}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.46px',
    textTransform: 'capitalize',
    color: '#8A8D93',
    border: '1px solid rgba(138, 141, 147, 0.5) !important',
    borderRadius: '5px'
  },

  [`& .${classes.saveBtn}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.46px',
    textTransform: 'capitalize',
    color: '#FFFFFF',
    boxShadow: '0px 4px 8px -4px rgba(58, 53, 65, 0.42)',
    borderRadius: '5px',
    background: '#F21D6B !important',
    marginLeft: '16px'
  },

  [`& .${classes.addUsersBtn}`]: {
    fontFamily: 'Inter',
    fontStyle: 'normal',
    fontWeight: 500,
    fontSize: '13px',
    lineHeight: '22px',
    letterSpacing: '0.46px',
    textTransform: 'capitalize',
    color: '#F21D6B',
    padding: '0px'
  }
}));

function AddUserTags(props) {

  const { t } = useTranslation();
  const { openTagsUserPopper, setOpenTagsUserPopper } = props;
  const [openAddNewTag, setOpenAddNewTag] = useState(false);
  const [userList, setUserList] = useState(null);
  const [isSearch, setIsSearch] = useState(false);
  const [currentSelectUser, setCurrentSelectUser] = useState([]);
  const [data, setData] = useState({
    filter: null,
    start: 0,
    limit: 0
  });
  const userNameRef:any = useRef('');
  const tagNameRef:any = useRef('');

  const [addUserTags] = useAddUserTagsMutation();
  const { data: userTags = [] } = useGetUserTagsQuery(undefined);

  const handleClickOpenAddNewTag = () => {
    setOpenAddNewTag(true);
    setOpenTagsUserPopper(false);
  };

  const handleSearch = e => {
    const keyword = e.target.value;
    let newData = { ...data, filter: keyword };
    setData(newData);
  };

  useEffect(() => {
    handleGetUserList(data);
  }, [data]);

  const handleGetUserList = async data => {
    server.call('getUserList', data).then(res => {
      let list = [];
      res.map(t => {
        t.id = t._id;
        t.email = t.emails[0].address;
        t.avatar = t.head_url ? t.head_url : null;
        list.push(t);
      });
      setUserList(list);
    }).catch(err => {
      Boardx.Util.Msg.info(err.reason);
    });

  };

  const handleAddUser = user => {
    setCurrentSelectUser([...currentSelectUser, user]);
    setUserList(userList.filter(item => item.id !== user.id));
  };

  const handleDelete = user => {
    setCurrentSelectUser(currentSelectUser.filter(item => item.id !== user.id));
    setUserList([...userList, user]);
  };

  const handleCloseAddNewTagDialog = () => {
    setOpenAddNewTag(!openAddNewTag);
    setIsSearch(false);
    setUserList([]);
    setCurrentSelectUser([]);
    setData({
      filter: null,
      start: 0,
      limit: 0
    });
  };

  const handleClickSave = async () => {
    const tagName = tagNameRef.current.value.trim();
    if (tagName === '') {
      return Boardx.Util.Msg.info(t('adminPage.tagNameIsRequired'));
    }

    let existingTags = [];
    userTags.map(item => {
      existingTags.push(item.tagName);
    });
    if (existingTags.includes(tagName)) {
      return Boardx.Util.Msg.warning(t('adminPage.tagAlreadyExists'));
    }

    if (currentSelectUser.length === 0) {
      return Boardx.Util.Msg.warning(t('adminPage.userToAddToTheTag'));
    }

    const data = {
      users: currentSelectUser,
      createUserId: store.getState().user.userInfo.userId,
      createUserName: store.getState().user.userInfo.userName,
      createTime: new Date().getTime(),
      tagName: tagName
    };
    server.call('updateUserProfileTags',
    currentSelectUser,
    tagName).then(async res => {
      Boardx.Util.Msg.info(t('adminPage.updateUserTagSuccess'));
          await addUserTags(data);
          Boardx.Util.Msg.info(t('adminPage.addUserTagSuccess'));
          handleCloseAddNewTagDialog();
    }).catch(err => {
      Boardx.Util.Msg.info(err.reason);
    });

  };

  return (
    <Box>
      <StyledMenu
        open={openTagsUserPopper}
        anchorEl={document.getElementById('tagsUserBtn')}
        onClose={() => setOpenTagsUserPopper(!openTagsUserPopper)}
        classes={{ paper: classes.menuPaper }}
      >
        <MenuItem
          classes={{ gutters: classes.menuItemGutters }}
          onClick={handleClickOpenAddNewTag}
        >
          <UserManagementAddTagsIcon />
          Add new tag
        </MenuItem>
        <MenuItem classes={{ gutters: classes.menuItemGutters }}>
          <UserManagementManageTagsIcon />
          Manage tags
        </MenuItem>
      </StyledMenu>

      <StyledDialog
        open={openAddNewTag}
        onClose={handleCloseAddNewTagDialog}
        classes={{ paper: classes.paperDialog }}
      >
        <DialogTitle classes={{ root: classes.dialogTitleRoot }}>
          Add New Tag
        </DialogTitle>
        <Box>
          <Box>
            <Typography className={classes.titleText}>Tag Name</Typography>
            <TextField
              classes={{ root: classes.textFieldRoot }}
              fullWidth
              id="name"
              placeholder="name"
              type="text"
              variant="outlined"
              inputRef={tagNameRef}
            />
          </Box>
          <Box sx={{ mt: '16px' }}>
            <Typography className={classes.titleText}>Users</Typography>
            {isSearch ? (
              <Box className={classes.inviteUserInputBox}>
                {currentSelectUser?.map(user => (
                  <Chip
                    icon={
                      <UserPhoto style={{ width: '14px', height: '14px' }} />
                    }
                    classes={{
                      sizeMedium: classes.sizeMedium,
                      label: classes.chipLabel,
                      iconMedium: classes.chipIconMedium
                    }}
                    key={user._id}
                    label={user.name}
                    onDelete={handleDelete.bind(this, user)}
                  />
                ))}
                <TextField
                  autoFocus
                  defaultValue={data?.filter}
                  fullWidth
                  id="fullname"
                  classes={{ root: classes.textFieldRoot }}
                  className={classes.inviteInput}
                  inputRef={userNameRef}
                  placeholder="Search"
                  variant="outlined"
                  type="text"
                  onKeyDown={handleSearch}
                />
              </Box>
            ) : (
              <Button
                onClick={() => setIsSearch(!isSearch)}
                className={classes.addUsersBtn}
                variant="text"
              >
                Add Users
              </Button>
            )}
          </Box>
          <Box sx={{ mt: '10px' }}>
            <Divider />
            <Box
              sx={{
                background: '#F9FAFC',
                maxHeight: '200px',
                overflowY: 'scroll'
              }}
            >
              {userList?.slice(0, 20).map(item => (
                <MenuItem key={item.id} onClick={() => handleAddUser(item)}>
                  <UserPhoto />
                  <Typography>{item.name}</Typography>
                </MenuItem>
              ))}
            </Box>
          </Box>
          <Box className={classes.btnBox}>
            <Button
              variant="outlined"
              className={classes.cancelBtn}
              onClick={handleCloseAddNewTagDialog}
            >
              Cancel
            </Button>
            <Button
              onClick={handleClickSave}
              variant="contained"
              className={classes.saveBtn}
            >
              Save
            </Button>
          </Box>
        </Box>
      </StyledDialog>
    </Box>
  );
}

export default AddUserTags;
