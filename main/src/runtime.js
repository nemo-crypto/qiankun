import Vue from 'vue'
export const runtime = Vue.observable({ loading: false, error: '', events: [] })
export function record(app, phase) {
  runtime.events.unshift({ id: `${Date.now()}-${Math.random()}`, app, phase, time: new Date().toLocaleTimeString() })
  runtime.events.splice(8)
}
