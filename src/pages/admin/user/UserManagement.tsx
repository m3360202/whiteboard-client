//** Import react
import * as React from 'react';
import { styled } from '@mui/material/styles';
import { useEffect, useState, useRef } from 'react';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Mui
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Dialog from '@mui/material/Dialog';
import Divider from '@mui/material/Divider';
import {
  Checkbox,
  FormControl,
  FormControlLabel,
  FormGroup
} from '@mui/material';
import { Stack } from '@mui/system';
import { DataGrid } from '@mui/x-data-grid';
import clsx from 'clsx';
import FilterUserAndUserTags from './FilterUserAndUserTags';
import AddUserTags from './AddUserTags';
import EditUserTags from './EditUserTags';
import LoadingButton from '@mui/lab/LoadingButton';
import Chip from '@mui/material/Chip';

import Papa from 'papaparse';

//** Import Icon
import UserManagementFilterIcon from '../../../mui/icons/UserManagementFilterIcon';
import UserManagementTagsIcon from '../../../mui/icons/UserManagementTagsIcon';
import UserManagementSelectIcon from '../../../mui/icons/UserManagementSelectIcon';
import UserManagementEditTagsIcon from '../../../mui/icons/UserManagementEditTagsIcon';
import server from '../../../startup/serverConnect';


