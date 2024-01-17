import React, { useEffect} from 'react';
import { StyledEngineProvider } from '@mui/material/styles';
import ToggleButtonGroup from '@mui/material/ToggleButtonGroup';
import ColorWidget from './Colors/ColorWidget';
import FormatAlign from './FormatAlign';
import FontSize from './FontSize';
import Font from './Font';
import SwitchNoteType from './SwitchNoteType';
import EmojiMenu from './EmojiMenu';
import FontWeight from './FontWeight';
import AlignGroup from './AlignGroup';
import ConnectorShape from './ConnectorShape';
import ConnectorStyle from './ConnectorStyle';
import ConnectorTips from './ConnectorTips';
import DrawOption from './DrawOption';
import LineWidth from './LineWidth';
import NewLayout from './NewLayout';
import ResetDraw from './ResetDraw';
import BorderLineIcon from '../../mui/icons/BorderLineIcon';
import ObjectLock from './ObjectLock';
import CropImage from './CropImage';
import FileName from './FileName';
import FileDownload from './FileDownload';
import TextToMultipleStickyNotes from './TextToMultipleStickyNotes';
import { SysService, WidgetService } from '../../services';
import { ToggleButton } from '@mui/material';
import Delete from './Delete';
import AIAssist from './AIAssist/AIAssistWidget';
import { handlePreventDefaultEvent } from '../boardMenu/events';
import AudioToTextAI from './AudioToTextAI';
//** Import Redux toolkit
import store, { RootState } from '../../store';
import { useSelector } from 'react-redux';
import { handleChangeFontFamily } from '../../store/widgetMenu';
import { handleSetMenuFontWeight} from '../../store/widgets';

