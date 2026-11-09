import React, { useEffect, useState } from 'react'
export default function App({ bridge, embedded }) {
  const [state, setState] = useState(() => bridge.getState())
  const [name, setName] = useState('')
  useEffect(() => bridge.subscribe(setState), [bridge])
  function save(event) {
    event.preventDefault()
    if (!name.trim()) return
    bridge.setState({ user: { name: name.trim() }, source: 'React 应用' })
    setName('')
  }
  return <section className="mf-demo" data-testid="react-app">
    <div className="mf-eyebrow">REACT / COMPONENT EXPERIENCE</div><h1>不同框架，相同的协作方式。</h1><p>React 使用 Hooks 订阅共享状态。离开页面时清理订阅，返回后重新读取最新值。</p>
    <div className="mf-grid">
      <section className="mf-panel"><h2>共享用户</h2><div className="mf-value" data-testid="child-user">{state.user.name}</div><form onSubmit={save}><label htmlFor="react-name">新用户名称</label><input id="react-name" value={name} maxLength={30} onChange={event => setName(event.target.value)} placeholder="输入一个名字" /><div className="mf-actions"><button className="mf-primary" disabled={!name.trim()}>更新共享用户</button></div></form></section>
      <section className="mf-panel"><h2>共享计数器</h2><div className="mf-value" data-testid="child-count">{state.count}</div><p>最近更新：{state.source}</p><div className="mf-actions"><button className="mf-primary" onClick={() => bridge.setState({ count: bridge.getState().count + 1, source: 'React 应用' })}>共享计数 +1</button></div></section>
    </div>
    <div className="mf-note">运行模式：{embedded ? 'qiankun 基座内' : '独立运行'} · React 18 createRoot，挂载节点限定在子应用容器内。</div>
  </section>
}
