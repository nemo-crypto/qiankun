const path = require('node:path')
require('dotenv').config({ path: path.resolve(__dirname, '../.env'), quiet: true })
function port(value, fallback) {
  const parsed = value === undefined || value === '' ? fallback : Number(value)
  if (!Number.isInteger(parsed) || parsed < 1 || parsed > 65535) throw new Error(`无效端口: ${value}`)
  return parsed
}
const apps = [
  { name: 'main', port: port(process.env.MAIN_PORT, 8080), entry: 'src/main.js' },
  { name: 'sub-vue', port: port(process.env.VUE_PORT, 7777), entry: 'src/main.js' },
  { name: 'sub-react', port: port(process.env.REACT_PORT, 7788), entry: 'src/index.js' },
  { name: 'sub-html', port: port(process.env.HTML_PORT, 7799), entry: 'js/main.js' }
]
if (new Set(apps.map(app => app.port)).size !== apps.length) throw new Error('四个应用必须使用不同端口，请检查根目录 .env')
module.exports = { apps, port, host: process.env.HOST || '127.0.0.1', root: path.resolve(__dirname, '..') }
