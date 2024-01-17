/* eslint-disable react/jsx-props-no-spreading */
/* eslint-disable react/jsx-props-no-multi-spaces */
/* eslint-disable no-unused-vars */
import React from 'react';
import { styled } from '@mui/material/styles';
import Backdrop from '@mui/material/Backdrop';
import CircularProgress from '@mui/material/CircularProgress';

import Badge from '@mui/material/Badge';
import MailIcon from '@mui/icons-material/Mail'; // material ui 4.x
import LinearProgress from '@mui/material/LinearProgress';
import Card from '@mui/material/Card';
import Chip from '@mui/material/Chip';
import Divider from '@mui/material/Divider';
import Slider from '@mui/material/Slider';
import { withStyles } from '@mui/material/styles';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import SpeedDial from '@mui/material/SpeedDial';
import NoteOutlinedIcon from '@mui/icons-material/NoteOutlined';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import Switch from '@mui/material/Switch';
import Autocomplete from '@mui/material/Autocomplete';
import Tooltip from '@mui/material/Tooltip';
import { DataGrid } from '@mui/x-data-grid';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Select from '@mui/material/Select';
import DialogActions from '@mui/material/DialogActions';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import Typography from '@mui/material/Typography';
import IconButton from '@mui/material/IconButton';
import ToggleButton from '@mui/material/ToggleButton';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContentText from '@mui/material/DialogContentText';
import DialogContent from '@mui/material/DialogContent';
import Dialog from '@mui/material/Dialog';
import AvatarGroup from '@mui/material/AvatarGroup';
import Avatar from '@mui/material/Avatar';
import AppBar from '@mui/material/AppBar';
import Button from '@mui/material/Button';

const PREFIX = 'Demo';

const classes = {
  root: `${PREFIX}-root`,
  thumb: `${PREFIX}-thumb`,
  active: `${PREFIX}-active`,
  valueLabel: `${PREFIX}-valueLabel`,
  track: `${PREFIX}-track`,
  rail: `${PREFIX}-rail`
};

const Root = styled('div')({
  [`& .${classes.root}`]: {
    color: '#52af77',
    height: 8,
  },
  [`& .${classes.thumb}`]: {
    height: 24,
    width: 24,
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: 0,
    marginLeft: 0,
    '&:focus, &:hover, &$active': {
      boxShadow: 'inherit',
    },
  },
  [`& .${classes.active}`]: {},
  [`& .${classes.valueLabel}`]: {
    left: 'calc(-50% + 4px)',
  },
  [`& .${classes.track}`]: {
    height: 8,
    borderRadius: 4,
  },
  [`& .${classes.rail}`]: {
    height: 8,
    borderRadius: 4,
  },
});

const PrettoSlider = Slider;

const rows = [
  {
    id: 1,
    lastName: 'Snow',
    firstName: 'Jon',
    age: 35,
  },
  {
    id: 2,
    lastName: 'Lannister',
    firstName: 'Cersei',
    age: 42,
  },
  {
    id: 3,
    lastName: 'Lannister',
    firstName: 'Jaime',
    age: 45,
  },
  {
    id: 4,
    lastName: 'Stark',
    firstName: 'Arya',
    age: 16,
  },
  {
    id: 5,
    lastName: 'Targaryen',
    firstName: 'Daenerys',
    age: null,
  },
  {
    id: 6,
    lastName: 'Melisandre',
    firstName: null,
    age: 150,
  },
  {
    id: 7,
    lastName: 'Clifford',
    firstName: 'Ferrara',
    age: 44,
  },
  {
    id: 8,
    lastName: 'Frances',
    firstName: 'Rossini',
    age: 36,
  },
  {
    id: 9,
    lastName: 'Roxie',
    firstName: 'Harvey',
    age: 65,
  },
];
const columns = [
  { field: 'id', headerName: 'ID', width: 70 },
  { field: 'firstName', headerName: 'First name', width: 130 },
  { field: 'lastName', headerName: 'Last name', width: 130 },
  {
    field: 'age',
    headerName: 'Age',
    type: 'number',
    width: 90,
  },
  {
    field: 'fullName',
    headerName: 'Full name',
    description: 'This column has a value getter and is not sortable.',
    sortable: false,
    width: 160,
    valueGetter: (params) =>
      `${params.getValue(params.id, 'firstName') || ''} ${
        params.getValue(params.id, 'lastName') || ''
      }`,
  },
];

