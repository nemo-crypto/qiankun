const path = require('node:path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const { VueLoaderPlugin } = require('vue-loader')
const { apps, root } = require('./settings.cjs')
module.exports = function config(app, production = false) {
  const isMain = app.name === 'main'
  const publicPath = production && !isMain ? `/subapp/${app.name}/` : '/'
  return {
    name: app.name,
    mode: production ? 'production' : 'development',
    context: path.join(root, app.name),
    entry: path.join(root, app.name, app.entry),
    devtool: production ? false : 'eval-source-map',
    output: {
      path: path.join(root, 'dist', isMain ? 'main' : `subapp/${app.name}`),
      filename: 'assets/[name].[contenthash:8].js',
      chunkFilename: 'assets/[name].[contenthash:8].js',
      publicPath, clean: true,
      uniqueName: app.name,
      ...(isMain ? {} : { library: { name: app.name, type: 'umd' }, globalObject: 'window' })
    },
    resolve: { extensions: ['.js', '.vue', '.json'], alias: { '@': path.join(root, app.name, 'src') } },
    module: { rules: [
      { test: /\.vue$/, loader: 'vue-loader' },
      { test: /\.js$/, exclude: /node_modules/, use: { loader: 'babel-loader', options: {
        babelrc: false, configFile: false,
        presets: [['@babel/preset-env', { targets: 'defaults' }], '@babel/preset-react']
      } } },
      { test: /\.css$/, use: [{ loader: 'vue-style-loader' }, { loader: 'css-loader', options: { esModule: false } }] },
      { test: /\.(png|svg|jpg|gif|ico)$/, type: 'asset/resource' }
    ] },
    plugins: [
      new VueLoaderPlugin(),
      new HtmlWebpackPlugin({ template: path.join(root, 'config/template.html'), title: isMain ? 'Qiankun · 微前端工作台' : `${app.name} · 独立应用`, scriptLoading: 'blocking' }),
      new webpack.DefinePlugin({
        'process.env.BASE_URL': JSON.stringify(publicPath),
        __APP_PORTS__: JSON.stringify(Object.fromEntries(apps.map(item => [item.name, item.port]))),
        __APP_ENTRIES__: JSON.stringify({
          'sub-vue': process.env.VUE_APP_SUB_VUE || '',
          'sub-react': process.env.VUE_APP_SUB_REACT || '',
          'sub-html': process.env.VUE_APP_SUB_HTML || ''
        })
      })
    ],
    optimization: { splitChunks: false, runtimeChunk: false },
    performance: { hints: false },
    stats: 'errors-warnings'
  }
}
