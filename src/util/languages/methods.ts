import i18n from '../../i18n';

// universe:i18n only bundles the default language on the client side.
// To get a list of all avialble languages with at least one translation,
// i18n.getLanguages() must be called server side.
const getLanguages = function () {
  return i18n.languages;
};

export default getLanguages;