function Demo() {
  const [anchorMenuEl, setAnchorMenuEl] = React.useState(null);
  const openMenu = Boolean(anchorMenuEl);
  const handleClickMenu = (event) => {
    setAnchorMenuEl(event.currentTarget);
  };
  const handleCloseMenu = () => {
    setAnchorMenuEl(null);
  };

  const [openDialog, setOpenDialog] = React.useState(false);

  const handleClickOpenDialog = () => {
    setOpenDialog(true);
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const [openSpeedDial, setOpenSpeedDial] = React.useState(false);
  const [hiddenSpeedDial, setHiddenSpeedDial] = React.useState(false);

  const handleCloseSpeedDial = () => {
    setOpenSpeedDial(false);
  };

  const handleOpenSpeedDial = () => {
    setOpenSpeedDial(true);
  };

  const [openBackdrop, setOpenBackdrop] = React.useState(false);
  const handleCloseBackdrop = () => {
    setOpenBackdrop(false);
  };
  const handleToggleBackdrop = () => {
    setOpenBackdrop(!openBackdrop);
  };

  const [valueTab, setValueTab] = React.useState('one');

  const handleChangeTab = (event, newValue) => {
    setValueTab(newValue);
  };

  return (
    <Root>
      {' <AppBar></AppBar>'}
      <hr />
      {' <AppBar></AppBar>'}
      <hr />
      <AppBar />
      <hr />
      {
        ' <Select><MenuItem /></Select> ---is also used in **FontSize Selection**'
      }
      <hr />
      <Button
        aria-controls="basic-menu"
        aria-expanded={openMenu ? 'true' : undefined}
        aria-haspopup="true"
        id="basic-button"
        onClick={handleClickMenu}
      >
        Select Menu
      </Button>
      <Select
        IconComponent="span"
        SelectDisplayProps={{ style: { paddingRight: 15 } }}
        data-cy="FontSize"
        disableUnderline
        displayEmpty
        inputProps={{ 'aria-label': 'Without label' }}
        onChange={handleCloseMenu}
        style={{
          borderColor: 'gainsboro',
          width: 45,
          textAlign: 'center',
          color: 'gray',
          borderLeftWidth: 0,
          borderRightWidth: 0,
          height: 48,
        }}
        value={10}
        variant="standard"
      >
        <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
        <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
      </Select>
      <hr />
      <hr />
      {' <Menu><MenuItem /></Menu>'}
      <hr />
      <Button
        aria-controls="basic-menu"
        aria-expanded={openMenu ? 'true' : undefined}
        aria-haspopup="true"
        id="basic-button"
        onClick={handleClickMenu}
      >
        Menu
      </Button>
      <Menu
        MenuListProps={{
          'aria-labelledby': 'basic-button',
        }}
        anchorEl={anchorMenuEl}
        id="basic-menu"
        onClose={handleCloseMenu}
        open={openMenu}
      >
        <MenuItem onClick={handleCloseMenu}>Profile</MenuItem>
        <MenuItem onClick={handleCloseMenu}>My account</MenuItem>
        <MenuItem onClick={handleCloseMenu}>Logout</MenuItem>
      </Menu>
      <hr />
   
      <hr />
      {' ------Below are compoments from material UI and used in Boardx-------'}
      <hr />
      {' <Tabs><Tab /></Tabs>'}
      <hr />
      <Tabs
        aria-label="secondary tabs example"
        indicatorColor="secondary"
        onChange={handleChangeTab}
        textColor="secondary"
        value={valueTab}
      >
        <Tab label="Item One" value="one" />
        <Tab label="Item Two" value="two" />
        <Tab label="Item Three" value="three" />
      </Tabs>
      <hr />
      {' <input type="text"  />'}
      <hr />
      <input
        disabled
        style={{
          paddingTop: 2,
          height: 30,
          width: 100,
          textAlign: 'center',
          border: '1px solid #908EA5',
          fontSize: '12px',
          backgroundColor: 'white',
          display: 'block',
        }}
        type="text"
        value="input text"
      />
      <hr />
      {' <input type="button"  />'}
      <hr />
      <input
        data-field="quantity"
        style={{
          minWidth: 0,
          height: 30,
          width: 30,
          border: '1px solid #908EA5',
          backgroundColor: 'white',
        }}
        type="button"
        value="+"
      />

      <hr />
      {'<DataGrid />  from .RoomSettingsMemberList'}
      <hr />
      <div style={{ height: 400, width: '100%' }}>
        <DataGrid
          columns={columns}
          disableSelectionOnClick
          pageSize={5}
          rows={rows}
          rowsPerPageOptions={[10]}
        />
      </div>
      <hr />
      {
        '<Tooltip /> <ToggleButton><BrushOutlinedIcon /> </ToggleButton></Tooltip>'
      }
      <hr />
      <Tooltip arrow placement="right" title="Draw Tip">
        <ToggleButton
          aria-label="arrow"
          style={{ padding: '6px' }}
          value="arrow"
        >
          <BrushOutlinedIcon
            fontSize="medium"
            style={{ margin: 5, color: 'rgba(0, 0, 0, 0.54)' }}
          />
        </ToggleButton>
      </Tooltip>
      <hr />
      {'<Autocomplete />  '}
      <hr />
      <Autocomplete
        disablePortal
        id="combo-box-demo"
        options={['aa', 'bb', 'cc', 'dd']}
        renderInput={(params) => <TextField {...params} label="Movie" />}
        sx={{ width: 300 }}
      />
      <hr />
      {'<Switch />  '}
      <hr />
      <Switch defaultChecked inputProps={{ 'aria-label': 'Switch demo' }} />
      <Switch inputProps={{ 'aria-label': 'Switch demo' }} />
      <Switch
        defaultChecked
        disabled
        inputProps={{ 'aria-label': 'Switch demo' }}
      />
      <Switch disabled inputProps={{ 'aria-label': 'Switch demo' }} />
      <hr />
      {'<SpeedDial />  Please see the left bottom corner'}
      <hr />
      <SpeedDial
        FabProps={{
          style: {
            background: '#f21d6b',
            color: 'white',
            boxShadow: '0px 1px 3px 2px #00000014',
          },
        }}
        ariaLabel="SpeedDial basic example"
        hidden={hiddenSpeedDial}
        icon={<SpeedDialIcon />}
        onClose={handleCloseSpeedDial}
        onOpen={handleOpenSpeedDial}
        open={openSpeedDial}
        sx={{
          position: 'absolute',
          bottom: 16,
          right: 16,
          color: '#333',
        }}
      >
        <SpeedDialAction
          FabProps={{
            style: {
              background: '#f21d6b',
              color: 'white',
              boxShadow: '0px 1px 3px 2px #00000014',
            },
          }}
          icon={<NoteOutlinedIcon />}
          key="stickyNote"
          // onClick={handleCreateNewNote}
          tooltipTitle="stickyNote"
        />

        <SpeedDialAction
          FabProps={{
            style: {
              background: '#f21d6b',
              color: 'white',
              boxShadow: '0px 1px 3px 2px #00000014',
            },
          }}
          icon={<FileCopyIcon />}
          key="link"
          // onClick={handleCreateNewNote}
          tooltipTitle="link"
        />

        <SpeedDialAction
          FabProps={{
            style: {
              background: '#f21d6b',
              color: 'white',
              boxShadow: '0px 1px 3px 2px #00000014',
            },
          }}
          icon={<BrushOutlinedIcon />}
          key="draw"
          // onClick={handleClickDraw}
          tooltipTitle="draw"
        />
      </SpeedDial>
      <hr />
      {'<PrettoSlider />  --found in LinWidth,MenuDrawing, etc'}
      <hr />
      <PrettoSlider
        aria-label="pretto slider"
        defaultValue={2}
        // min={0}
        max={25}
        value={10}
        valueLabelDisplay="auto"
        classes={{
          root: classes.root,
          thumb: classes.thumb,
          active: classes.active,
          valueLabel: classes.valueLabel,
          track: classes.track,
          rail: classes.rail
        }} />
      <hr />
      {'<Slider /> '}
      <hr />
      <Slider
        aria-labelledby="input-slider"
        // onChange={handleSliderChange}
        color="primary"
        defaultValue={1}
        max={60}
        min={1}
        style={{ color: '#f21d6b' }}
        value={10}
      />
      <hr />
      {'<Divider /> '}
      <hr />
      <Divider />
      <hr />
      {
        '<Chip avatar={{}}> </Chip> -- example is from RoomSettingsInviteUsers , also found in BoardAddTags'
      }
      <hr />
      <Chip
        avatar={
          <Avatar
            alt="Avatar n°"
            style={{ width: '24px', height: '24px' }}
          />
        }
        label="Chip"
      />
      <hr />
      {
        '<Card> Create a New Board </Card> -- example is from BoardCreateBoardModal , also found in SlidesItem'
      }
      <hr />
      <Card
        data-cy="newBoard"
        style={{
          display: 'block',
          cursor: 'pointer',
          background: '#f21d6b', // '#f2f2f3',
          height: '76%',
          width: '50%', // added in the Demo
          borderRadius: 8,
        }}
        // onClick={handleOpen}
      >
        <div style={{ margin: '74px', color: '#FFFFFF', textAlign: 'center' }}>
          {' '}
          <div style={{ display: 'block', fontSize: 50 }}>+</div>
        </div>
      </Card>

      <hr />
      {'<LinearProgress> </LinearProgress> -- found in Vote'}
      <hr />
      <LinearProgress
        color="primary"
        position="static"
        value={5}
        // className={classes.root}
        variant="determinate"
      />
      <hr />
      {
        '<Backdrop /><CircleProgress> </CircleProgress> </Backdrop>-- found in BoardEntity --along with Backdrop, cannot used BoardX component Backdrop'
      }
      <hr />
      <Button onClick={handleToggleBackdrop}>backdrop CircularProgress</Button>
      <Backdrop
        onClick={handleCloseBackdrop}
        open={openBackdrop}
        sx={{ color: '#f21d6b', zIndex: 100 }}
      >
        <CircularProgress color="inherit" size={40} />
      </Backdrop>
      <hr />
      {'<Badge> </Badge> -- found in RoomHeader'}
      <hr />

      <Badge
        badgeContent={4}
        color="secondary"
        style={{ cursor: 'pointer', marginLeft: 10 }}
      >
        <MailIcon />
      </Badge>
      <hr />
      {' ------Below are compoments in BoardX \\mui\\components-------'}
      <hr />

      {' <Paper></Paper>'}
      <hr />
      <Paper />
      <hr />
      {' <Dialog>  <DialogTitle>Set backup account</DialogTitle></Dialog>'}
      <hr />
      <Button onClick={handleClickOpenDialog}>Dialog</Button>
      <Dialog
        // selectedValue={selectedValue}
        onClose={handleCloseDialog}
        open={openDialog}
      >
        <DialogTitle>Dialog Title</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Dialog Content Text Here.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={handleCloseDialog}>Disagree</Button>
          <Button autoFocus onClick={handleCloseDialog}>
            Agree
          </Button>
        </DialogActions>
      </Dialog>
      <hr />

      {/* {' <Backdrop></Backdrop>'}
    <hr />

    <Button onClick={handleToggleBackdrop}>Show backdrop</Button>
      <Backdrop
        sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackdrop}
        onClick={handleCloseBackdrop}
      >
        <CircularProgress />
      </Backdrop> */}

      <hr />
      {"<TextField size = 'small'  label='Name' /> "}
      <TextField
        label="TextField Size=Small "
        size="small"
        variant="outlined"
      />

      <hr />

      {'<AvartarGroup max={4}></AvartarGroup>'}
      <hr />
      <AvatarGroup max={4}>
        <Avatar>H</Avatar>
        <Avatar>E</Avatar>
        <Avatar>A</Avatar>
        <Avatar>T</Avatar>
        <Avatar>B</Avatar>
      </AvatarGroup>
      <hr />

      {"<Avatar size='small(defined by sx)' color='secondary' >Avatar</Avatar>"}
      <Avatar sx={{ width: 24, height: 24 }}>H</Avatar>
      <hr />
      {
        "<Avatar size='medium(defined by sx)' color='secondary' >Avatar</Avatar>"
      }
      <Avatar sx={{ width: 36, height: 36 }}>H</Avatar>
      <hr />
      {"<Avatar size='large(defined by sx)' color='secondary'>Avatar</Avatar>"}
      <Avatar sx={{ width: 40, height: 40 }}>H</Avatar>
      <hr />

      {' <Typography></Typography>'}
      <hr />
      <Typography>Typography: no customized config</Typography>
      <hr />
      {
        ' <ToggleButtonGroup>  <ToggleButton value="left" aria-label="left aligned"> <IconButton /> </ToggleButton></ToggleButtonGroup>'
      }
      <hr />

      <ToggleButtonGroup
        aria-label="text alignment"
        exclusive
        // onChange={handleAlignment}
        value="left"
      >
        <ToggleButton aria-label="left aligned" value="left">
          <IconButton />
        </ToggleButton>
        <ToggleButton aria-label="centered" value="center">
          <IconButton />
        </ToggleButton>
        <ToggleButton aria-label="right aligned" value="right">
          <IconButton />
        </ToggleButton>
        <ToggleButton aria-label="justified" disabled value="justify">
          <IconButton />
        </ToggleButton>
      </ToggleButtonGroup>
      <hr />

      {
        " <Button size ='medium' variant='contained' color='primary'>Button</Button>"
      }
      <Button color="primary" size="medium" variant="contained">
        ButtonButtonButton
      </Button>
      <hr />
      {
        " <Button size ='medium' variant='contained' color='secondary'>Button</Button>"
      }
      <Button color="secondary" size="medium" variant="contained">
        Button
      </Button>
      <hr />
      {
        " <Button size ='medium' variant='contained' color='secondary' disabled>Button</Button>"
      }
      <Button color="secondary" disabled size="medium" variant="contained">
        Button
      </Button>
      <hr />

      {
        " <Button size ='small' variant='contained' color='primary'>Button</Button>"
      }
      <Button color="primary" size="small" variant="contained">
        Button
      </Button>
      <hr />
      {
        " <Button size ='small' variant='contained' color='secondary'>Button</Button>"
      }
      <Button color="secondary" size="small" variant="contained">
        Button
      </Button>
      <hr />
      {
        " <Button size ='small' variant='contained' color='secondary' disabled>Button</Button>"
      }
      <Button color="secondary" disabled size="small" variant="contained">
        Button
      </Button>
      <hr />

      {
        " <Button size ='large' variant='contained' color='primary'>Button</Button>"
      }
      <Button color="primary" size="large" variant="contained">
        Button
      </Button>
      <hr />
      {
        " <Button size ='large' variant='contained' color='secondary'>Button</Button>"
      }
      <Button color="secondary" size="large" variant="contained">
        Button
      </Button>
      <hr />
      {
        " <Button size ='large' variant='contained' color='secondary' disabled>Button</Button>"
      }
      <Button color="secondary" disabled size="large" variant="contained">
        Button
      </Button>
      <hr />

      {
        " <Button size ='medium' variant='outlined' color='primary'>Button</Button>"
      }
      <Button color="primary" size="medium" variant="outlined">
        Button
      </Button>
      <hr />
      {
        " <Button size ='medium' variant='outlined' color='secondary'>Button</Button>"
      }
      <Button color="secondary" size="medium" variant="outlined">
        Button
      </Button>
      <hr />
      {
        " <Button size ='medium' variant='outlined' color='secondary' disabled>Button</Button>"
      }
      <Button color="secondary" disabled size="medium" variant="outlined">
        Button
      </Button>
      <hr />

      {
        " <Button size ='small' variant='outlined' color='primary'>Button</Button>"
      }
      <Button color="primary" size="small" variant="outlined">
        Button
      </Button>
      <hr />
      {
        " <Button size ='small' variant='outlined' color='secondary'>Button</Button>"
      }
      <Button color="secondary" size="small" variant="outlined">
        Button
      </Button>
      <hr />
      {
        " <Button size ='small' variant='outlined' color='secondary' disabled>Button</Button>"
      }
      <Button color="secondary" disabled size="small" variant="outlined">
        Button
      </Button>
      <hr />

      {
        " <Button size ='large' variant='outlined' color='primary'>Button</Button>"
      }
      <Button color="primary" size="large" variant="outlined">
        Button
      </Button>
      <hr />
      {
        " <Button size ='large' variant='outlined' color='secondary'>Button</Button>"
      }
      <Button color="secondary" size="large" variant="outlined">
        Button
      </Button>
      <hr />
      {
        " <Button size ='large' variant='outlined' color='secondary' disabled>Button</Button>"
      }
      <Button color="secondary" disabled size="large" variant="outlined">
        Button
      </Button>
      <hr />

      {"<Button variant='text' color='primary'>Button</Button>"}
      <Button color="primary" variant="text">
        Button
      </Button>
      <hr />
      {"<Button variant='text' color='secondary'>Button</Button>"}
      <Button color="secondary" variant="text">
        Button
      </Button>
      <hr />
      {"<Button variant='text' color='secondary' disabled>Button</Button>"}
      <Button color="secondary" disabled variant="text">
        Button
      </Button>
      <hr />

      {/* {'<Button variant=\'outlined\' color=\'primary\'>Button</Button>'}
    <Button variant="outlined" color="primary">Button</Button>
    <hr />
    { '<Button variant=\'text\' color=\'primary\'>Button</Button>'}
    <Button variant="text" color="primary">Button</Button>
    <hr />

    {' <Button variant=\'contained\' color=\'primary\' disabled>Button</Button>'}
    <Button variant="contained" color="primary" disabled>Button</Button>
    <hr />
    {'<Button variant=\'outlined\' color=\'primary\' disabled>Button</Button>'}
    <Button variant="outlined" color="primary" disabled>Button</Button>
    <hr />
    { '<Button variant=\'text\' color=\'primary\' disabled>Button</Button>'}
    <Button size = "medium" variant="text" color="primary" disabled>Button</Button>
    <hr />

    {'<Button variant=\'contained\' color=\'secondary\'>Button</Button>'}
    <Button variant="contained" color="secondary">Button</Button>

    {'<Button variant=\'outlined\' color=\'secondary\'>Button</Button>'}
    <Button variant="outlined" color="secondary">Button</Button>

    {'<Button variant=\'text\' color=\'secondary\'>Button</Button>'}
    <Button variant="text" color="secondary">Button</Button>
    <hr /> */}
      {/*
      {` <Button variant='text' color='secondary'>Button</Button>`}
      <Button variant='text' color='secondary'>Button</Button>
      <hr></hr> */}
    </Root>
  );
}

export default Demo;
