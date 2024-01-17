import React from 'react';
import { useTranslation } from 'react-i18next';
const { t } = useTranslation();
function Loading() {
  return (
    <img
      alt={t('components.loading.loading')}
      className="loading-app"
      src="/images/logoengine.svg"
    />
  );
}

export default Loading;
