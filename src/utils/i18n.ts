import i18n from "i18next";
import { initReactI18next } from "react-i18next";
import detector from "i18next-browser-languagedetector";

// the translations
// (tip move them in a JSON file and import them,
// or even better, manage them separated from your code: https://react.i18next.com/guides/multiple-translation-files)
const resources = {
  en: {
    translation: {
      Home: "Home",
      ProductCatalog: "Products catalog",
      AboutUs: "Information for the client",
      HomeBanner: "We don't just create bouquets - we create emotions",
      PopularProducts: {
        header: "Popular products",
        next: "Go to catalog",
      },
      CategoriesCatalog: "Categories catalog",
      NewProducts: {
        header: "New products",
        next: "Go to catalog",
      },
      Auth: {
        login: "Log in",
        logout: "Logout",
        LoginForm: {
          header: "Log in",
          email: {
            label: "Email",
            placeholder: "Example: your@email.com",
          },
          password: {
            label: "Password",
            placeholder: "Your password",
          },
          loginBtn: "Log in",
          dontHave: {
            text: "Don`t have an account?",
            linkText: "Create",
          },
        },
        RegisterForm: {
          header: "Register",
          email: {
            label: "Email",
            placeholder: "Example: your@email.com",
          },
          password: {
            label: "Password",
            placeholder: "Your password",
          },
          fullName: {
            label: "Full name",
            placeholder: "Your full name",
          },
          phoneNumber: {
            label: "Phone number",
            placeholder: "Example: +380...",
          },
          continueBtn: "Continue",
          registerBtn: "Register an account",
          have: {
            text: "Do you have an account?",
            linkText: "Log in",
          },
        },
      },
    },
  },
  uk: {
    translation: {
      Home: "Головна",
      ProductCatalog: "Каталог товарів",
      AboutUs: "Інформація для клієнта",
      HomeBanner: "Ми не просто створюємо букети - ми створюємо емоції",
      PopularProducts: {
        header: "Популярні товари",
        next: "Перейти в каталог",
      },
      CategoriesCatalog: "Каталог категорій",
      NewProducts: {
        header: "Нові товари",
        next: "Перейти в каталог",
      },
      Auth: {
        login: "Увійти",
        logout: "Вийти",
        LoginForm: {
          header: "Вхід в обліковий запис",
          email: {
            label: "Електронна пошта",
            placeholder: "Приклад: your@email.com",
          },
          password: {
            label: "Пароль",
            placeholder: "Пароль",
          },
          loginBtn: "Увійти",
          dontHave: {
            text: "Немає облікового запису?",
            linkText: "Створити",
          },
        },
        RegisterForm: {
          header: "Створення облікового запису",
          email: {
            label: "Електронна пошта",
            placeholder: "Приклад: your@email.com",
          },
          password: {
            label: "Пароль",
            placeholder: "Пароль",
          },
          fullName: {
            label: "Ім`я та прізвище",
            placeholder: "Ваше ім`я та прізвище",
          },
          phoneNumber: {
            label: "Номер телефону",
            placeholder: "Приклад: +380...",
          },
          continueBtn: "Продовжити",
          registerBtn: "Створити обліковий запис",
          have: {
            text: "Вже є обліковий запис?",
            linkText: "Увійти",
          },
        },
      },
    },
  },
};

i18n
  //   .use(detector)
  .use(initReactI18next) // passes i18n down to react-i18next
  .init({
    resources,
    // you can use the i18n.changeLanguage function to change the language manually: https://www.i18next.com/overview/api#changelanguage
    // if you're using a language detector, do not define the lng option
    keySeparator: false,
    interpolation: {
      escapeValue: false, // react already safes from xss
    },
  });

export default i18n;
