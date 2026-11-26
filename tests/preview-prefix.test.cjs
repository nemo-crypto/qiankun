const { test } = require('node:test')
const assert = require('node:assert/strict')
const { spawn } = require('node:child_process')
const fs = require('node:fs/promises')
const os = require('node:os')
const path = require('node:path')
const net = require('node:net')
async function fixture(t, base) {
 const root = await fs.mkdtemp(path.join(os.tmpdir(), 'qiankun-prefix-'))
 const probe = net.createServer().listen(0, '127.0.0.1')
 await new Promise(resolve => probe.once('listening', resolve))
 const port = probe.address().port
 await new Promise(resolve => probe.close(resolve))
 for (const name of ['main', 'subapp/sub-vue', 'subapp/sub-react', 'subapp/sub-html']) {
  const folder = path.join(root, 'dist', name)
  await fs.mkdir(path.join(folder, 'assets'), { recursive: true })
  await fs.writeFile(path.join(folder, 'index.html'), `<html>${name}</html>`)
  await fs.writeFile(path.join(folder, 'assets/app.js'), `console.log(${JSON.stringify(name)})`)
 }
 // Inject only fixture paths; execute the actual preview entrypoint and its middleware.
 const settings = require.resolve('../config/settings.cjs')
 const entry = require.resolve('../scripts/preview.cjs')
 const script = `const settings=require(${JSON.stringify(settings)}); settings.root=${JSON.stringify(root)}; require(${JSON.stringify(entry)});`
 const child = spawn(process.execPath, ['-e', script], { env: { ...process.env, HOST: '127.0.0.1', PREVIEW_PORT: String(port), PAGES_BASE: base }, stdio: ['ignore', 'pipe', 'pipe'] })
 t.after(async () => { if (child.exitCode === null) { child.kill(); await new Promise(resolve => child.once('exit', resolve)); } await fs.rm(root, { recursive: true, force: true }) })
 await new Promise((resolve, reject) => { child.stdout.once('data', resolve); child.once('exit', code => reject(new Error(`preview exited: ${code}`))); child.stderr.on('data', data => reject(new Error(String(data)))) })
 return `http://127.0.0.1:${port}`
}
test('preview serves host and microfrontend assets below PAGES_BASE', async t => {
 const origin = await fixture(t, '/qiankun/')
 for (const path of ['/qiankun/assets/app.js', '/qiankun/subapp/sub-vue/assets/app.js']) {
  const response = await fetch(origin + path)
  assert.equal(response.status, 200, path)
  assert.match(await response.text(), /console.log/)
 }
 assert.equal(await (await fetch(origin + '/qiankun/subapp/sub-react/')).text(), '<html>subapp/sub-react</html>')
})
