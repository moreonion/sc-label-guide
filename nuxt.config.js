module.exports = {
  router: {
    middleware: 'lang'
  },
  /*
  ** Headers of the page
  */
  head: {
    title: 'Label Guide',
    meta: [
      { charset: 'utf-8' },
      { name: 'viewport', content: 'width=device-width, initial-scale=1' },
      { hid: 'description', name: 'description', content: 'Nuxt.js project' }
    ],
    link: [
      { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#3B8070'},
  /*
  ** Build configuration
  */
  plugins: ['~plugins/vue-i18n.js', '~plugins/globalComponents.js', '~plugins/mo-vue-table', '~plugins/element-ui'],
  build: {
    vendor: ['locale', 'locale2', 'vue-i18n', 'i18n-iso-countries', 'qs', 'axios', 'element-ui', 'mo-vue-table', 'lodash.debounce', 'lodash.zip', 'lodash.unzip', 'lodash.reduce'],
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      if(ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }
    }
  }
}
