const { test } = require('node:test')
const assert = require('node:assert/strict')
const fs = require('node:fs/promises')
const path = require('node:path')
async function stateModule() {
  const source = await fs.readFile(path.resolve(__dirname, '../common/src/state.js'), 'utf8')
  return import(`data:text/javascript;base64,${Buffer.from(source).toString('base64')}`)
}
test('a synchronous host broadcast produces one subscriber update for a child write', async () => {
  const { createBridge, defaultState } = await stateModule()
  let receive, state = defaultState()
  const bridge = createBridge({
    getGlobalState: () => state,
    onGlobalStateChange(callback) { receive = callback },
    setGlobalState(patch) { state = { ...state, ...patch }; receive(state); return true }
  })
  const updates = []
  bridge.subscribe(snapshot => updates.push(snapshot.count))
  bridge.setState({ count: 1 })
  assert.deepEqual(updates, [0, 1])
  assert.equal(bridge.getState().count, 1)
  bridge.destroy()
})