export default function () {
  const [formats, setFormats] = React.useState(() => ['bold', 'italic']);
  const [left, setLeft] = React.useState(400);
  const [top, setTop] = React.useState(500);
  const widgetMenuList = useSelector((state: RootState) => state.board.widgetMenuList);
  const display = useSelector((state: RootState) => state.board.menuDisplay);
  const font  = useSelector((state:RootState)=>state.widgetMenu.fontFamily);
  const [fontColor, setFontColor] = React.useState(' ');
  const [fillColor, setFillColor] = React.useState('');
  const [backgroundColor, setBackgroundColor] = React.useState('');
  const [shapeBackgroundColor, setShapeBackgroundColor] = React.useState('');
  const fontSize = useSelector((state: RootState) => state.widgetMenu.menuFontSize)
  const [strokeColor, setStrokeColor] = React.useState('');
  const [shapeBorderColor, setShapeBorderColor] = React.useState('');
  const [oldShapeBackgroundColor, setOldShapeBackgroundColor] = React.useState('');
  const [polylineArrowColor, setPolylineArrowColor] = React.useState('');
  const [noteDrawColor, setNoteDrawColor] = React.useState('');
  const [width, setWidth] = React.useState(2);
  const [maxlinewidth, setMaxlinewidth] = React.useState(10);
  const fontWeight = useSelector((state:RootState)=>state.widgets.menuFontWeight);
  const [textAlign, setTextAlign] = React.useState('');
  const position  = useSelector((state:RootState)=>state.widgetMenu.position);
  const [opacityValue, setOpacityValue] = React.useState(0);
  const modeType = useSelector((state:RootState)=>state.mode.type);

  useEffect(() => {


    if (position) {
      setLeft(position.left || 400);
      setTop(position.top || 500);
    }
    setOpacityValue(
      store.getState().widgets.opacityValue == 0
        ? 0
        : store.getState().widgets.opacityValue || 100);

    let singleObject = null;
    if (canvas && canvas.getActiveObject()) {
      if (canvas.getActiveObject().isActiveSelection()) {
        singleObject = canvas
          .getActiveObject()
          ._objects.find(c => !c.WBRectPanelId);
      } else {
        singleObject = canvas.getActiveObject();
      }
    }

    if (singleObject && singleObject.fontWeight) {
      store.dispatch(handleSetMenuFontWeight(singleObject.fontWeight || 400));

    }

    if (singleObject && singleObject.textAlign) {
      setTextAlign(singleObject.textAlign || 'center');
    }

    if (singleObject && singleObject.fontFamily) {
      store.dispatch(handleChangeFontFamily( singleObject.fontFamily || ' '));
    }

    if (singleObject && singleObject.backgroundColor) {
      setBackgroundColor(singleObject.backgroundColor || ' ');
      setShapeBackgroundColor(singleObject.backgroundColor || ' ');
    }
    if (singleObject && singleObject.stroke) {
      setStrokeColor(singleObject.stroke || ' ');
      setShapeBorderColor(singleObject.stroke || ' ');
      setPolylineArrowColor(singleObject.stroke || ' ');
    }
    if (singleObject && singleObject.fill) {
      let { fill } = singleObject;
      // if (singleObject.type == 'activeselection') {
      //   fill = singleObject._objects[0].fill;
      // }
      setFillColor(fill || ' ');
      setFontColor(fill || ' ');
      setOldShapeBackgroundColor(fill || ' ');
    }

    if (
      singleObject &&
      (singleObject.strokeWidth || singleObject.fixedLineWidth)
    ) {
      if (singleObject.obj_type == 'WBShapeNotes')
        setWidth(singleObject.fixedLineWidth || 1);
      else setWidth(singleObject.strokeWidth || 2);
      if (singleObject.obj_type == 'WBArrow') setMaxlinewidth(10);
      else setMaxlinewidth(25);
    }
  },[position]);



  const handleFormat = (event, newFormats) => {
    setFormats(newFormats);
  };

  React.useEffect(() => {
    const isLock = store.getState().board.currentLockStatus;
    const menuLeft = store.getState().widgets.menuLeft;
    if((widgetMenuList && widgetMenuList.length == 0)|| !display || modeType === 'pan'  )
    {
      return;
    }
    
    if (
      menuLeft >
      document.body.clientWidth -
      (document as any).querySelector('#widgetMenuGroup').offsetWidth
    ) {
      let mleft =
        document.body.clientWidth -
        (document as any).querySelector('#widgetMenuGroup').offsetWidth -
        20;

      if (isLock) {
        mleft += store.getState().widgets.menuWidth;
      }
      setLeft(mleft || 400);
    }
  }, [display, widgetMenuList]);

  // const handleWheel = e => {
  //   store.dispatch(handleWidgetMenuDisplay(false))
  //   //todo: this line might be moved to a more appropriate place if I know the reason why it is here.
  //   handlePreventDefaultEvent(e);
  // };

  // React.useEffect(() => {
  //   const widgetMenuRef = document.getElementById('widgetMenuList');
  //   widgetMenuRef.addEventListener('wheel', handleWheel);

  //   return () => {
  //     widgetMenuRef.removeEventListener('wheel', handleWheel);
  //   };
  // }, []);

  return (
    <StyledEngineProvider injectFirst>
      {
        (widgetMenuList && widgetMenuList.length > 0 && display && modeType !== 'pan') ?  <div
        id="widgetMenuList"
      >
        <ToggleButtonGroup
          id="widgetMenuGroup"
          onChange={handleFormat}
          size="small"
          style={{
            position: 'fixed',
            float: 'left',
            display: 'flex',
            background: 'white',
            height: '44px',
            // padding: '4px',
            maxWidth: '100%',
            left,
            top,
            boxShadow: '0px 1px 3px 2px #00000014',
            alignItems: 'center',
            zIndex: 1200,
            overflow: 'hidden',
          }}
          value={formats}
        >
          {widgetMenuList.includes('switchNoteType') ? (
            <SwitchNoteType paddingLeft={16} paddingRight={16} />
          ) : null}
          {widgetMenuList.includes('crop') &&
          canvas.getActiveObjects().length === 1 ? (
            <CropImage />
          ) : null}
          {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('switchNoteType') ? (
            <BorderLineIcon style={{ position: 'relative' }} />
          ) : null}
          {widgetMenuList.includes('resetDraw') ? <ResetDraw /> : null}
          {widgetMenuList.includes('textToMultipleStickyNotes') ? (
            <TextToMultipleStickyNotes />
          ) : null}
          {/* --- */}
          {widgetMenuList.includes('changeFont') ? (
            <Font font={font} paddingLeft={0} paddingRight={0} />
          ) : null}
          {widgetMenuList.includes('fontSize') ? (
            <FontSize
              fontSize={fontSize}
              paddingLeft={16}
              paddingRight={
                canvas.getActiveObject() &&
                (canvas.getActiveObject().obj_type === 'WBText' ||
                  canvas.getActiveObject().obj_type === 'WBShapeNotes')
                  ? 16
                  : 8
              }
            />
          ) : null}
          {widgetMenuList.includes('fontSize') &&
          canvas.getActiveObject() &&
          (canvas.getActiveObject().obj_type === 'WBText' ||
            canvas.getActiveObject().obj_type === 'WBShapeNotes') ? (
            <BorderLineIcon style={{ position: 'relative', left: 8 }} />
          ) : null}
          {widgetMenuList.includes('fontWeight') ? (
            <FontWeight
              fontWeight={fontWeight}
              paddingLeft={
                canvas.getActiveObject() &&
                (canvas.getActiveObject().obj_type === 'WBText' ||
                  canvas.getActiveObject().obj_type === 'WBShapeNotes')
                  ? 16
                  : 8
              }
              paddingRight={8}
            />
          ) : null}

          {widgetMenuList.includes('noteDrawColor') ? (
            <ColorWidget
              color={noteDrawColor}
              objectType="noteDrawColor"
              opacityValue={opacityValue}
            />
          ) : null}
          {widgetMenuList.includes('textAlign') ? (
            <FormatAlign
              paddingLeft={8}
              paddingRight={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBText'
                  ? 8
                  : 16
              }
            />
          ) : null}
          {widgetMenuList.includes('fontColor') ? (
            <ColorWidget
              color={fontColor}
              data-cy="fontColor"
              objectType="fontColor"
              opacityValue={opacityValue}
              paddingLeft={8}
              paddingRight={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBText'
                  ? 16
                  : 8
              }
            />
          ) : null}
          {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('textAlign') ? (
            <BorderLineIcon style={{ position: 'relative' }} />
          ) : null}
          {/* {widgetMenuList.includes('applyFormat') ? <ApplyFormat /> : null}
          {widgetMenuList.includes('applyFormat') ? (
            <BorderLineIcon style={{ position: 'relative' }} />
          ) : null} */}
          {widgetMenuList.includes('alignGroup') ? (
            <AlignGroup paddingLeft={8} paddingRight={16}></AlignGroup>
          ) : null}
          {widgetMenuList.includes('connectorShape') ? (
            <ConnectorShape paddingLeft={16} paddingRight={8} />
          ) : null}
          {widgetMenuList.includes('connectorStyle') ? (
            <ConnectorStyle paddingLeft={8} paddingRight={8} />
          ) : null}
          {widgetMenuList.includes('connectorTip') ? (
            <ConnectorTips paddingLeft={8} paddingRight={8} />
          ) : null}
          {widgetMenuList.includes('drawOption') ? (
            <DrawOption paddingLeft={8} paddingRight={8} />
          ) : null}
          {widgetMenuList.includes('lineWidth') ? (
            <LineWidth
              paddingLeft={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBPath'
                  ? 16
                  : 8
              }
              paddingRight={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBShapeNotes'
                  ? 16
                  : 8
              }
            />
          ) : null}
          {widgetMenuList.includes('borderLineIcon') &&
          canvas.getActiveObject() &&
          canvas.getActiveObject().obj_type === 'WBShapeNotes' ? (
            <BorderLineIcon style={{ position: 'relative', left: 8 }} />
          ) : null}
          {widgetMenuList.includes('newLayout') ? (
            <NewLayout paddingLeft={8} paddingRight={8} />
          ) : null}
          {widgetMenuList.includes('borderLineIcon') ? null : null}
          {widgetMenuList.includes('backgroundColor') ? (
            <ColorWidget
              color={backgroundColor}
              data-cy="backgroundColor"
              objectType="backgroundColor"
              opacityValue={opacityValue}
              paddingLeft={16}
              paddingRight={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBText'
                  ? 16
                  : 8
              }
            />
          ) : null}
          {widgetMenuList.includes('emojiMenu') ? (
            <EmojiMenu paddingLeft={8} paddingRight={16} />
          ) : null}

          {widgetMenuList.includes('fillColor') ? (
            <ColorWidget
              color={fillColor}
              objectType="fillColor"
              opacityValue={opacityValue}
              paddingLeft={8}
              paddingRight={16}
            />
          ) : null}
          {widgetMenuList.includes('strokeColor') ? (
            <ColorWidget
              color={strokeColor}
              objectType="strokeColor"
              opacityValue={opacityValue}
              paddingLeft={8}
              paddingRight={16}
            />
          ) : null}
          {widgetMenuList.includes('shapeBorderColor') ? (
            <ColorWidget
              color={shapeBorderColor}
              objectType="shapeBorderColor"
              opacityValue={opacityValue}
              paddingLeft={8}
              paddingRight={16}
            />
          ) : null}
          {widgetMenuList.includes('shapeBackgroundColor') ? (
            <ColorWidget
              color={shapeBackgroundColor}
              objectType="shapeBackgroundColor"
              opacityValue={opacityValue}
              paddingLeft={8}
              paddingRight={16}
            />
          ) : null}
          {widgetMenuList.includes('oldShapeBackgroundColor') ? (
            <ColorWidget
              color={oldShapeBackgroundColor}
              objectType="oldShapeBackgroundColor"
              opacityValue={opacityValue}
              paddingLeft={8}
              paddingRight={8}
            />
          ) : null}
          {widgetMenuList.includes('polylineArrowColor') ? (
            <ColorWidget
              color={polylineArrowColor}
              objectType="polylineArrowColor"
              opacityValue={opacityValue}
              paddingLeft={8}
              paddingRight={8}
            />
          ) : null}
          {widgetMenuList.includes('borderLineIcon') ? (
            <BorderLineIcon style={{ position: 'relative' }} />
          ) : null}
          {widgetMenuList.includes('fileName') ? (
            <FileName
              fileName={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBFile'
                  ? canvas.getActiveObject().name
                  : undefined
              }
            />
          ) : null}
          {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('fileDownload') ? (
            <BorderLineIcon style={{ position: 'relative' }} />
          ) : null}
          {widgetMenuList.includes('fileDownload') ? (
            <FileDownload
              fileDownloadSrc={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBFile'
                  ? canvas.getActiveObject().fileSrc
                  : undefined
              }
              fileName={
                canvas.getActiveObject() &&
                canvas.getActiveObject().obj_type === 'WBFile'
                  ? canvas.getActiveObject().name
                  : undefined
              }
            />
          ) : null}
          {widgetMenuList.includes('borderLineIcon') &&
          widgetMenuList.includes('fileDownload') ? (
            <BorderLineIcon style={{ position: 'relative' }} />
          ) : null}
          {widgetMenuList.includes('objectLock') ? (
            <ObjectLock paddingLeft={16} paddingRight={16} />
          ) : null}
          {widgetMenuList.includes('delete') ? (
            <Delete paddingLeft={16} paddingRight={16} />
          ) : null}
          {widgetMenuList.includes('aiassist') ? (
            <AIAssist />
          ) : null}
          {widgetMenuList.includes('audioToText')   ? (
            <AudioToTextAI paddingLeft={16} paddingRight={16} />
          ) : null}
        </ToggleButtonGroup>
      </div> : null 
      }
   
    </StyledEngineProvider>
  );
};
