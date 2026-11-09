import { createBridge } from '../state'
export default function globalRegister(store, props = {}) {
  if (!store || !store.hasModule) throw new Error('需要 Vuex 3.6 store')
  if (store.hasModule('global')) store.unregisterModule('global')
  const bridge = createBridge(props)
  store.registerModule('global', {
    namespaced: true, state: bridge.getState(),
    mutations: { update(state, next) { Object.assign(state, next) } },
    actions: { setGlobalState(context, patch) { return bridge.setState(patch) } }
  })
  const unsubscribe = bridge.subscribe(state => store.commit('global/update', state))
  return () => { unsubscribe(); bridge.destroy(); store.unregisterModule('global') }
}
