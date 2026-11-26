const fs = require('node:fs')
const path = require('node:path')
const express = require('express')
const { apps, host, port, root } = require('../config/settings.cjs')
const { spaFallback } = require('./spa-fallback.cjs')
for (const app of apps) {
  const folder = path.join(root, 'dist', app.name === 'main' ? 'main' : `subapp/${app.name}`)
  if (!fs.existsSync(path.join(folder, 'index.html'))) {
    console.error('缺少生产产物，请先执行 npm run build。'); process.exit(1)
  }
}
const server = express()
server.disable('x-powered-by')
const site = express.Router()
const siteBase = process.env.PAGES_BASE || '/'
for (const app of apps.filter(app => app.name !== 'main')) {
  const folder = path.join(root, 'dist/subapp', app.name)
  const router = express.Router()
  router.use(express.static(folder))
  router.use(spaFallback(folder))
  site.use(`/subapp/${app.name}`, router)
}
const main = path.join(root, 'dist/main')
site.use(express.static(main))
site.use(spaFallback(main))
server.use(siteBase, site)
const listenPort = port(process.env.PREVIEW_PORT, 4173)
const listener = server.listen(listenPort, host, () => console.log(`生产预览：http://${host}:${listenPort}${siteBase}`))
listener.on('error', error => { console.error(`预览启动失败：${error.message}`); process.exitCode = 1 })
for (const signal of ['SIGINT', 'SIGTERM']) process.on(signal, () => listener.close())
