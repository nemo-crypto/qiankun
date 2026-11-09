const webpack = require('webpack')
const WebpackDevServer = require('webpack-dev-server')
const createConfig = require('../config/webpack.cjs')
const { apps, host } = require('../config/settings.cjs')
const selected = process.argv[2] ? apps.filter(app => app.name === process.argv[2]) : apps
const servers = []
let stopping = false
async function stop(code = 0) {
  if (stopping) return
  stopping = true
  await Promise.allSettled(servers.map(server => server.stop()))
  process.exit(code)
}
process.on('SIGINT', () => stop())
process.on('SIGTERM', () => stop())
;(async () => {
  if (!selected.length) throw new Error(`未知应用: ${process.argv[2]}`)
  for (const app of selected) {
    const server = new WebpackDevServer({
      host, port: app.port, hot: false, liveReload: true,
      headers: { 'Access-Control-Allow-Origin': '*' },
      historyApiFallback: true, static: false,
      client: { overlay: { errors: true, warnings: false, runtimeErrors: false }, logging: 'warn' },
      devMiddleware: { stats: 'errors-warnings' }
    }, webpack(createConfig(app)))
    servers.push(server)
    await server.start()
  }
  console.log('\n微前端工作台已启动（首次编译完成后访问）：')
  for (const app of selected) console.log(`  ${app.name.padEnd(12)} http://${host === '0.0.0.0' ? 'localhost' : host}:${app.port}`)
  console.log('\n按 Ctrl+C 关闭全部服务。\n')
})().catch(async error => {
  console.error(`启动失败：${error.message}\n如果端口被占用，请关闭占用进程或修改根目录 .env。`)
  await stop(1)
})
