import store from './store'
const names = ['sub-vue', 'sub-react', 'sub-html']
const labels = ['Vue 应用', 'React 应用', '原生应用']
export default names.map((name, index) => {
  const route = `${__SITE_BASE__}${name}`
  return {
    name, label: labels[index],
    entry: __APP_ENTRIES__[name] || (process.env.NODE_ENV === 'production'
      ? `${__SITE_BASE__}subapp/${name}/`
      : `${window.location.protocol}//${window.location.hostname}:${__APP_PORTS__[name]}/`),
    activeRule: location => location.pathname === route || location.pathname.startsWith(route + '/'),
    route,
    container: '#subapp-viewport',
    props: { routerBase: route, hostBase: __SITE_BASE__, getGlobalState: store.getGlobalState }
  }
})
