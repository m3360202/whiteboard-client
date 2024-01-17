import React, { useEffect } from 'react';
import { styled } from '@mui/material/styles';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ListItemIcon from '@mui/material/ListItemIcon';
import BrushOutlinedIcon from '@mui/icons-material/BrushOutlined';
import TitleIcon from '@mui/icons-material/Title';
import ToggleButton from '@mui/material/ToggleButton';
import showMenu from './ShowMenu';
import StickyNoteIcon from '../../mui/icons/StickyNoteIcon';
import TextNoteIcon from '../../mui/icons/TextNoteIcon';
import ArrowIcon from '../../mui/svg/ArrowIcon';
import { useTranslation } from 'react-i18next';
//** Import Redux toolkit
import store, { RootState } from '../../store';
import { handleSetDropdownDisplayed } from '../../store/widgets'
import { useSelector } from 'react-redux';
import { handleSetGetOptions} from '../../store/board';

const menuItems = [
  {
    iconCss: 'em-icons e-file',
    items: [
      { text: 'Open', iconCss: 'em-icons e-open' },
      { text: 'Save', iconCss: 'e-icons e-save' },
      { separator: true },
      { text: 'Exit' },
    ],
    text: 'File',
  },
  {
    iconCss: 'em-icons e-edit',
    items: [
      { text: 'Cut', iconCss: 'em-icons e-cut' },
      { text: 'Copy', iconCss: 'em-icons e-copy' },
      { text: 'Paste', iconCss: 'em-icons e-paste' },
    ],
    text: 'Edit',
  },
  {
    items: [{ text: 'Toolbar' }, { text: 'Sidebar' }, { text: 'Full Screen' }],
    text: 'View',
  },
  {
    items: [
      { text: 'Spelling & Grammar' },
      { text: 'Customize' },
      { text: 'Options' },
    ],
    text: 'Tools',
  },
  { text: 'Go' },
  { text: 'Help' },
];

