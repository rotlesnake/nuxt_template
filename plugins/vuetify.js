import Vue from 'vue';
import Vuetify from 'vuetify';
import VuePageTransition from 'vue-page-transition'

import ru from 'vuetify/lib/locale/ru'

import '@mdi/font/css/materialdesignicons.css'
import 'material-design-icons-iconfont/dist/material-design-icons.css'
import '@fortawesome/fontawesome-free/css/all.css'

Vue.use(Vuetify);
Vue.use(VuePageTransition);


export default ctx => {
const vuetify = new Vuetify({
  icons: {
    iconfont: 'mdi' || 'md' || 'fa',
  },
  lang: {
    locales: {ru},
    current: 'ru'
  },  
  theme: {
    dark: true,
    themes: {
        light: {
            toolbar: '#FFFFFF',
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
        },
        dark: {
            toolbar: '#666',
            primary: '#1976D2',
            secondary: '#424242',
            accent: '#82B1FF',
            error: '#FF5252',
            info: '#2196F3',
            success: '#4CAF50',
            warning: '#FFC107',
        },
    },
  },
});
  ctx.app.vuetify = vuetify;
  ctx.$vuetify = vuetify.framework;
}
