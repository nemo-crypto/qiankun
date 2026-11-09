const webpack = require('webpack')
const createConfig = require('../config/webpack.cjs')
const { apps } = require('../config/settings.cjs')
const selected = process.argv[2] ? apps.filter(app => app.name === process.argv[2]) : apps
if (!selected.length) { console.error('未知应用'); process.exit(1) }
const compiler = webpack(selected.map(app => createConfig(app, true)))
compiler.run((error, stats) => {
  const failed = error || stats?.hasErrors()
  if (error) console.error(error)
  if (stats) console.log(stats.toString({ colors: process.stdout.isTTY, preset: 'errors-warnings' }))
  compiler.close(closeError => {
    if (closeError) console.error(closeError)
    if (failed || closeError) process.exitCode = 1
    else console.log('构建完成：dist/main + dist/subapp；npm run preview 可验证生产产物。')
  })
})
