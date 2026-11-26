export const defaultState = () => ({ user: { name: '微前端体验者' }, count: 0, source: '主应用' })
const clone = value => JSON.parse(JSON.stringify(value))
// 每次挂载创建一个桥接实例；退出时注销 qiankun 监听，避免重挂载重复通知。
export function createBridge(props = {}) {
  let state = clone(props.getGlobalState ? props.getGlobalState() : defaultState())
  const listeners = new Set()
  let revision = 0
  const publish = next => {
    revision++
    state = clone(next)
    listeners.forEach(listener => listener(clone(state)))
  }
  if (props.onGlobalStateChange) props.onGlobalStateChange(publish, true)
  return {
    getState: () => clone(state),
    subscribe(listener) { listeners.add(listener); listener(clone(state)); return () => listeners.delete(listener) },
    setState(patch) {
      const next = { ...state, ...clone(patch) }
      const beforeWrite = revision
      if (props.setGlobalState) {
        const accepted = props.setGlobalState(patch)
        if (accepted === false) return false
      }
      // qiankun 同步广播时已完成通知；不要再用旧合并结果覆盖宿主状态。
      if (revision === beforeWrite) publish(next)
      return true
    },
    destroy() { listeners.clear(); if (props.offGlobalStateChange) props.offGlobalStateChange() }
  }
}
