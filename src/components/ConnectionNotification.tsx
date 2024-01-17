import React from 'react';
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();

function ConnectionNotification() {
  return (
    <div className="notifications">
      <div className="notification">
        <span className="icon-sync" />
        <div className="meta">
          <div className="title-notification">
            {t('components.connectionNotification.connectionIssue')}
          </div>
          <div className="description">
            {t('components.connectionNotification.connectionIssue')}
          </div>
        </div>
      </div>
    </div>
  );
}

export default ConnectionNotification;
