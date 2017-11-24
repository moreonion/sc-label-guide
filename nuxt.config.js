const webpack = require('webpack')

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
      // { rel: 'icon', type: 'image/x-icon', href: '/favicon.ico' }
    ]
  },
  /*
  ** Customize the progress-bar color
  */
  loading: {color: '#3B8070'},
  /*
  ** Build configuration
  */
  plugins: [
    '~plugins/vue-i18n.js',
    '~plugins/globalComponents.js',
    '~plugins/mo-vue-table.js',
    '~plugins/element-ui.js',
    '~plugins/vue-async-computed.js',
    { src: '~plugins/piwik.js', ssr: false }
  ],
  build: {
    vendor: [
      'locale', 'locale2',
      'vue-i18n', 'i18n-iso-countries',
      'qs', 'axios', 'vue-markdown',
      'element-ui', 'mo-vue-table',
      'vue-async-computed',
      'lodash.debounce', 'lodash.zip',
      'lodash.unzip', 'lodash.reduce',
      'lodash.uniq'
    ],
    /*
    ** Run ESLINT on save
    */
    extend(config, ctx) {
      config.module.rules.push({
        test: /\.md$/,
        use: [
          {loader: 'raw-loader'}
        ]
      })

      if(ctx.isClient) {
        config.module.rules.push({
          enforce: 'pre',
          test: /\.(js|vue)$/,
          loader: 'eslint-loader',
          exclude: /(node_modules)/
        })
      }

      config.plugins.push(new webpack.NormalModuleReplacementPlugin(/element-ui[\/\\]lib[\/\\]locale[\/\\]lang[\/\\]zh-CN/, 'element-ui/lib/locale/lang/en'))
    }
  }
}
