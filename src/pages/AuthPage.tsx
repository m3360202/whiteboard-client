//** Import React
import React from 'react';

//** Import MUI
import PropTypes from 'prop-types';
import MobileMenu from '../components/mobile/MobileMenu';

// a common layout wrapper for auth pages
function AuthPage({ children, link }) {
  return (
    <div className="page auth">
      <nav>
        <MobileMenu />
      </nav>
      <div className="content-scrollable">
        {children}
        {link}
      </div>
    </div>
  );
}

AuthPage.propTypes = {
  children: PropTypes.element.isRequired,
  link: PropTypes.element.isRequired,
};

export default AuthPage;
