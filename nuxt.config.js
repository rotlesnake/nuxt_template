import colors from 'vuetify/es5/util/colors'
require('dotenv').config({ path: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production' });

export default {
  loading: { color: '#fff' },

  mode: 'spa',
  target: 'server',

  head: {
    titleTemplate: '%s - ' + process.env.appName,
    title: process.env.appName || '',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: process.env.npm_package_description || '' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },

  css: [
  ],

  plugins: [
    "@/plugins/vuetify.js",
    "@/plugins/api.js",
    "@/plugins/axios.js",
    "@/plugins/i18n.js",
  ],

  components: true,


  buildModules: [
      ['@nuxtjs/dotenv', { filename: process.env.NODE_ENV === 'development' ? '.env.development' : '.env.production' }],
      '@nuxtjs/vuetify',
      '@nuxtjs/moment',
  ],
  modules: [
      '@nuxtjs/axios',
      'nuxt-sweetalert2',
  ],

  axios: {
      retry: { retries: 3 },
      baseURL: process.env.backendURL,
  },

  moment: {
    defaultLocale: 'ru',
    locales: ['ru', 'en-ca']
  },


  router:{
      base: process.env.routeURL,
      middleware: ['auth'],
  },



  /*
  ** Build configuration
  ** See https://nuxtjs.org/api/configuration-build/
  */
  build: {
  }
}