export default function SwitchNoteType ({ paddingLeft, paddingRight }) {

  const { t } = useTranslation();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [selectedNoteType, setSelectedNoteType] = React.useState('');
  const [options, setOptions] = React.useState(null);
  const getOptions = useSelector((state: RootState) => state.board.getOptions);
  const optionsText = [
    { id: 1, text: t('board.contextMenu.3X3Note'), value: '33' },
    { id: 2, text: t('board.contextMenu.5X3Note'), value: '53' },
    { id: 3, text: t('board.contextMenu.circleNote'), value: 'circle' },
    { id: 5, text: t('board.contextMenu.text'), value: 'text' },
  ];

  const optionsDraw = [
    { id: 6, text: t('board.contextMenu.textModel'), value: 'texting' },
    { id: 1, text: t('board.contextMenu.3X3Note'), value: '33' },
    { id: 2, text: t('board.contextMenu.5X3Note'), value: '53' },
    { id: 3, text: t('board.contextMenu.circleNote'), value: 'circle' },
    { id: 5, text: t('board.contextMenu.text'), value: 'text' },
  ];
  useEffect(() => {
    let op = getOptions || optionsText;
    setOptions(op);
  }, [getOptions])
  const handleClick = (event) => {
    const { isDraw } = canvas.getActiveObject();
    if (!isDraw){
      store.dispatch(handleSetGetOptions(optionsText));
    }
    else{
      store.dispatch(handleSetGetOptions(optionsDraw));
    }
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleBlur = (e) => {
    store.dispatch(handleSetDropdownDisplayed(false));
  };

  const handleFocus = (e) => {
    store.dispatch(handleSetDropdownDisplayed(true));
  };

  const handleChange = (event) => {
    const { isDraw } = canvas.getActiveObject();
    if (!isDraw){
      store.dispatch(handleSetGetOptions(optionsText));
    }
    else{
      store.dispatch(handleSetGetOptions(optionsDraw));
    }
  };

  const changeToDrawMode = (e) => {
    e.preventDefault();
    const widget = canvas.getActiveObject();

    widget.initializeDrawOnStickyNote();
  };

  const changeToTextNodeMode = (e) => {
    e.preventDefault();
    const widget = canvas.getActiveObject();

    if (
      widget.obj_type !== 'WBRectNotes' &&
      widget.obj_type !== 'WBCircleNotes'
    ) {
      return;
    }

    const { defaultNote } = canvas;
    defaultNote.isDraw = false;
    canvas.changeDefaulNote(defaultNote);

    widget.set('isDraw', false);
    widget.dirty = true;

    widget.saveData('MODIFIED', ['isDraw']);
    canvas.unlockObjectsInCanvas();
    $('#notesDrawCanvas').hide();
    $('#notesDrawCanvas').next().hide();
    showMenu();
    canvas.requestRenderAll();
    setAnchorEl(null);
  };

  const switchType = (e, index, value) => {
    if (value === 'drawing') {
      changeToDrawMode(e);
      showMenu();
      setAnchorEl(null);
      return;
    }
    if (value === 'texting') {
      changeToTextNodeMode(e);
      return;
    }
    setSelectedNoteType(value);
    e.preventDefault();
    const type = value;
    const objects = canvas.getActiveObjects();
    handleClose();
    canvas.switchNoteType(objects, type);
  };

  const handleMenuItemDOM = () =>
    options?.map((option, id) => (
      <MenuItem
        data-cy={option.text}
        key={option.text}
        onClick={(event) => switchType(event, id, option.value)}
      >
        <ListItemIcon sx={{   minWidth: '35px',}}>
          {option.text === t('board.contextMenu.3X3Note') ? (
            <StickyNoteIcon />
          ) : null}
          {option.text === t('board.contextMenu.5X3Note') ? (
            <StickyNoteIcon />
          ) : null}
          {option.text === t('board.contextMenu.circleNote') ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 16 16"
              strokeWidth="1"
              className="widgetMenuImgSize"
            >
              <g transform="matrix(0.6666666666666666,0,0,0.6666666666666666,0,0)">
                <path
                  d="M0.750 12.000 A11.250 11.250 0 1 0 23.250 12.000 A11.250 11.250 0 1 0 0.750 12.000 Z"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          ) : null}
          {option.text === t('board.contextMenu.text') ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 20 20"
              strokeWidth="1"
              className="widgetMenuImgSize"
            >
              <g transform="matrix(0.8333333333333334,0,0,0.8333333333333334,0,0)">
                <path
                  d="M1.5,3.748V3A2.25,2.25,0,0,1,3.75.748h16.5A2.25,2.25,0,0,1,22.5,3v.75"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M12 0.748L12 23.248"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
                <path
                  d="M7.5 23.248L16.5 23.248"
                  fill="none"
                  stroke="#000000"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                />
              </g>
            </svg>
          ) : null}
          {option.text === t('board.contextMenu.drawingMode') ? (
            <BrushOutlinedIcon />
          ) : null}
          {option.text === t('board.contextMenu.textMode') ? (
            <TitleIcon />
          ) : null}
        </ListItemIcon>
        {option.text}
      </MenuItem>
    ));
  return (
    <div>
      <div
        className={'customClass'}
        style={{ paddingLeft, paddingRight }}
        onClick={handleClick}
      >
        <ToggleButton
          aria-label="bold"
         sx={{ borderRightWidth: 1,
          borderRightColor: '#150D33',
          paddingLeft: 0,
          paddingRight: 0,
          height: 44,
        }}
          data-cy="switchNoteType"
          selected={false}
          value="switchNoteType"
        >
          {canvas.getActiveObject() &&
          (canvas.getActiveObject().obj_type === 'WBRectNotes' ||
            canvas.getActiveObject().obj_type === 'WBCircleNotes') ? (
            <StickyNoteIcon />
          ) : (
            <TextNoteIcon />
          )}
          <ArrowIcon />
        </ToggleButton>
      </div>
      <Menu
        anchorEl={anchorEl}
        sx={{ top: 4 }}
        id="simple-menu-note"
        keepMounted
        onBlur={handleBlur}
        onChange={handleChange}
        onClose={handleClose}
        onFocus={handleFocus}
        open={Boolean(anchorEl)}
      >
        {handleMenuItemDOM()}
      </Menu>
    </div>
  );
}
