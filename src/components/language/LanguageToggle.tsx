/* eslint-disable max-len */
/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { styled } from '@mui/material/styles';
import { useTranslation } from 'react-i18next';
import clsx from 'clsx';
import { BX_LANG_PREF_KEY, STORAGE } from '../../services/SysService';
import getLanguages from '../../util/languages/methods';
import { useLocale } from '../../state/LocaleState';
import i18n from '../../i18n';
import Box from '@mui/material/Box';

function LanguageToggle() {

  const [languages, setLanguages] = useState([]);
  const locale = STORAGE.getItem(BX_LANG_PREF_KEY) || useLocale().locale;

  useEffect(() => {
    if (locale) {
      i18n.changeLanguage(locale);
    }
  });

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

  const fullLangName = {
    en: 'English',
    'zh-CN': '中文',
    fr: 'français',
  };

  return (
    <Box sx={{ textAlign: 'center',
    marginTop: '1em',
    fontSize: '1rem',
    color: '#A6a6a6',
    '& $language': {
      margin: '0 5px 0 0',
      color: '#A6a6a6',
      textDecoration: 'none'},
      '.language': {
        margin: '0 5px 0 0',
        color: '#A6a6a6',
        textDecoration: 'none',
      },
      '.active': {
        borderBottom: '1px solid',
        paddingBottom: '1px',
        color: '#f21d6b',
      }}}>

      {['en', 'zh-CN', 'fr'].map((language) => {
        let content;
        if (language === locale) {
          content = (
            <span
              className={clsx('language', 'active')}
              key={language}
            >
              {fullLangName[language]}
            </span>
          );
        } else {
          content = (
            <a
              className={'language'}
              href="#toggle-language"
              key={language}
              onClick={(event) => setI18nLocale(event, language)}
            >
              {fullLangName[language]}
            </a>
          );
        }
        return content;
      })}
    </Box>
  );
}

export default LanguageToggle;
