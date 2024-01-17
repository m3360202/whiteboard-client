import React from 'react';
import { useTranslation } from 'react-i18next';
import { useMenuOpen } from '../../state/MenuOpenState';

function MobileMenu() {
  const [menuOpen, setMenuOpen] = useMenuOpen();
  const { t } = useTranslation();
  const toggleMenu = () => {
    setMenuOpen(!menuOpen);
  };

  return (
    <div className="nav-group">
      <a className="nav-item" href="#toggle-menu" onClick={toggleMenu}>
        <span
          className="icon-list-unordered"
          title={t('components.mobileMenu.showMenu')}
        />
      </a>
    </div>
  );
}

export default MobileMenu;
