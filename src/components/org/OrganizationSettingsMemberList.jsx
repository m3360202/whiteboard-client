//** Import react
import React, { useState } from 'react';

import { styled } from '@mui/material/styles';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux toolkit
import store from '../../store';
import { useSelector, useDispatch } from 'react-redux';
import {
  useAddOrgAdminMutation,
  useRemoveOrgAdminMutation,
  useRemoveUserFromOrgMutation,
  useGetOrgMemberListQuery
} from '../../redux/OrgAPISlice';

import MoreHorizOutlinedIcon from '@mui/icons-material/MoreHorizOutlined';
import ListItemText from '@mui/material/ListItemText';
import { DataGrid } from '@mui/x-data-grid';
import IconButton from '@mui/material/IconButton';
import Avatar from '@mui/material/Avatar';
import MenuItem from '@mui/material/MenuItem';
import Menu from '@mui/material/Menu';

const PREFIX = 'OrganizationSettingsMemberList';

const classes = {
  userNameAvatar: `${PREFIX}-userNameAvatar`,
  userNameText: `${PREFIX}-userNameText`,
  root: `${PREFIX}-root`,
  columnHeader: `${PREFIX}-columnHeader`,
  columnHeaderTitleContainer: `${PREFIX}-columnHeaderTitleContainer`,
  cell: `${PREFIX}-cell`,
  columnHeaderTitle: `${PREFIX}-columnHeaderTitle`,
  paper: `${PREFIX}-paper`
};

const Root = styled('div')(({ theme }) => ({
  width: '100%',
  height: 'calc(100vh - 500px)',
  overflow: 'scroll',

  [`& .${classes.userNameAvatar}`]: {
    width: '40px',
    height: '40px',
    float: 'left',
    marginTop: 12
  },

  [`& .${classes.userNameText}`]: {
    marginLeft: 54,
    lineHeight: '64px'
  },

  [`& .${classes.root}`]: {
    [theme.breakpoints.up('sm')]: {
      width: '916px'
    },
    border: 0,
    fontSize: '16px',
    fontWeight: 400
  },

  [`& .${classes.columnHeader}`]: {
    padding: '0 !important',
    border: '0 !important',
    outline: 'none !important'
  },

  [`& .${classes.columnHeaderTitleContainer}`]: {
    padding: '0 !important'
  },

  [`& .${classes.cell}`]: {
    padding: '0 !important',
    outline: 'none !important'
  },

  [`& .${classes.columnHeaderTitle}`]: {
    color: 'rgba(35, 41, 48, 0.65)'
  },

  [`& .${classes.paper}`]: {
    boxShadow: '0px 1px 3px 2px rgba(222, 222, 222, 0.64)',
    borderRadius: '8px',
    background: '#FFFFFF',
    marginLeft: '30px'
  }
}));

