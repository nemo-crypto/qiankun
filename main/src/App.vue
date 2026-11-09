<template>
  <div class="workspace">
    <aside class="sidebar">
      <a class="brand" href="/">Q<span>qiankun<span class="brand-sub">MICRO FRONTEND LAB</span></span></a>
      <p class="nav-label">应用工作台</p>
      <nav aria-label="子应用导航">
        <a v-for="(app, index) in apps" :key="app.name" :href="app.route" :aria-current="current === app.name ? 'page' : null" :class="['nav-item', { selected: current === app.name }]" @click="navigate($event, app.route)">
          <span class="nav-icon">{{ ['V', 'R', 'H'][index] }}</span><span>{{ app.label }}<small>{{ app.name }}</small></span><span class="nav-arrow">↗</span>
        </a>
      </nav>
      <div class="sidebar-foot"><span class="status-dot"></span> 本地演示 · 无需后端<p>一个基座，三种技术栈。<br>切换应用，观察状态与生命周期。</p></div>
    </aside>
    <main class="main-content">
      <header class="topbar"><span>工作空间 <span class="crumb">/ {{ active ? active.label : '页面未找到' }}</span></span><a v-if="active" :href="active.entry" target="_blank" rel="noopener noreferrer">独立打开应用 ↗</a></header>
      <section class="intro"><div><div class="eyebrow">BUILD TOGETHER, RUN INDEPENDENTLY</div><h1>微前端，不止于接入。</h1><p>在真实的挂载、路由与状态流转中，理解应用如何协作。</p></div><span class="edition">INTERACTIVE DEMO / 01</span></section>
      <section class="metrics" aria-label="基座共享状态">
        <article><span>当前用户</span><strong data-testid="host-user">{{ state.user.name }}</strong><small>跨应用实时同步</small></article>
        <article><span>共享计数</span><strong data-testid="host-count">{{ state.count }}</strong><small>最近更新：{{ state.source }}</small></article>
        <article><span>基座操作</span><button @click="reset">重置共享状态</button><small>刷新页面将恢复演示初始值</small></article>
      </section>
      <section class="app-frame" :aria-busy="runtime.loading">
        <div class="frame-bar"><span><i class="status-dot"></i>{{ active ? active.name : '未知路由' }}</span><span>{{ runtime.error ? '加载异常' : runtime.loading ? '正在加载…' : '应用容器' }}</span></div>
        <div v-if="runtime.error" class="error-box" role="alert"><h2>应用暂时无法加载</h2><p>确认子应用服务已启动，或检查入口地址。修复后重新加载页面。</p><code>{{ runtime.error }}</code><button @click="reload">重新加载页面</button></div>
        <p v-else-if="runtime.loading" class="loading" role="status">正在加载子应用，请稍候…</p>
        <div v-if="!active" class="empty"><h2>这里还没有应用</h2><p>从左侧选择一个应用，或<a href="/sub-vue" @click="navigate($event, '/sub-vue')">返回 Vue 示例</a>。</p></div>
        <div id="subapp-viewport"></div>
      </section>
      <section class="lifecycle"><div><h2>生命周期观察</h2><p>切换应用，查看真实触发的挂载与卸载记录。</p></div><ol aria-label="生命周期记录"><li v-for="event in runtime.events" :key="event.id"><time>{{ event.time }}</time><strong>{{ event.app }}</strong><span>{{ event.phase }}</span></li><li v-if="!runtime.events.length">等待应用加载</li></ol></section>
      <footer>QIANKUN LAB <span>独立开发 · 按需加载 · 显式通信</span></footer>
    </main>
  </div>
