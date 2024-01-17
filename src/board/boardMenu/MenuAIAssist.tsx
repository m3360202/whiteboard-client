//** Import react
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';

//** Import Mui
import Typography from '@mui/material/Typography';
import Tooltip from '@mui/material/Tooltip';
import ToggleButton from '@mui/material/ToggleButton';
import Box from '@mui/material/Box';
import IconButton from '@mui/material/IconButton';
import ClosePopupIcon2 from '../../mui/icons/ClosePopupIcon2';
import Dialog from '@mui/material/Dialog';
import Paper, { PaperProps } from '@mui/material/Paper';
import Draggable from 'react-draggable';

//** Import components
import AIAssistCommandDialogPage from '../widgetMenu/AIAssist/AIAssistCommandDialogPage';


function PaperComponent(props: PaperProps) {
  return (
    <Draggable
      handle="#draggable-dialog-title"
      cancel={'[class*="MuiDialogContent-root"]'}
    >
      <Paper {...props} />
    </Draggable>
  );
}

export function MenuAIAssist(props) {

  const { t } = useTranslation();
  const [currentWidgetType, setCurrentWidgetType] = React.useState([]);
  const [
    isOpenAIContentAndImageCreateion,
    setIsOpenAIContentAndImageCreateion
  ] = useState(false);

  const handleCloseAIContentAndImageCreateion = () => {
    setIsOpenAIContentAndImageCreateion(false);
  };

  const handleClickOpenAIContentAndImageCreateion = () => {
    const currentWidget = canvas.getActiveObject();
    try {
      setIsOpenAIContentAndImageCreateion(!isOpenAIContentAndImageCreateion);
      if (currentWidget._objects && currentWidget._objects.length > 1) {
        let newCurrentWidgetType = [];
        currentWidget._objects.map(item => {
          newCurrentWidgetType.push(item.obj_type);
        });
        setCurrentWidgetType(newCurrentWidgetType);
      } else {
        setCurrentWidgetType([currentWidget.obj_type]);
      }
    } catch (error) {
      console.log(error.message);
    }
  };

  return (
    < Box >
      <Tooltip
        title={`${t('widgetAi.content')} & ${t('widgetAi.imageCreation')}`}
        placement="top"
        arrow
      >
        <ToggleButton
          id="menuAiAssist"
          value="resource"
          onClick={handleClickOpenAIContentAndImageCreateion}
          {...props}
          style={{ borderRadius: '0 8px 0 0' }}
        >
          <img
            src="/images/aiChat/AIMenuIcon.png"
            style={{ width: '20px', height: '20px' }}
          />
        </ToggleButton>
      </Tooltip>

      <Dialog
        open={isOpenAIContentAndImageCreateion}
        PaperComponent={PaperComponent}
        classes={{ paper: 'dialogPaper2' }}
        aria-labelledby="draggable-dialog-title"
        BackdropProps={{ invisible: true }}
        disableEnforceFocus={true}
        
        sx={{'.dialogPaper2':{  margin: '0px',
    width: '450px',
    overflow: 'hidden',
    pointerEvents: 'all'},
    '.titleBox2':{  width: '100%',
    boxSizing: 'border-box',
    padding: '10px 14px',
    display: 'flex',
    justifyContent: 'space-between',
    background: '#0A2774'}
    }}
      >
        <Box className={'titleBox2'} style={{ pointerEvents: 'all' }}>
          <Box
            id="draggable-dialog-title"
            sx={{
              display: 'flex',
              alignItems: 'center',
              flex: 1,
              cursor: 'move'
            }}
          >
            <img
              src="/images/aiChat/AIMenuIcon2.png"
              style={{ width: '20px', height: '20px' }}
            />
            <Typography
              sx={{    fontWeight: 600,
                fontSize: '14px',
                lineHeight: '16px',
                color: '#FFFFFF',
                marginLeft: '6px'}}
              variant="h6"
              component="div"
            >
              {`${t('widgetAi.content')} & ${t('widgetAi.imageCreation')}`}
            </Typography>
          </Box>
          <Box sx={{   display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center'}}>
            <IconButton
              onClick={handleCloseAIContentAndImageCreateion}
              style={{ padding: 0, width: '14px', height: '14px' }}
            >
              <ClosePopupIcon2 />
            </IconButton>
          </Box>
        </Box>
        <AIAssistCommandDialogPage
          open={isOpenAIContentAndImageCreateion}
          type="MenuChatAI"
          currentWidgetType={currentWidgetType}
        />
      </Dialog>
    </Box>
  );
}


const MenuAIAssistMemo = React.memo(MenuAIAssist);

export default MenuAIAssistMemo;
