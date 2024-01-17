//** Utils  */
import i18n from '../i18n';
import TimeAgo from 'javascript-time-ago';
import en from 'javascript-time-ago/locale/en';
import zh from 'javascript-time-ago/locale/zh';

//** Store  */
import store from '../store';
import { handleSetCurrentUIType, handleSetSettings,handleSetLocalConnection } from '../store/system';

export const STORAGE = window.localStorage;

export const BX_LANG_PREF_KEY = 'boardx-lang-pref';

// set lang based on user's lang
const getFirstBrowserLanguage = function () {

  const nav = window.navigator;

  const browserLanguagePropertyKeys = [
    'language',
    'browserLanguage',
    'systemLanguage',
    'userLanguage'
  ];

  let i;

  let language;

  // support for HTML 5.1 "navigator.languages"
  if (Array.isArray(nav.languages)) {

    for (i = 0; i < nav.languages.length; i++) {
      language = nav.languages[i];
      if (language && language.length) {
        return language;
      }
    }

  }

  // support for other well known properties in browsers
  for (i = 0; i < browserLanguagePropertyKeys.length; i++) {
    language = nav[browserLanguagePropertyKeys[i]];
    if (language && language.length) {
      return language;
    }
  }

  return null;
};

const getLanguages = function () {
  return i18n.languages;
};

const init = async function () {

  // UIMode handler
  // const isMobile = Boardx.Util.mobileAndTabletCheck();
  store.dispatch(handleSetCurrentUIType(localStorage.getItem('currentUIType')));

  store.dispatch(handleSetLocalConnection('connected'));
  const envInfo = Boardx.Util.getEnvironmentInfo();

  // if (envInfo && (envInfo.isTablet || envInfo.isAndroid || envInfo.isPhone || envInfo.isIpad)) {
  if (envInfo && (envInfo.isAndroid || envInfo.isPhone)) {

    localStorage.setItem('currentUIType', 'mobile');

    store.dispatch(handleSetCurrentUIType('mobile'));

  } else if (envInfo.isPc) {

    localStorage.setItem('currentUIType', 'laptop');

    store.dispatch(handleSetCurrentUIType('laptop'));

  }

  // 时间设定
  TimeAgo.addLocale(en);

  TimeAgo.addLocale(zh);

  TimeAgo.setDefaultLocale('en');

  // 获得语言
  const locale = STORAGE.getItem(BX_LANG_PREF_KEY) || getFirstBrowserLanguage();


  if (locale) {
    let lc = locale;
    if (!locale.startsWith('en') && !locale.startsWith('zh')) {
      lc = 'en';
    }

    i18n.changeLanguage(lc);
  }

};

const setLocale = function (language) {

  i18n.changeLanguage(language);

  localStorage.setItem(BX_LANG_PREF_KEY, language);

};

const getLocale = function () {

  return localStorage.getItem(BX_LANG_PREF_KEY);

};

 

export default {
  getLanguages,
  init,
  setLocale,
  getLocale
};