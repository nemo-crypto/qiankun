import Vue from 'vue'
import { initGlobalState } from 'qiankun'
import { defaultState } from 'common'
export const state = Vue.observable(defaultState())
const actions = initGlobalState(JSON.parse(JSON.stringify(state)))
actions.onGlobalStateChange(next => Object.assign(state, next))
actions.getGlobalState = key => JSON.parse(JSON.stringify(key ? state[key] : state))
export default actions
