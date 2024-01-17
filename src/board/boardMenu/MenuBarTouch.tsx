import React from 'react';
import { styled } from '@mui/material/styles';
import SpeedDialIcon from '@mui/material/SpeedDialIcon';
import SpeedDial from '@mui/material/SpeedDial';
import MenuStickyNoteTouch from './MenuStickyNoteTouch';
import MenuDrawingTouch from './MenuDrawingTouch';
import MenuDrawingTouchMenu from './MenuDrawingTouchMenu';
import MenuFileTouch from './MenuFileTouch';
import MenuChatAITouch from '../../components/boardChatAI/MobileChatAI/MenuChatAITouch';
import { IconButton } from '@mui/material';
import FitScreenOutlinedIcon from '../../mui/icons/FitScreenOutlinedIcon';
import store from '../../store';
import { handleSetZoomFactor } from '../../store/board';


function MenuBarTouch() {
  const [open, setOpen] = React.useState(false);
  const [hidden, setHidden] = React.useState(false);

  const handleClose = () => {
    setOpen(false);
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleFitToScreen = async () => {
    console.log('Fit to screen');
    const zoom = await canvas.zoomToViewAllObjects();
    canvas.requestRenderAll();
    store.dispatch(handleSetZoomFactor(zoom));
  };
  return (
    <div>
      <MenuDrawingTouchMenu setHidden={setHidden} />

      {!hidden && (
        <IconButton
          onClick={handleFitToScreen}
          sx={{
            position: 'absolute',
            bottom: 35,
            right: 80,
            color: '1px solid #150D33',
            borderRadius: '20px',
            background: 'white',
            padding: '7px',
            width: '40px',
            height: '40px',
            /* border-width: 1px; */
            borderStyle: 'solid',
            boxShadow: 'rgb(0 0 0 / 24%) 0px 1px 3px 2px'
          }}
        >
          <FitScreenOutlinedIcon style={{ width: '24px', height: '24px' }} />
        </IconButton>
      )}
      {/* {
      !hidden && (
        <MenuChatAITouch
          style={{
            position: 'absolute',
            bottom: 35,
            right: 80,
            color: '1px solid #150D33',
            borderRadius: '20px',
            background: 'white',
            padding: '7px',
            borderStyle: 'solid',
            boxShadow: 'rgb(0 0 0 / 24%) 0px 1px 3px 2px'
          }}
          chatType="boardChat"
        />
      )} */}

      <SpeedDial
        FabProps={{
          style: {
            background: '#FFFFFF',
            boxShadow: '0px 1px 3px 2px rgba(0, 0, 0, 0.24)',
            color: '#150D33'
          },
          size: 'small'
        }}
        ariaLabel="SpeedDial basic example"
        hidden={hidden}
        icon={<SpeedDialIcon />}
        onClose={handleClose}
        onOpen={handleOpen}
        open={open}
        sx={{
          position: 'absolute',
          bottom: 34,
          right: 16,
          color: '1px solid #150D33'
        }}
      >
        <MenuFileTouch
          FabProps={{
            style: {
              background: '#FFFFFF',
              color: '#150D33',
              boxShadow: '0px 1px 3px 2px #00000014'
            }
          }}
          handleClose={handleClose}
        />
        <MenuDrawingTouch
          FabProps={{
            style: {
              background: '#FFFFFF',
              color: '#150D33',
              boxShadow: '0px 1px 3px 2px #00000014'
            }
          }}
          handleClose={handleClose}
          setHidden={setHidden}
        />
        <MenuStickyNoteTouch
          FabProps={{
            style: {
              background: '#FFFFFF',
              color: '#150D33',
              boxShadow: '0px 1px 3px 2px #00000014'
            }
          }}
          handleClose={handleClose}
        />
      </SpeedDial>
    </div>
  );
}


const MenuBarTouchMemo = React.memo(MenuBarTouch);
export default MenuBarTouchMemo;