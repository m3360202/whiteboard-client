import i18n from "i18next";
import { initReactI18next } from "react-i18next";

i18n.use(initReactI18next).init({
    resources: {
        en: {
            translation: require('./i18n/en.i18n.json')
        },
        'zh-CN': {
            translation: require('./i18n/zh-cn.i18n.json')
        },
    },
    lng: "en",
    fallbackLng: "en",

    interpolation: {
        escapeValue: false
    }
});

export default i18n;