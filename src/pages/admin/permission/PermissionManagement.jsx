//** Import react
import * as React from 'react';
import { useState, useEffect ,useRef} from 'react';

//** Import Mui
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import { Checkbox } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { DataGrid } from '@mui/x-data-grid';
import { Stack } from '@mui/system';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import server from '../../../startup/serverConnect';

var roleList;

export default function PermissionManagement() {
  const [id, setId] = useState(null);
  const [action, setAction] = useState(null);
  const [keyword, setKeyword] = useState(null);
  const [type, setType] = useState(null);
  const [item, setItem] = useState(null);

  const nameRef = useRef();

  const [roleItems, setRoleItems] = useState([
    {
      field: 'name',
      sortable: false,
      headerName: 'Permission',
      width: 200
    }
  ]);

  const [permissionItems, setPermissionItems] = useState([]);

  const [openEditItem, setOpenEditItem] = useState(false);

  /**
   * Function to retrieve role items from the server and set up permission items.
   */
  const getRoleItems = () => {
    // Make a  call to get role items from the server.
    server.call('getRoleItems').then(result => {
      if (result) {
        // Initialize a list with a default column for 'Permission'.
        let list = [
          {
            field: 'name',
            sortable: false,
            headerName: 'Permission',
            width: 200
          }
        ];

        // Iterate through role items to dynamically generate columns for permissions.
        result.map(t => {
          let data = {
            field: t.name,
            headerName: t.name,
            width: 155,
            sortable: false,
            renderCell: params => {
              // Render a Checkbox based on the permission status.
              return (
                <Checkbox
                  defaultChecked={params.row[t.name] === true ? true : false}
                  onChange={e => {
                    handleChangeCheckedElement(e, params);
                  }}
                />
              );
            }
          };
          list.push(data);
        });

        // Add an 'Edit' column with buttons for each permission item.
        let edit = {
          field: 'edit',
          sortable: false,
          headerName: 'Edit',
          width: 200,
          renderCell: params => {
            return (
              <Box style={{ display: 'flex' }}>
                <Button
                  style={{ marginRight: '8px' }}
                  variant="contained"
                  onClick={e => {
                    setItem(params.row);
                    handleEditRoleOpen('edit', params.row._id, 'permission');
                  }}
                >
                  {' '}
                  Edit{' '}
                </Button>
                <Button
                  variant="outlined"
                  onClick={e => {
                    handleDeletePermissionItem(e, params);
                  }}
                  sx={{
                    border: '1px solid rgba(74, 123, 247, 0.5)',
                    color: '#F21D6B',
                    '&:hover': {
                      backgroundColor: 'rgba(74, 123, 247, 0.08)',
                      border: '1px solid #F21D6B'
                    }
                  }}
                >
                  {' '}
                  Delete{' '}
                </Button>
              </Box>
            );
          }
        };

        list.push(edit);

        // Store the generated role list.
        roleList = list;
        setRoleItems(roleList);

        // Make another  call to get permission items based on a keyword.
        server.call('getPermissionItems', keyword).then(res => {
          let permissionlist = [];

          // Iterate through permission items and initialize their values for each role column.
          res.map(t => {
            t.id = t._id;
            if (roleList) {
              roleList.map(m => {
                if (!t[m.field] && m.field !== 'name' && m.field !== 'edit') {
                  t[m.field] = false;
                }
                if (!t[m.field] && m.field === 'edit') {
                  t[m.field] = false;
                }
              });
            }
            permissionlist.push(t);
          });

          // Set the permission items with initialized values.
          setPermissionItems(permissionlist);
        }).catch(err => {
          Boardx.Util.Msg.info(err.reason);
        });

      }
    }).catch(err => {
      console.log(err)
    });

  };

  /**
   * Function to handle the search operation based on a keyword.
   * @param {Object} e - The event object containing the search input value.
   */
  const handleSearch = e => {
    // Set the keyword to the value entered in the search input.
    setKeyword(e.target.value);

    // Call the function to retrieve role items based on the updated keyword.
    getRoleItems();
  };

  /**
   * Function to handle changes in the checked state of an element (e.g., checkbox).
   * @param {Object} e - The event object containing the updated checked state.
   * @param {Object} item - The item representing the row and column where the change occurred.
   */
  const handleChangeCheckedElement = (e, item) => {
    // Create an object with the relevant data to be updated.
    const data = {
      id: item.row._id, // Unique identifier of the item
      name: item.colDef.field, // Name of the field being updated
      value: e.target.checked // Updated checked state (true or false)
    };

    // Call a  method to update the permission value in the database.
    server.call('updatePermissionValue', data)
  };

  /**
   * Function to handle the deletion of a permission item.
   * @param {Object} e - The event object (e.g., click event).
   * @param {Object} item - The item representing the permission to be deleted.
   */
  const handleDeletePermissionItem = (e, item) => {
    // Display a confirmation dialog to confirm the deletion.
    if (confirm('Are you sure you want to delete this permission?') === true) {
      // Call a  method to remove the permission item from the database.
      server.call('removePermissionItems', item.row._id).then(res => {
        getRoleItems();
      }).catch(err => {
        console.log(err)
      });
    }
  };

  /**
   * Function to handle the submission of role or permission data.
   * @param {string} action - The action to perform (e.g., 'create' or 'edit').
   * @param {string} id - The ID of the role or permission being edited.
   * @param {string} type - The type of data being submitted (e.g., 'role' or 'permission').
   */
  const handleSubmit = async (action, id, type) => {
    // Check if the type is 'role'.
    if (type === 'role') {
      // Handle creating a new role.
      if (action === 'create') {
        let data = {
          name: nameRef.current.value
        };
        server.call('addRoleItems', data).then(res => {
          Boardx.Util.Msg.info(t('adminPage.createRoleSuccess'));
          getRoleItems();
        }).catch(err => {
          Boardx.Util.Msg.info(err.reason);
        });
      }

      // Handle editing an existing role.
      if (action === 'edit') {
        let data = {
          id: id,
          name: nameRef.current.value
        };

        server.call('updateRoleItems', data).then(res => {
          Boardx.Util.Msg.info(t('adminPage.updateRoleDataSuccess'));
          getRoleItems();
        }).catch(err => {
          Boardx.Util.Msg.info(err.reason);
        });
      }
    }

    // Check if the type is 'permission'.
    if (type === 'permission') {
      // Handle creating a new permission.
      if (action === 'create') {
        let data = {
          name: nameRef.current.value
        };
        server.call('addPermissionItems', data).then(res => {
          Boardx.Util.Msg.info(t('adminPage.createPermissionSuccess'));
          getRoleItems();
        }).catch(err => {
          Boardx.Util.Msg.info(err.reason);
        });

      }

      // Handle editing an existing permission.
      if (action === 'edit') {
        let data = {
          id: id,
          name: nameRef.current.value
        };
        server.call('updatePermissionItems', data).then(res => {
          Boardx.Util.Msg.info(
            t('adminPage.updatePermissionDataSuccess')
          );

          // Refresh the role items after a successful update.
          getRoleItems();
        }).catch(err => {
          Boardx.Util.Msg.info(err.reason);
        });

      }
    }
    
    // Reset the item state to null.
    setItem(null);
  };

  /**
   * Function to open a dialog or interface for editing a role.
   * @param {string} action - The action to perform (e.g., 'edit').
   * @param {string} id - The ID of the role to be edited.
   * @param {string} type - The type of role (e.g., 'permission').
   */
  const handleEditRoleOpen = (action, id, type) => {
    // If an ID is provided, set it for the role being edited.
    if (id) {
      setId(id);
    }

    // If an action is provided, set it (e.g., 'edit').
    if (action) {
      setAction(action);
    }

    // If a type is provided, set it (e.g., 'permission').
    if (type) {
      setType(type);
    }

    // Open the edit role dialog or interface.
    setOpenEditItem(true);
  };

  /**
   * Function to open a dialog or interface for editing a permission.
   * @param {string} action - The action to perform (e.g., 'edit').
   * @param {string} id - The ID of the permission to be edited.
   * @param {string} type - The type of permission (e.g., 'permission').
   */
  const handleEditPermissionOpen = (action, id, type) => {
    // If an ID is provided, set it for the permission being edited.
    if (id) {
      setId(id);
    }

    // If an action is provided, set it (e.g., 'edit').
    if (action) {
      setAction(action);
    }

    // If a type is provided, set it (e.g., 'permission').
    if (type) {
      setType(type);
    }

    // Open the edit permission dialog or interface.
    setOpenEditItem(true);
  };

  const handleClose = () => {
    setOpenEditItem(false);
  };

  useEffect(() => {
    getRoleItems();
  }, []);

  return (
    <Box sx={{ height: '100%' }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
        <Typography variant="h6" noWrap component="div">
          Permission Management
        </Typography>
        <Box sx={{ display: 'flex' }}>
          <Button
            variant="contained"
            onClick={handleEditRoleOpen.bind(this, 'create', null, 'role')}
            sx={{ marginRight: '8px' }}
          >
            Add Role
          </Button>
          <Button
            variant="contained"
            onClick={handleEditPermissionOpen.bind(
              this,
              'create',
              null,
              'permission'
            )}
          >
            Add Permission
          </Button>
        </Box>
      </Box>
      <Dialog fullWidth={true} open={openEditItem} onClose={handleClose}>
        <Box style={{ padding: '40px' }}>
          <Typography variant="h6" noWrap component="div">
            Item name:
          </Typography>
          <TextField
            defaultValue={item?.name}
            fullWidth
            id="fullname"
            inputRef={nameRef}
            inputProps={{ style: { height: '18px' } }}
            label="Name"
            variant="outlined"
          />

          <Button
            variant="outlined"
            sx={{
              fontSize: '14px',
              fontFamily: 'Inter',
              fontWeight: '500',
              marginTop: '16px',
              color: '#F21D6B'
            }}
            onClick={handleSubmit.bind(this, action, id, type)}
          >
            Save
          </Button>
        </Box>
      </Dialog>
      <Box
        sx={{
          width: '100%',
          typography: 'body1',
          mt: '27px',
          padding: '20px',
          background: '#fff',
          height: '95%',
          display: 'flex',
          flexDirection: 'column'
        }}
      >
        <TextField
          defaultValue={keyword}
          fullWidth
          id="fullname"
          inputProps={{ style: { height: '18px', width: '95%' } }}
          label="Filter"
          variant="outlined"
          onKeyDown={handleSearch}
        />
        <Box
          sx={{
            minWidth: '960px',
            minHeight: '500px',
            flex: 1
          }}
        >
          {' '}
          <Stack
            sx={{
              width: '100%',
              minHeight: '500px',
              margin: '8px 0px',
              height: '100%'
            }}
          >
            <DataGrid
              columns={roleItems}
              rows={permissionItems}
              rowHeight={64}
              rowsPerPageOptions={[5, 10, 20, 50, 100]}
              sortingOrder={['desc', 'asc']}
              pageSize={50}
            />
          </Stack>
        </Box>
      </Box>
    </Box>
  );
}
