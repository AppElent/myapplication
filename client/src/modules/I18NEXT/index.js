
import i18n from 'i18next';
import LanguageDetector from 'i18next-browser-languagedetector';

i18n.use(LanguageDetector).init({
  // we init with resources
  resources: {
    en: {
      translations: {
        'greet': 'Hello',
        'greetName': 'Hello {{name}}',
        footertext: '',
        signin: {
          text: 'Login or create account'
        },
        navigation: {
          account: 'Account',
          meterstanden: 'Meter readings',
          rekeningen: 'Bills',
          bunq: 'Bunq',
          events: 'Events'
        },
        buttons: {
          cancel: 'Cancel',
          save: 'Save',
          login: 'Login',
          logout: 'Logout',
          new: 'New',
          connect: 'Connect',
          delete: 'Delete'
        },
        profile: {
          name: 'Name', 
          email: 'E-mailaddress',
          phone: 'Phone number',
          language: 'Language'
        },
        notifications: {
          no_notifications: 'There are no notifications'
        }
      }
    },
    nl: {
      translations: {
        'greet': 'Hallo',
        'greetName': 'Hallo {{name}}',
        footertext: '',
        signin: {
          text: 'Log in of maak een account aan.'
        },
        navigation: {
          account: 'Profiel',
          meterstanden: 'Meterstanden',
          rekeningen: 'Rekeningen',
          bunq: 'Bunq',
          events: 'Events'
        },
        buttons: {
          cancel: 'Annuleer',
          save: 'Sla op',
          login: 'Log in',
          logout: 'Log uit',
          new: 'Nieuw',
          connect: 'Verbind',
          delete: 'Verwijder'
        },
        profile: {
          name: 'Naam', 
          email: 'E-mailadres',
          phone: 'Telefoonnummer',
          language: 'Taal'
        },
        notifications: {
          no_notifications: 'Er zijn geen meldingen'
        }
      }
    }
  },
  fallbackLng: 'en',
  debug: true,

  // have a common namespace used around the full app
  ns: ['translations'],
  defaultNS: 'translations',

  //keySeparator: false, // we use content as keys

  interpolation: {
    escapeValue: false, // not needed for react!!
    formatSeparator: ','
  },

  react: {
    wait: true
  }
});

export default i18n;