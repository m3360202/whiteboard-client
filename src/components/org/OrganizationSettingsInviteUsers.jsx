//** Import react
import React, { useEffect, useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import { handleSetOrgMemberList } from '../../store/org';
import {
  useAddOneUserToOrgMutation,
  useSendOrgInvitationRegisterEmailToNonExistingUserMutation,
  useFindOrCreateInviteQuery
} from '../../redux/OrgAPISlice';
import { useCheckActionPermissionOfTeamMutation } from '../../redux/PermissionApiSlice';
//** Import i18n
import { useTranslation } from 'react-i18next';
import i18n from '../../i18n';

//** Import Mui
import Box from '@mui/material/Box';
import Chip from '@mui/material/Chip';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';

//** Import Service
import { ClipboardService, OrgService, UserService } from '../../services';

//** Import components
import { isEmail } from '../../util/isEmail';
import { useCheckIfUserExistsByEmailMutation } from '../../redux/UserAPISlice'

import _ from 'lodash';

const PREFIX = 'OrganizationSettingsInviteUsers';

const classes = {
  inviteUserInputBox: `${PREFIX}-inviteUserInputBox`,
  inviteInput: `${PREFIX}-inviteInput`,
  orgSettingsInviteBtn: `${PREFIX}-orgSettingsInviteBtn`,
  sizeMedium: `${PREFIX}-sizeMedium`,
  invitationLinkBtn: `${PREFIX}-invitationLinkBtn`
};

const StyledBox = styled(Box)((
  {
    theme
  }
) => ({
  [`& .${classes.inviteUserInputBox}`]: {
    [theme.breakpoints.up('sm')]: {
      width: '837px',
    },
    height: 'auto',
    border: '1px solid rgba(0, 0, 0, 0.16)',
    borderRadius: '2px',
    boxSizing: 'border-box',
    display: 'flex',
  },

  [`& .${classes.inviteInput}`]: {
    // width: 'auto',
    flex: 1,
    height: '38px',
    minWidth: '230px',
    margin: 0,
    '& .MuiInputBase-input': {
      width: '100%',
      height: '38px',
      padding: '3px 3px 3px 12px',
      boxSizing: 'border-box',
    },
    '& .MuiOutlinedInput-notchedOutline': {
      border: 0,
    },
  },

  [`& .${classes.orgSettingsInviteBtn}`]: {
    width: '66px',
    height: '40px',
    left: '16px',
    fontSize: '16px',
    fontWeight: 500,
  },

  [`& .${classes.sizeMedium}`]: {
    margin: '2px 0px 0px 6px',
    backgroundColor: '#D3F4F4',
    cursor: 'pointer',
    '&:focus': {
      backgroundColor: '#2BA9A9',
    },
  },

  [`& .${classes.invitationLinkBtn}`]: {
    padding: 0,
    fontSize: '16px',
  }
}));

export default function OrganizationSettingsInviteUsers() {
  //use

  const dispatch = useDispatch();
  const { t } = useTranslation();
  //org
  const orgInfo = useSelector((state) => state.org.orgInfo);

  //hooks
  const [inviteList, setInviteList] = useState([]);
  const [checkIfUserExistsByEmail] = useCheckIfUserExistsByEmailMutation();
  const handleCheckIfUserExistsByEmail = async (email) => {
    return await checkIfUserExistsByEmail(email);
  };
  const [handleCheckActionPermissionOfTeam] = useCheckActionPermissionOfTeamMutation();
  const [addOneUserToOrg] = useAddOneUserToOrgMutation();
  const [sendOrgInvitationRegisterEmailToNonExistingUser] =
    useSendOrgInvitationRegisterEmailToNonExistingUserMutation();

  const { data: inviteInfo } = useFindOrCreateInviteQuery({
    userId: store.getState().user.userInfo.userId,
    invite: {
      rid: '',
      orgId: orgInfo.orgId,
      days: 0,
      maxUses: 0,
      inviteType: 'org'
    }
  });
  // if (error) {
  //   Boardx.Util.Msg.warning(error.message);
  //   return;
  // }
  const checkActionPermission = async (permissionName) => {
    let data = {
      permissionName: permissionName,
      role: orgInfo.role
    }
    return await handleCheckActionPermissionOfTeam(data);
  }

  const handleDelete = (user) => {
    setInviteList(_.without(inviteList, user));
  };

  const onInvitationClick = async () => {
    const copyText = `${inviteInfo.invitationLink}`;
    ClipboardService.getInstance().clipboardCopy(copyText);
    Boardx.Util.Msg.info(
      t('components.connectionNotification.youHaveCopiedInvitationLink'),
    );
  };

  const handleClickInvite = async () => {
    let checkRoleOfManageTeam = await checkActionPermission('Add Member To Team');
    if (checkRoleOfManageTeam && !checkRoleOfManageTeam.data) {
      Boardx.Util.Msg.info(
        t('pages.listPage.roomSettings.addMemberToTeam')
      );
      return;
    }
    const orgId = orgInfo.orgId;
    const orgName = orgInfo.name;

    inviteList.forEach(async (invite) => {
      if (invite.isNew) {
        const { data: result } = await handleCheckIfUserExistsByEmail(invite.name);
        if (result && result._id) {

          addOneUserToOrg({
            orgId: orgId,
            orgName: orgName,
            user: result,
            link: inviteInfo.invitationLink,
            language: i18n.language.slice(0, 2),
            orgInfo: orgInfo
          });
          // Boardx.Util.Msg.info(
          //   t('components.connectionNotification.userAlreadyInOrg')
          // );
        } else {
          sendOrgInvitationRegisterEmailToNonExistingUser({
            orgName: orgInfo.name,
            username: store.getState().user.userInfo.userName,
            inviteUsername: invite.username,
            invitationLink: inviteInfo.invitationLink,
            language: i18n.language.slice(0, 2)
          });
          // Boardx.Util.Msg.info(
          //   `${t('pages.invitationSent')} ${inviteUsername}`
          // );
        }
      }
    });

    if (inviteList.length <= 1) {
      Boardx.Util.Msg.info(
        `${inviteList[0].username} ${t('pages.memberHasBeenAdded')}`,
      );
    } else {
      Boardx.Util.Msg.info(
        `${inviteList.length} ${t('pages.users')} 
        ${t('pages.memberHasBeenAdded')}`,
      );
    }
    setInviteList([]);
  };

  const keyPress = (e) => {
    if (e.keyCode === 188 || e.keyCode === 13) {
      e.preventDefault();
      const text = e.target.value;

      if (text === '') {
        Boardx.Util.Msg.warning(t('pages.pleaseEnterEmailAddress'));
        return;
      } else if (!isEmail(text)) {
        Boardx.Util.Msg.warning(t('pages.invalidEmail'));
        return;
      }

      const newList = _.clone(inviteList);
      if (!newList.includes(text)) {
        newList.push({
          _id: text,
          username: text,
          name: text,
          isNew: true,
        });
        setInviteList(newList);
        e.target.value = '';
      }
    } else if (e.keyCode === 8 && e.target.value === '') {
      setInviteList(_.initial(inviteList));
    }
  };

  const inviteListChipDOM = () =>
    inviteList.map((user) => (
      <Chip
        classes={{ sizeMedium: classes.sizeMedium }}
        key={user._id}
        label={user.username}
        onDelete={handleDelete.bind(this, user)}
      />
    ));

  return (
    <StyledBox>
      <Box
        sx={{
          display: 'flex',
          alignItems: 'flex-end',
          flexGrow: 1,
          mb: '8px'
        }}
      >
        <div className={classes.inviteUserInputBox}>
          {inviteListChipDOM()}
          <TextField
            className={classes.inviteInput}
            id="userName2"
            margin="dense"
            onKeyDown={keyPress}
            placeholder={t('pages.listPage.roomSettings.addOrgMembers')}
            type="text"
          />
        </div>
        <Button
          className={classes.orgSettingsInviteBtn}
          onClick={handleClickInvite}
          size="small"
          disabled={inviteList.length > 0 ? false : true}
          variant="contained"
        >
          {t('pages.listPage.roomSettings.invite')}
        </Button>
      </Box>

      <Box sx={{ display: 'flex', alignItems: 'center' }}>
        <Button
          className={classes.invitationLinkBtn}
          color="primary"
          onClick={() => {
            onInvitationClick();
          }}
          variant="text"
        >
          {t('pages.listPage.inviteCopyInvitationLink')}
        </Button>
      </Box>
    </StyledBox>
  );
}
