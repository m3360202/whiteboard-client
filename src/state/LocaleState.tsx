/* eslint-disable no-undef */
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';
import i18n from '../i18n';

const defaultLocale = i18n.language.substr(0, 2); 

const { t } = useTranslation();

const LocaleContext = createContext(undefined);

const useLocale = () => {
  const context = useContext(LocaleContext);
  if (!context) {
    throw new Error(t('state.locale'));
  }
  return context;
};

function LocaleProvider({ children }) {
  const value = useState(defaultLocale);
  return (
    <LocaleContext.Provider value={value}>{children}</LocaleContext.Provider>
  );
}

LocaleProvider.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { LocaleProvider, useLocale };
