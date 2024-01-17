import React from 'react';
import PropTypes from 'prop-types';
import uuid from 'uuid';
import { LocaleProvider } from './LocaleState';
import { MenuOpenProvider } from './MenuOpenState';
import { TagProvider } from './TagState';

export function GlobalStateProvider({ menuOpen, children, tag }) {
  return (
    <LocaleProvider>
      <MenuOpenProvider menuOpen={menuOpen}>
        <TagProvider tag={tag}>{children}</TagProvider>
      </MenuOpenProvider>
    </LocaleProvider>
  );
}
 