</template>
<script>
import apps from './micro-app'
import store, { state } from './store'
import { defaultState } from 'common'
import { runtime } from './runtime'
export default {
  data: () => ({ apps, state, runtime, pathname: window.location.pathname }),
  computed: {
    active() { return this.apps.find(app => this.pathname === app.route || this.pathname.startsWith(app.route + '/')) },
    current() { return this.active?.name }
  },
  mounted() { window.addEventListener('single-spa:routing-event', this.syncRoute); window.addEventListener('popstate', this.syncRoute) },
  beforeDestroy() { window.removeEventListener('single-spa:routing-event', this.syncRoute); window.removeEventListener('popstate', this.syncRoute) },
  methods: {
    syncRoute() { this.pathname = window.location.pathname },
    navigate(event, path) { if (event.metaKey || event.ctrlKey || event.shiftKey || event.altKey || event.button !== 0) return; event.preventDefault(); history.pushState(null, '', path); this.syncRoute() },
    reset() { store.setGlobalState(defaultState()) },
    reload() { window.location.reload() }
  }
}
</script>
<style>
* { box-sizing: border-box; }
body { margin: 0; background: #f5f7fa; color: #1d2d44; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif; -webkit-font-smoothing: antialiased; }
a { color: inherit; }
button { font: inherit; cursor: pointer; }
:focus-visible { outline: 3px solid #70aef1; outline-offset: 4px; }
.workspace { min-height: 100vh; }
.sidebar { width: 246px; position: fixed; inset: 0 auto 0 0; padding: 34px 22px; background: #fff; border-right: 1px solid #e5eaf0; display: flex; flex-direction: column; }
.brand { display: flex; align-items: center; gap: 13px; color: #176b56; font-size: 34px; font-weight: 800; text-decoration: none; }
.brand > span { color: #26344b; font-size: 25px; letter-spacing: -.04em; }
.brand-sub { display: block; font-size: 8px; letter-spacing: .16em; color: #8793a6; margin-top: 4px; }
.nav-label { margin: 50px 12px 16px; font-size: 12px; color: #8591a3; }
.nav-item { display: flex; align-items: center; gap: 12px; padding: 15px 12px; margin-bottom: 8px; border-radius: 10px; text-decoration: none; font-size: 14px; }
.nav-item small { display: block; margin-top: 5px; font-size: 11px; color: #8490a2; }
.nav-icon { width: 30px; height: 30px; display: grid; place-items: center; border: 1px solid #e1e7ed; border-radius: 8px; font-weight: 700; }
.nav-arrow { margin-left: auto; color: #8895a5; }
.nav-item:hover { background: #f5f8fa; }
.nav-item.selected { background: #eaf4ef; color: #12664f; }
.sidebar-foot { margin-top: auto; font-size: 12px; color: #65768d; padding: 30px 10px 0; }
.sidebar-foot p { color: #8794a6; font-size: 11px; line-height: 1.9; }
.status-dot { display: inline-block; width: 7px; height: 7px; border-radius: 50%; background: #339475; margin-right: 7px; }
.main-content { margin-left: 246px; max-width: 1550px; padding: 0 40px; }
.topbar { display: flex; align-items: center; justify-content: space-between; min-height: 75px; border-bottom: 1px solid #e1e7ef; font-size: 12px; color: #78869a; gap: 12px; }
.topbar a { color: #31725c; text-decoration: none; }
.crumb { margin-left: 10px; color: #34455d; }
.intro { display: flex; align-items: center; justify-content: space-between; padding: 38px 0 28px; gap: 20px; }
.eyebrow { font-size: 10px; font-weight: 700; letter-spacing: .15em; color: #6a887c; }
.intro h1 { margin: 12px 0; font-size: clamp(25px, 3vw, 36px); letter-spacing: -.05em; }
.intro p { margin: 0; font-size: 13px; color: #7b889a; line-height: 1.8; }
.edition { color: #929eae; font-size: 9px; letter-spacing: .12em; white-space: nowrap; }
.metrics { display: grid; grid-template-columns: 1.2fr 1fr 1fr; gap: 16px; margin-bottom: 24px; }
.metrics article { display: flex; flex-direction: column; align-items: flex-start; padding: 22px; border-radius: 12px; background: #fff; border: 1px solid #e3e8ef; min-width: 0; }
.metrics article > span { font-size: 12px; color: #78869b; }
.metrics strong { font-size: 23px; margin: 13px 0 8px; overflow-wrap: anywhere; }
.metrics small { color: #8c98a9; font-size: 11px; }
.metrics button { margin: 12px 0; background: #f4f7fa; border: 1px solid #dce3ec; border-radius: 7px; padding: 8px 12px; color: #42556e; font-size: 12px; }
.app-frame { background: #fff; border: 1px solid #e0e7ef; border-radius: 14px; overflow: hidden; min-height: 300px; }
.frame-bar { display: flex; justify-content: space-between; padding: 15px 24px; border-bottom: 1px solid #e8edf2; font-size: 11px; color: #7c899b; background: #fcfdfd; }
#subapp-viewport .mf-demo { margin: 0; max-width: none; border: none; border-radius: 0; }
.loading, .empty { padding: 24px; color: #6d7f94; }
.error-box { margin: 24px; padding: 20px; background: #fff4ed; border-radius: 10px; color: #8a422a; }
.error-box h2 { font-size: 18px; }
.error-box p { font-size: 13px; }
.error-box code { display: block; overflow-wrap: anywhere; font-size: 12px; }
.error-box button { margin-top: 16px; padding: 9px 12px; border: 1px solid #d5ac95; border-radius: 6px; background: white; }
.lifecycle { display: grid; grid-template-columns: 1fr 1.5fr; gap: 24px; padding: 28px 0; }
.lifecycle h2 { font-size: 14px; margin: 0 0 8px; }
.lifecycle p { font-size: 12px; color: #8693a5; line-height: 1.7; }
.lifecycle ol { list-style: none; padding: 0; margin: 0; }
.lifecycle li { display: flex; gap: 16px; padding: 7px 0; font-size: 11px; color: #76869b; }
.lifecycle strong { color: #475b72; font-weight: 500; }
footer { display: flex; justify-content: space-between; padding: 20px 0 26px; border-top: 1px solid #e1e7ef; font-size: 9px; letter-spacing: .12em; color: #8a97a9; }
@media (max-width: 1000px) { .sidebar { width: 200px; padding: 24px 14px; } .main-content { margin-left: 200px; padding: 0 24px; } .edition { display: none; } }
@media (max-width: 700px) { .sidebar { position: static; width: 100%; padding: 18px; border-bottom: 1px solid #e1e7ef; } .brand { font-size: 25px; } .brand > span { font-size: 20px; } .nav-label, .sidebar-foot, .nav-arrow { display: none; } .sidebar nav { display: flex; gap: 6px; margin-top: 18px; } .nav-item { flex: 1; margin: 0; gap: 7px; padding: 10px 8px; font-size: 12px; } .nav-icon { width: 23px; height: 26px; } .main-content { margin: 0; padding: 0 16px; } .intro { padding: 26px 0; } .metrics { gap: 8px; } .metrics article { padding: 13px 10px; } .metrics strong { font-size: 18px; } .metrics small { font-size: 10px; line-height: 1.5; } .metrics button { padding: 6px; font-size: 11px; } .lifecycle { grid-template-columns: 1fr; gap: 8px; } }
</style>
