/* eslint-disable no-undef */
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';

//* i18n */
import i18n from '../i18n';
import { useTranslation } from 'react-i18next';

const TagContext = createContext(undefined);
const { t } = useTranslation();

const useTag = () => {
  const context = useContext(TagContext);

  if (!context) {
    throw new Error(t('state.tag'));
  }

  return context;
};

const TagProvider = ({ tag: initTag, children }) => {
  const value = useState(initTag);
  return <TagContext.Provider value={value}>{children}</TagContext.Provider>;
};

TagProvider.propTypes = {
  tag: PropTypes.string.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { TagProvider, useTag };