export default function OrganizationSettingsMemberList({ orgInfo }) {
  //use
  const dispatch = useDispatch();

  const { t } = useTranslation();
  const [anchorElMemberList, setAnchorElMemberList] = useState(null);
  const [currentUser, setCurrentUser] = useState({});

  //user
  const userInfo = useSelector((state) => state.user.userInfo);

  //org
  const { data: orgMemberListData = [] } = useGetOrgMemberListQuery({
    orgId: orgInfo.orgId
  });
  console.log('orgMemberListData', orgMemberListData)
  const orgMemberList = orgMemberListData.filter(u=>u.username && u.username.indexOf('_vistor') === -1);
  const currentUserInOrgRole = orgMemberList.find(
    item => item.userId === store.getState().user.userInfo.userId
  );

  const [addOrgAdmin] = useAddOrgAdminMutation();
  const [removeOrgAdmin] = useRemoveOrgAdminMutation();
  const [removeUserFromOrg] = useRemoveUserFromOrgMutation();

  const orgMembersListNameCell = params => {
    const user = params.row;
    let username = user.user && user.user.length !== 0 ? user.user[0].name : user.username;
    let imgSrc = user.user[0].head_url && user.user[0].head_url.indexOf('cn-boardx.oss') > -1 ? '' : user.user[0].head_url;

    return (
      <div>
        <Avatar
          {...Boardx.Util.stringAvatar(username)}
          className={classes.userNameAvatar}
          id="avatar-img"
          src={imgSrc}
        >
          {username?.toUpperCase().charAt(0)}
        </Avatar>

        <div className={classes.userNameText}>{username}</div>
      </div>
    );
  };

  const orgMembersListRoleCell = params => {
    const user = params.row;
    if (user.role === 'owner') {
      return <p>{t('pages.listPage.roomMembers.owner')}</p>;
    }
    if (user.role === 'member') {
      return <p>{t('pages.listPage.roomMembers.member')}</p>;
    }
    return <p>{t('pages.listPage.roomMembers.administrator')}</p>;
  };

  const orgMembersListMenuCell = params => {
    const user = params.row;
    const onDelete = () => {
      handleClose();
      if (currentUser.role === 'owner') {
        Boardx.Util.Msg.warning(
          `${currentUser.username} ${t('pages.ownerNotRemovableOrg')}`
        );
      } else if (
        currentUser.role === 'administrator' &&
        currentUserInOrgRole.role === 'administrator'
      ) {
        Boardx.Util.Msg.info(t('pages.adminRemoveUser'));
      } else {
        handleDelete(currentUser.userId, currentUser.username, orgInfo);
      }
    };

    const handleDelete = async (userId, username, orgInfo) => {
      await removeUserFromOrg({ orgId: orgInfo.orgId, userId: userId });
    };

    const onSetModerator = async () => {
      handleClose();
      if (currentUser.role === 'owner') {
        Boardx.Util.Msg.warning(
          `${currentUser.username} ${t('pages.ownerNotRoleChange')}`
        );
        return;
      }

      if (currentUser.role === 'administrator') {
        Boardx.Util.Msg.info(
          `${currentUser.username} ${t('pages.alreadyAnAdministrator')}`
        );
        return;
      }

      await addOrgAdmin({ orgId: orgInfo.orgId, userId: currentUser.userId });
    };

    const onSetUser = async () => {
      handleClose();
      if (currentUser.role === 'owner') {
        Boardx.Util.Msg.warning(
          `${currentUser.username} ${t('pages.ownerNotRoleChange')}`
        );
        return;
      }

      if (currentUser.role === 'member') {
        Boardx.Util.Msg.info(
          `${currentUser.username} ${t('pages.alreadyAmember')}`
        );
        return;
      }

      if (
        currentUser.role === 'administrator' &&
        currentUserInOrgRole.role === 'administrator'
      ) {
        Boardx.Util.Msg.info(t('pages.adminOperateInfo'));
        return;
      }

      await removeOrgAdmin({
        orgId: orgInfo.orgId,
        userId: currentUser.userId
      });
    };

    const handleClose = () => {
      setAnchorElMemberList(null);
    };

    const handleMenuClick = event => {
      const { api } = params;
      const fields = api
        .getAllColumns()
        .map(c => c.field)
        .filter(c => c !== '__check__' && !!c);
      const thisRow = params.row;

      setCurrentUser(thisRow);
      setAnchorElMemberList(event.currentTarget);
    };

    return (
      <div>
        <IconButton
          color="primary"
          component="span"
          onClick={handleMenuClick}
          size="large"
        >
          <MoreHorizOutlinedIcon style={{ color: '#757575' }} />
        </IconButton>
        <Menu
          anchorEl={anchorElMemberList}
          classes={{ paper: classes.paper }}
          id={user.username}
          keepMounted
          onClose={handleClose}
          open={
            Boolean(anchorElMemberList) &&
            currentUser.username === user.username
          }
        >
          <MenuItem
            onClick={onSetModerator.bind(this, orgInfo)}
            style={{
              display: currentUser.role === 'member' ? 'block' : 'none'
            }}
          >
            <ListItemText
              primary={t('pages.listPage.roomMembers.setasModerator')}
            />
          </MenuItem>
          <MenuItem
            onClick={onSetUser.bind(this, orgInfo)}
            style={{
              display: currentUser.role === 'administrator' ? 'block' : 'none'
            }}
          >
            <ListItemText
              primary={t('pages.listPage.roomMembers.setasUser')}
            />
          </MenuItem>
          <MenuItem onClick={onDelete.bind(this, orgInfo)}>
            <ListItemText
              primary={t('pages.listPage.roomMembers.remove')}
            />
          </MenuItem>
        </Menu>
      </div>
    );
  };

  const columns = [
    {
      field: 'username',
      headerName: t('pages.listPage.roomMembers.name'),
      width: 415,
      renderCell: params => orgMembersListNameCell(params)
    },
    {
      field: 'role',
      headerName: t('pages.listPage.roomMembers.role'),
      width: 415,
      renderCell: params => orgMembersListRoleCell(params),
      sortComparator: (v1, v2) => v1.charCodeAt(4) - v2.charCodeAt(4)
    },
    {
      field: ' ',
      headerName: ' ',
      sortable: false,
      width: 60,
      disableClickEventBubbling: true,
      renderCell: params => orgMembersListMenuCell(params)
    }
  ];

  return (
    <Root>
      <DataGrid
        autoHeight
        classes={{
          root: classes.root,
          cell: classes.cell,
          columnHeader: classes.columnHeader,
          columnHeaderTitle: classes.columnHeaderTitle,
          columnHeaderTitleContainer: classes.columnHeaderTitleContainer
        }}
        columns={columns}
        disableColumnMenu
        disableSelectionOnClick
        // hideFooter
        pageSize={25}
        rowHeight={64}
        rows={orgMemberList}
        rowsPerPageOptions={[10]}
        showColumnRightBorder
        sortingOrder={['desc', 'asc']}
      />
    </Root>
  );
}
