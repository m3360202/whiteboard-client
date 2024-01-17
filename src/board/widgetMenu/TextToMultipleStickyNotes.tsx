import TextToMultipleStickyNotesIcon from '../../mui/icons/TextToMultipleStickyNotesIcon';
import { styled } from '@mui/material/styles';
import React from 'react';
import ToggleButton from '@mui/material/ToggleButton';

//** Import i18n
import { useTranslation } from 'react-i18next';

//** Import Redux kit
import store, { RootState } from '../../store';
import { useSelector, useDispatch } from 'react-redux';


export default function () {

  const dispatch = useDispatch();
  const { t } = useTranslation();
  const handleClickTextToMultipleStickyNotes = async () => {
    let textContent = canvas.getActiveObject()?.text;
    textContent = textContent?.split('\n');
    textContent = textContent?.filter(item => item.trim() !== '');
    if(textContent) {
      textContent = textContent.filter(item => item.trim() !== '');
      canvas.createMutipleStickyNotesByLocation(
        textContent,
        canvas.getActiveObject()
      );
      Boardx.Util.Msg.success(
        t('widgetAi.textToMultipleStickyNotesSuccessfully')
      );
    }
    else {
      Boardx.Util.Msg.warning(
        t('widgetAi.pleaseSelectTheTextBoxWithContent')
      );
    }
  };

  return (
    <div>
      <ToggleButton
        id="textToMultipleStickyNotesIcon"
        aria-label="bold"
        sx={{  borderRightWidth: 1,
          width: 40,
          paddingTop: '14px',
          paddingBottom: '14px',
          color: '#150d33'}}
        onClick={handleClickTextToMultipleStickyNotes}
        selected={false}
        value="textToMultipleStickyNotes"
      >
        <TextToMultipleStickyNotesIcon />
      </ToggleButton>
    </div>
  );
}
