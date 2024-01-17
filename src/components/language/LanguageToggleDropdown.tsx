/* eslint-disable no-undef */
import React, { useEffect, useState } from 'react';
import { useTranslation } from 'react-i18next';
import Select from '@mui/material/Select';
import LanguageIcon from '@mui/icons-material/Language';
import getLanguages from '../../util/languages/methods';
import { useLocale } from '../../state/LocaleState';
import { BX_LANG_PREF_KEY, STORAGE } from '../../services/SysService';
import i18n from '../../i18n';

function LanguageToggleDropdown() {
  const [, setLanguages] = useState([]);
  const locale = STORAGE.getItem(BX_LANG_PREF_KEY) || useLocale()[0];
  useEffect(() => {
    if (locale) {
      
      i18n.changeLanguage(locale);
    }
  }, []);

  useEffect(() => {
    getLanguages.call((error, newLanguages) => {
      if (!error) {
        setLanguages(newLanguages);
      }
    });
  }, []);

  const setI18nLocale = (event, language) => {
    event.preventDefault();
    if (language) {
      i18n.changeLanguage(language);
      STORAGE.setItem(BX_LANG_PREF_KEY, language);
    }
  };

  const onChange = (event) => {
    setI18nLocale(event, event.target.value);
    window.location.reload();
  };

  return (
    <div style={{ alignSelf: 'center' }}>
      <LanguageIcon style={{ verticalAlign: 'middle' }} />
      <Select
        defaultValue={locale}
        native
        onChange={onChange}
        variant="standard"
      >
        <option value="en">English</option>
        <option value="zh-CN">中文</option>
      </Select>
    </div>
  );
}

export default LanguageToggleDropdown;
