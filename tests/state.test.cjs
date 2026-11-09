const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
async function stateModule() {
  const source = await fs.readFile(path.resolve(__dirname, '../common/src/state.js'), 'utf8')
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
}
test('独立状态不共享引用，退订后不再通知', async () => {
  const { createBridge } = await stateModule()
  const a = createBridge(), b = createBridge()
  let updates = 0
  const off = a.subscribe(() => updates++)
  const snapshot = a.getState()
  snapshot.user.name = '不应直接改变状态'
  assert.equal(a.getState().user.name, '微前端体验者')
  a.setState({ count: 2 })
  assert.equal(a.getState().count, 2)
  assert.equal(b.getState().count, 0)
  off(); a.setState({ count: 3 })
  assert.equal(updates, 2)
  a.destroy(); b.destroy()
})
test('基座更新、子应用写入和卸载注销使用同一桥接协议', async () => {
  const { createBridge, defaultState } = await stateModule()
  let receive, forwarded, offCount = 0
  const bridge = createBridge({
    getGlobalState: defaultState,
    onGlobalStateChange(fn) { receive = fn },
    setGlobalState(patch) { forwarded = patch; return true },
    offGlobalStateChange() { offCount++ }
  })
  receive({ ...defaultState(), count: 5 })
  assert.equal(bridge.getState().count, 5)
  bridge.setState({ user: { name: '来自子应用' } })
  assert.deepEqual(forwarded, { user: { name: '来自子应用' } })
  assert.equal(bridge.getState().user.name, '来自子应用')
  bridge.destroy()
  assert.equal(offCount, 1)
})
test('基座拒绝写入时不显示虚假的本地成功状态', async () => {
  const { createBridge } = await stateModule()
  const bridge = createBridge({ setGlobalState: () => false })
  assert.equal(bridge.setState({ count: 99 }), false)
  assert.equal(bridge.getState().count, 0)
})
