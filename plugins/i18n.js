import Vue from "vue";
import VueI18n from "vue-i18n";

Vue.use(VueI18n);

export default ({ app }) => {
  app.i18n = new VueI18n({

    locale: "ru",
    fallbackLocale: "en",

    messages: {
      ru: require("@/plugins/i18n/lang-ru.json"),
      en: require("@/plugins/i18n/lang-en.json"),
    }
  });
};

/*
this.$i18n.locale = 'en'; // change locale 

    message: {
      hello: '{msg} world'
    }
    <p>{{ $t('message.hello', { msg: 'hello' }) }}</p> 

*/