export default function UserManagement() {

  const { t } = useTranslation();
  const [data, setData] = useState({
    filter: null,
    start: 0,
    limit: 3000
  });
  const [user, setUser] = useState(null);
  const [userList, setUserList] = useState(null);
  const [selectionUsers, setSelectionUsers] = useState([]);
  const [roleItems, setRoleItems] = useState([]);
  const [selectedRoles, setSelectedRoles] = useState([]);
  const [id, setId] = useState(null);
  const [openExplorePlans, setOpenExplorePlans] = useState(false);
  const [openCheckboxSelection, setOpenCheckboxSelection] = useState(false);
  const [openFilterUserPopper, setOpenFilterUserPopper] = useState(false);
  const [openTagsUserPopper, setOpenTagsUserPopper] = useState(false);
  const [openEditTagsUserPopper, setOpenEditTagsUserPopper] = useState(false);
  const [updateGhostDataBtnLoading, setUpdateGhostDataBtnLoading] =
    useState(false);
  const fullNameRef:any = useRef('');
  const userNameRef:any = useRef('');
  const emailRef: any = useRef('');
  const creditsRef: any = useRef('');
  const initUserRoles = roles => {
    let arr = [];
    for (let i = 2; i < roles.length; i++) {
      arr.push(roles[i]);
    }
    setSelectedRoles(arr);
  };
  const handleClick = user => {
    setUser(user.row);
    initUserRoles(user.row.roles);
    setOpenExplorePlans(true);
  };

  const handleDeleteUser = user => {
    if (confirm('Are you sure to delete this UserAccount?') === true) {
      server.call('deleteUser', user.row._id).then(result => {
        if (result) {
          if (!result.status) {
            Boardx.Util.Msg.info(result.msg);
          } else {
            Boardx.Util.Msg.info(
              t('adminPage.userAccountHasBeenDeleted')
            );
            handleGetUserList(data);
          }
        }
      }).catch(err => {
        console.log(err)
      });
    }
  };

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

  const selectRoles = t => {
    if (selectedRoles.includes(t)) {
      setSelectedRoles(selectedRoles.filter(r => r !== t));
    } else {
      setSelectedRoles([...selectedRoles, t]);
    }
  };

  const handleSearch = e => {
    const keyword = e.target.value;
    let newData = { ...data, filter: keyword };
    setData(newData);
  };

  const handleSubmit = async () => {
    let uploadData = {
      userId: user.id,
      name: fullNameRef.current.value,
      email: emailRef.current.value,
      username: userNameRef.current.value,
      credits: creditsRef.current.value,
      roles: selectedRoles
    };
    server.call('updateUserProfileByManage', uploadData).then(res => {
      Boardx.Util.Msg.info(t('adminPage.updateSuccessfully'));
      handleGetUserList(data);
    }).catch(err => {
      Boardx.Util.Msg.info(err.reason);
    });
  };

  const handleClose = () => {
    setOpenExplorePlans(false);
    setId(null);
  };

  const openDialog = newData => {
    if (!id) {
      setId(newData);
      return;
    } else {
      handleClick(newData);
      return;
    }
  };

  const formatTime = t => {
    let date = new Date(t);
    let localDate = date.toLocaleDateString();
    return localDate + ' ' + date.toLocaleTimeString();
  };

  const columns = [
    {
      field: '_id',
      headerName: 'ID',
      width: 255,
      renderCell: params => {
        return <Box>{params.row._id}</Box>;
      }
    },
    {
      field: 'email',
      headerName: 'Email',
      width: 255,
      renderCell: params => {
        return (
          <Box onClick={openDialog.bind(this, params)}>{params.row.email}</Box>
        );
      }
    },
    {
      field: 'username',
      headerName: 'Username',
      width: 225,
      renderCell: params => {
        return (
          <Box onClick={openDialog.bind(this, params)}>
            {params.row.username}
          </Box>
        );
      }
    },
    {
      field: 'name',
      headerName: 'Name',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true,
      renderCell: params => {
        return (
          <Box onClick={openDialog.bind(this, params)}>{params.row.name}</Box>
        );
      }
    },
    {
      field: 'roles',
      headerName: 'Roles',
      sortable: false,
      width: 220,
      disableClickEventBubbling: true,
      renderCell: params => {
        return (
          <Box>
            {params.row.roles
              ? params.row.roles.map(item => {
                  return <Chip sx={{ mr: '5px' }} label={item} />;
                })
              : undefined}
          </Box>
        );
      }
    },
    {
      field: 'phone',
      headerName: 'Phone',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'city',
      headerName: 'City',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'zipCode',
      headerName: 'Zip Code',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'state',
      headerName: 'State',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'country',
      headerName: 'Country',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'occupation',
      headerName: 'Occupation',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'organization',
      headerName: 'Organization',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'interests',
      headerName: 'Interests',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true,
      renderCell: params => {
        return (
          <Box>
            {params.row.interests
              ? params.row.interests.map(item => {
                  return <Chip sx={{ mr: '5px' }} label={item} />;
                })
              : undefined}
          </Box>
        );
      }
    },
    {
      field: 'skillLevel',
      headerName: 'Skill Level',
      sortable: false,
      width: 165,
      disableClickEventBubbling: true
    },
    {
      field: 'tags',
      headerName: 'Tags',
      sortable: false,
      width: 200,
      disableClickEventBubbling: true,
      renderCell: params => {
        return (
          <Box>
            {params.row.tags
              ? params.row.tags.map(item => {
                  return <Chip sx={{ mr: '5px' }} label={item} />;
                })
              : undefined}
          </Box>
        );
      }
    },
    {
      field: 'credits',
      headerName: 'Credits',
      sortable: true,
      width: 165,
      disableClickEventBubbling: true,
      renderCell: params => {
        return (
          <Box onClick={openDialog.bind(this, params)}>
            {params.row.credits}
          </Box>
        );
      }
    },
    {
      field: 'createdAt',
      headerName: 'CreatedAt',
      sortable: true,
      width: 275,
      disableClickEventBubbling: true,
      renderCell: params => {
        return (
          <Box onClick={openDialog.bind(this, params)}>
            {formatTime(params.row.createdAt)}
          </Box>
        );
      }
    },
    {
      field: 'lastLogin',
      headerName: 'LastLogin',
      sortable: true,
      width: 275,
      disableClickEventBubbling: true,
      renderCell: params => {
        return (
          <Box onClick={openDialog.bind(this, params)}>
            {formatTime(params.row.lastLogin)}
          </Box>
        );
      }
    },
    {
      field: 'referalUsers',
      headerName: 'ReferalUsers',
      sortable: false,
      width: 255,
      renderCell: params => {
        return (
          <Box onClick={openDialog.bind(this, params)}>
            {params.row.referalUsers ? params.row.referalUsers : 0}
          </Box>
        );
      }
    },
    {
      field: 'id',
      headerName: 'Edit',
      sortable: false,
      width: 225,
      disableClickEventBubbling: false,
      renderCell: params => {
        return (
          <Box style={{ display: 'flex' }}>
            <Button
              variant="contained"
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '500',
                color: '#fff',
                marginRight: '6px'
              }}
              onClick={handleClick.bind(this, params)}
            >
              Edit
            </Button>
            <Button
              variant="outlined"
              style={{
                fontSize: '14px',
                fontFamily: 'Inter',
                fontWeight: '500',
                color: '#F21D6B'
              }}
              onClick={handleDeleteUser.bind(this, params)}
            >
              Delete
            </Button>
          </Box>
        );
      }
    }
  ];

  useEffect(() => {
    handleGetUserList(data);
  }, [data]);

  useEffect(() => {
    server.call('getRoleItems', null).then(res => {
      setRoleItems(res);
    }).catch(err => {
      Boardx.Util.Msg.info(err.reason);
    });

  }, []);

  const handleSelectionModelChange = (selectionModel, details) => {
    let newUsers = [];
    userList.map((item, index) => {
      if (selectionModel.some(id => id === item._id)) {
        newUsers.push(item);
      }
    });
    newUsers = newUsers.filter(
      (obj, index, self) =>
        index === self.findIndex(t => t.id === obj.id && t.name === obj.name)
    );
    setSelectionUsers(newUsers);
  };

  const handleClickExportTable = () => {
    const csv = Papa.unparse(userList);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', 'userData.csv');
    document.body.appendChild(link);
    link.click();
    Boardx.Util.Msg.info(t('adminPage.exportedSuccessfully'));
  };

  const handleClickUpdateGhost = () => {
    try {
      setUpdateGhostDataBtnLoading(true);
      server.call('updateGhostMembersInfo', userList).then(res => {
        Boardx.Util.Msg.success(t('adminPage.updateSuccessfully'));
        setUpdateGhostDataBtnLoading(false);
        console.warn('updateGhostMembersInfo', res);
      }).catch(err => {
        Boardx.Util.Msg.info(err.reason);
      });
    } catch (error) {
      setUpdateGhostDataBtnLoading(false);
      console.log('updateGhostMembersInfo', error);
    }
  };

  return (
    <Box>
      <Typography variant="h6" noWrap component="div">
        User Management
      </Typography>

      <Dialog fullWidth={true} open={openExplorePlans} onClose={handleClose}>
        <Box style={{ padding: '40px' }}>
          <TextField
            defaultValue={user?.username}
            fullWidth
            id="fullname"
            inputProps={{ style: { height: '18px', marginBottom: '8px' } }}
            inputRef={userNameRef}
            label="UserName"
            variant="outlined"
          />
          <Divider style={{ marginTop: '24px', marginBottom: '24px' }} />
          <TextField
            defaultValue={user?.name}
            fullWidth
            id="fullname"
            inputProps={{ style: { height: '18px', marginBottom: '8px' } }}
            inputRef={fullNameRef}
            label="NickName"
            variant="outlined"
          />
          <Divider style={{ marginTop: '24px', marginBottom: '24px' }} />
          <TextField
            defaultValue={user?.email}
            fullWidth
            id="fullname"
            inputProps={{ style: { height: '18px', marginBottom: '8px' } }}
            inputRef={emailRef}
            label="Email"
            variant="outlined"
          />
          <Divider style={{ marginTop: '24px', marginBottom: '24px' }} />
          <TextField
            defaultValue={user?.credits}
            fullWidth
            id="fullname"
            inputProps={{ style: { height: '18px', marginBottom: '8px' } }}
            inputRef={creditsRef}
            label="Credits"
            variant="outlined"
          />
          <Divider style={{ marginTop: '24px', marginBottom: '24px' }} />
          {roleItems && user && (
            <FormControl style={{ width: '100%' }}>
              <FormGroup>
                {roleItems.map((m, index) => (
                  <FormControlLabel
                    style={{
                      display: index > 0 && index < 7 ? 'none' : 'block'
                    }}
                    key={m.name}
                    control={
                      <Checkbox
                        defaultChecked={user.roles.includes(m.name)}
                        value={m.name}
                        onChange={selectRoles.bind(this, m.name)}
                      />
                    }
                    label={m.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          )}
          <Button
            variant="outlined"
            style={{
              fontSize: '14px',
              fontFamily: 'Inter',
              fontWeight: '500',
              marginTop: '16px',
              color: '#F21D6B',
              margin: '0 auto'
            }}
            onClick={handleSubmit}
          >
            Save Profile
          </Button>
        </Box>
      </Dialog>
      <Box
        sx={{
          width: '100%',
          typography: 'body1',
          mt: '27px',
          backgroundColor: '#fff',
          padding: '25px',
          height: '97%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <Box
          sx={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center'
          }}
        >
          <Box sx={{ display: 'flex', justifyContent: 'space-between', 
          '.filterButton':{  border: '1px solid #150D33 !important',
    borderRadius: '5px'},
    '.selectedButton':{  border: '1px solid #F21D6B !important',
    color: '#F21D6B !important'},
    '.selectedButton2':{color: '#F21D6B !important'},
          '.buttonPublicStyle':{minWidth: 'unset',
          minHeight: 'unset',
          color: '#150D33',
          padding: '4px 19px',
          fontWeight: 500,
          fontSize: '13px',
          lineHeight: '22px',
          letterSpacing: '0.46px',
          textTransform: 'capitalize',
          backgroundColor: 'none',
          background: 'transparent !important',
          fontFamily: 'Inter',
          fontStyle: 'normal',
          height: '30px',
          whiteSpace: 'nowrap'},

          '.textFieldRoot': {  width: '370px',
          '& .MuiInputBase-input': {
            padding: '7px 12px'
          },
          '& .Mui-focused .MuiOutlinedInput-notchedOutline': {
            borderColor: '#F21D6B'
          }},
          '.dataGridcellTextLeft':{    overflowX: 'scroll',}

    }}>
            <Button
              variant="outlined"
              className={clsx(
                'buttonPublicStyle',
                'filterButton',
                openFilterUserPopper ? 'selectedButton' : ''
              )}
              id="filterUserBtn"
              onClick={() => setOpenFilterUserPopper(!openFilterUserPopper)}
              startIcon={
                <UserManagementFilterIcon
                  color={openFilterUserPopper ? '#F21D6B' : '#150D33'}
                />
              }
            >
              Filter
            </Button>
            <Button
              id="tagsUserBtn"
              variant="text"
              className={clsx(
                'buttonPublicStyle',
                openTagsUserPopper ? 'selectedButton2' : ''
              )}
              onClick={() => setOpenTagsUserPopper(!openTagsUserPopper)}
              endIcon={
                <UserManagementTagsIcon
                  color={openTagsUserPopper ? '#F21D6B' : '#150D33'}
                />
              }
            >
              Tags
            </Button>
            {openCheckboxSelection ? (
              <Button
                id="editTagsUserBtn"
                variant="text"
                className={'buttonPublicStyle'}
                onClick={() =>
                  setOpenEditTagsUserPopper(!openEditTagsUserPopper)
                }
                disabled={selectionUsers.length > 0 ? false : true}
                startIcon={
                  <UserManagementEditTagsIcon
                    color={
                      selectionUsers.length > 0
                        ? openEditTagsUserPopper
                          ? '#F21D6B'
                          : '#150D33'
                        : '#E3E3E3'
                    }
                  />
                }
              >
                Edit Tags
              </Button>
            ) : null}
            {/* {openCheckboxSelection ? (
              <Button
                id="deleteTagsUserBtn"
                variant="text"
                className={clsx(
                  'buttonPublicStyle'
                )}
              >
                Delete
              </Button>
            ) : null} */}

            <Button
              onClick={() => setOpenCheckboxSelection(!openCheckboxSelection)}
              variant="text"
              className={clsx(
                'buttonPublicStyle',
                openCheckboxSelection ? 'selectedButton2' : ''
              )}
              startIcon={
                <UserManagementSelectIcon
                  color={openCheckboxSelection ? '#F21D6B' : '#150D33'}
                />
              }
            >
              Select
            </Button>
          </Box>
          <Box
            sx={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}
          >
            <LoadingButton
              sx={{ mr: '10px' }}
              loading={updateGhostDataBtnLoading}
              variant="outlined"
              onClick={handleClickUpdateGhost}
              disabled
            >
              Update Ghost
            </LoadingButton>
            <TextField
              defaultValue={data?.filter}
              fullWidth
              id="fullname"
              classes={{ root: 'textFieldRoot' }}
              inputRef={userNameRef}
              placeholder="Search"
              variant="outlined"
              type="text"
              onKeyDown={handleSearch}
            />
            <Button
              onClick={handleClickExportTable}
              variant="text"
              className={'buttonPublicStyle'}
            >
              Export table
            </Button>
          </Box>
        </Box>
        <FilterUserAndUserTags
          openFilterUserPopper={openFilterUserPopper}
          setOpenFilterUserPopper={setOpenFilterUserPopper}
          userList={userList}
          setUserList={setUserList}
          setData={setData}
        />
        <AddUserTags
          setOpenTagsUserPopper={setOpenTagsUserPopper}
          openTagsUserPopper={openTagsUserPopper}
        />
        <EditUserTags
          openEditTagsUserPopper={openEditTagsUserPopper}
          setOpenEditTagsUserPopper={setOpenEditTagsUserPopper}
          selectionUsers={selectionUsers}
          userList={userList}
          setUserList={setUserList}
        />

        <Box
          sx={{
            minWidth: '960px',
            minHeight: '550px',
            flex: 1
          }}
        >
          <Stack
            sx={{
              width: '100%',
              minHeight: '550px',
              height: '100%',
              margin: '8px 0px'
            }}
          >
            {userList && userList.length > 0 && (
              <DataGrid
                columns={columns}
                rows={userList}
                rowHeight={64}
                disableColumnMenu
                rowsPerPageOptions={[5, 10, 20, 50, 100, 200, 500, 1000]}
                sortingOrder={['desc', 'asc']}
                pageSize={30}
                checkboxSelection={openCheckboxSelection}
                onSelectionModelChange={handleSelectionModelChange}
                classes={{'cell--textLeft': 'dataGridcellTextLeft'}}
              />
            )}
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
