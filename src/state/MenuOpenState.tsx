/* eslint-disable no-undef */
import React, { createContext, useContext, useState } from 'react';
import PropTypes from 'prop-types';
import { useTranslation } from 'react-i18next';

const MenuOpenContext = createContext(undefined);

const useMenuOpen = () => {
  const { t } = useTranslation();
  const context = useContext(MenuOpenContext);

  if (!context) {
    throw new Error(t('state.menu'));
  }

  return context;
};

function MenuOpenProvider({ menuOpen: initMenuOpen, children }) {
  const value = useState(initMenuOpen);
  return (
    <MenuOpenContext.Provider value={value}>
      {children}
    </MenuOpenContext.Provider>
  );
}

MenuOpenProvider.propTypes = {
  menuOpen: PropTypes.bool.isRequired,
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]).isRequired,
};

export { MenuOpenProvider, useMenuOpen };
