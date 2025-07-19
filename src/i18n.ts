import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import i18next from "i18next";

const resources = {
    en: {
        // translation: todosLang,
    },
};

i18next.use(initReactI18next).init({
    resources,
    lng: "en", //default language
});

export default i18n;
