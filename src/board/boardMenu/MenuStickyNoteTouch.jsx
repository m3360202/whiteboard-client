import React from 'react';
import { styled } from '@mui/material/styles';
import { Theme } from '@mui/material/styles'; // add this line
import Slider from '@mui/material/Slider';
import FileCopyIcon from '@mui/icons-material/FileCopyOutlined';
import SaveIcon from '@mui/icons-material/Save';
import PrintIcon from '@mui/icons-material/Print';
import ShareIcon from '@mui/icons-material/Share';
import SpeedDialAction from '@mui/material/SpeedDialAction';
import StickyNoteIcon from '../svg/stickyNote';
import store from '../../store';
import { handleSetIsPanMode,handleSetBoardPanelClicked,handleSetDrawingEraseMode } from '../../store/board';

const PREFIX = 'MenuStickyNoteTouch';

const classes = {
  root: `${PREFIX}-root`,
  thumb: `${PREFIX}-thumb`,
  active: `${PREFIX}-active`,
  valueLabel: `${PREFIX}-valueLabel`,
  track: `${PREFIX}-track`,
  rail: `${PREFIX}-rail`,
  root2: `${PREFIX}-root2`,
  padding: `${PREFIX}-padding`,
  demo1: `${PREFIX}-demo1`,
  demo2: `${PREFIX}-demo2`,
  typography: `${PREFIX}-typography`
};

const Root = styled('div')((
  {
    theme
  }
) => ({
  [`& .${classes.root2}`]: {
    flexGrow: 1,
  },

  [`& .${classes.padding}`]: {
    padding: theme.spacing(3),
  },

  [`& .${classes.demo1}`]: {
    backgroundColor: theme.palette.background.paper,
  },

  [`& .${classes.demo2}`]: {
    backgroundColor: '#2e1534',
  },

  [`& .${classes.typography}`]: {
    padding: theme.spacing(2),
  }
}));

const actions = [
  { icon: <StickyNoteIcon />, name: 'note' },
  { icon: <FileCopyIcon />, name: 'Copy' },
  { icon: <SaveIcon />, name: 'Save' },
  { icon: <PrintIcon />, name: 'Print' },
  { icon: <ShareIcon />, name: 'Share' },
];
const PrettoSlider = Slider;


export default function MenuStickyNoteTouch({ handleClose, ...props }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };


  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = (event) => {
    store.dispatch(handleSetIsPanMode(false));
    setAnchorEl(event.currentTarget);
    
    store.dispatch(handleSetDrawingEraseMode(false));
    store.dispatch(handleSetBoardPanelClicked(false));

    canvas.createWidgetatCurrentLocationByType('WBRectNotes', { color: '#FEF594', noteType: 'rect', useCenterOfScreen: true });

    handleClose();
    setTimeout(() => {
      canvas.zoomToObject(canvas.getActiveObject());
      canvas.discardActiveObject();
      canvas.lockObjectsInCanvas();
    }, 300);

    /**
      * @author Gengda
      * @date: 04/05/2021
      * @description: Fix the tab's indicator shift when refresh
      * This is a substitute to solve. We should use the api "updateIndicator()", which is an action at Tabs.
      * However, it comes the error "updateIndicator is not defined". And I don't know how to solve it.
    */
    // TODO: Still have timeout
    setTimeout(() => window.dispatchEvent(new CustomEvent('resize')), 0);
  };

  return (
    <Root>
      <SpeedDialAction
        key={actions[0].name}
        icon={actions[0].icon}
        tooltipTitle={actions[0].name}
        onClick={handleClick}
        {...props}
      />
    </Root>
  );
}