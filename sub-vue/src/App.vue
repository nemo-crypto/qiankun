<template>
  <section class="mf-demo" data-testid="vue-app">
    <div class="mf-eyebrow">VUE / REACTIVE EXPERIENCE</div><h1>让状态，连接每个应用。</h1><p>Vue + Vuex 示例。修改用户或计数，再切换到其他应用，查看同一份共享状态。</p>
    <div class="mf-actions"><router-link class="mf-link" to="/">交互示例</router-link><router-link class="mf-link" to="/about">路由说明</router-link></div>
    <router-view />
    <div class="mf-grid">
      <section class="mf-panel"><h2>共享用户</h2><div class="mf-value" data-testid="child-user">{{ user.name }}</div><form @submit.prevent="save"><label for="vue-name">新用户名称</label><input id="vue-name" v-model="name" maxlength="30" placeholder="输入一个名字" /><div class="mf-actions"><button class="mf-primary" :disabled="!name.trim()">更新共享用户</button></div></form></section>
      <section class="mf-panel"><h2>共享计数器</h2><div class="mf-value" data-testid="child-count">{{ count }}</div><p>最近更新：{{ source }}</p><div class="mf-actions"><button class="mf-primary" @click="increment">共享计数 +1</button><a v-if="embedded" class="mf-link" href="/sub-react" @click.prevent="goReact">前往 React</a></div></section>
    </div>
    <div class="mf-note">运行模式：{{ embedded ? 'qiankun 基座内' : '独立运行' }} · 独立运行使用本地状态，基座内通过显式桥接同步。</div>
  </section>
</template>
<script>
import { mapState, mapActions } from 'vuex'
export default {
  data: () => ({ name: '', embedded: !!window.__POWERED_BY_QIANKUN__ }),
  computed: { ...mapState('global', ['user', 'count', 'source']) },
  methods: {
    ...mapActions('global', ['setGlobalState']),
    save() { const name = this.name.trim(); if (name) { this.setGlobalState({ user: { name }, source: 'Vue 应用' }); this.name = '' } },
    increment() { this.setGlobalState({ count: this.count + 1, source: 'Vue 应用' }) },
    goReact() { history.pushState(null, '', '/sub-react') }
  }
}
</script>
