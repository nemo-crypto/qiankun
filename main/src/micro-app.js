import store from './store'
const names = ['sub-vue', 'sub-react', 'sub-html']
const labels = ['Vue 应用', 'React 应用', '原生应用']
export default names.map((name, index) => ({
  name, label: labels[index],
  entry: __APP_ENTRIES__[name] || (process.env.NODE_ENV === 'production'
    ? `/subapp/${name}/`
    : `${window.location.protocol}//${window.location.hostname}:${__APP_PORTS__[name]}/`),
  activeRule: location => location.pathname === `/${name}` || location.pathname.startsWith(`/${name}/`),
  route: `/${name}`,
  container: '#subapp-viewport',
  props: { routerBase: `/${name}`, getGlobalState: store.getGlobalState }
}))
