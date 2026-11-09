const { test, expect } = require('@playwright/test')
const standalone = name => process.env.E2E_DEV
  ? `http://127.0.0.1:${{ 'sub-vue': 7777, 'sub-react': 7788, 'sub-html': 7799 }[name]}/`
  : `/subapp/${name}/`

test('跨框架双向通信、反复挂载、历史回退与安全文本展示', async ({ page }) => {
  const errors = []
  page.on('pageerror', error => errors.push(error.message))
  await page.goto('/')
  await expect(page.getByTestId('vue-app')).toBeVisible()
  await page.getByRole('button', { name: '共享计数 +1' }).click()
  await expect(page.getByTestId('host-count')).toHaveText('1')
  await page.getByLabel('新用户名称').fill('跨应用同学')
  await page.getByRole('button', { name: '更新共享用户' }).click()
  await expect(page.getByTestId('host-user')).toHaveText('跨应用同学')
  await page.getByRole('link', { name: '前往 React' }).click()
  await expect(page.getByTestId('react-app')).toBeVisible()
  await expect(page.getByTestId('child-user')).toHaveText('跨应用同学')
  await expect(page.getByRole('navigation').getByRole('link', { name: /React 应用/ })).toHaveAttribute('aria-current', 'page')
  await page.getByRole('button', { name: '共享计数 +1' }).click()
  await expect(page.getByTestId('host-count')).toHaveText('2')
  await page.goBack()
  await expect(page.getByTestId('vue-app')).toBeVisible()
  await expect(page.getByTestId('child-count')).toHaveText('2')
  for (let i = 0; i < 2; i++) {
    await page.getByRole('navigation').getByRole('link', { name: /原生应用/ }).click()
    await expect(page.getByTestId('html-app')).toBeVisible()
    await page.getByRole('button', { name: '共享计数 +1' }).click()
    await page.getByRole('navigation').getByRole('link', { name: /React 应用/ }).click()
    await expect(page.getByTestId('react-app')).toBeVisible()
  }
  await expect(page.getByTestId('host-count')).toHaveText('4')
  await page.getByRole('navigation').getByRole('link', { name: /原生应用/ }).click()
  const text = '<img src=x onerror=alert(1)>'
  await page.getByLabel('新用户名称').fill(text)
  await page.getByRole('button', { name: '更新共享用户' }).click()
  await expect(page.getByTestId('child-user')).toHaveText(text)
  await expect(page.getByTestId('child-user').locator('img')).toHaveCount(0)
  await page.getByRole('button', { name: '重置共享状态' }).click()
  await expect(page.getByTestId('child-user')).toHaveText('微前端体验者')
  await expect(page.getByTestId('child-count')).toHaveText('0')
  await expect(page.getByRole('list', { name: '生命周期记录' })).toContainText('卸载完成')
  expect(await page.evaluate(() => document.documentElement.scrollWidth <= window.innerWidth)).toBe(true)
  expect(errors).toEqual([])
})

test('Vue 懒加载路由、刷新与当前导航一致', async ({ page }) => {
  await page.goto('/sub-vue/about')
  await expect(page.getByRole('heading', { name: '子应用路由说明' })).toBeVisible()
  await page.reload()
  await expect(page.getByRole('heading', { name: '子应用路由说明' })).toBeVisible()
  await expect(page.getByRole('navigation').getByRole('link', { name: /Vue 应用/ })).toHaveAttribute('aria-current', 'page')
  await page.screenshot({ path: `test-results/workspace-${test.info().project.name}.png`, fullPage: true })
})

test('三个子应用均可独立运行并使用本地状态', async ({ page }) => {
  for (const name of ['sub-vue', 'sub-react', 'sub-html']) {
    await page.goto(standalone(name))
    await expect(page.getByTestId('child-count')).toHaveText('0')
    await expect(page.getByText(/运行模式：独立运行/)).toBeVisible()
    await page.getByRole('button', { name: '共享计数 +1' }).click()
    await expect(page.getByTestId('child-count')).toHaveText('1')
    if (name === 'sub-vue') {
      await page.getByRole('link', { name: '路由说明' }).click()
      await expect(page.getByRole('heading', { name: '子应用路由说明' })).toBeVisible()
      await page.reload()
      await expect(page.getByRole('heading', { name: '子应用路由说明' })).toBeVisible()
    }
  }
})

test('子应用网络失败显示可恢复提示', async ({ page }) => {
  await page.route(process.env.E2E_DEV ? 'http://127.0.0.1:7788/**' : '**/subapp/sub-react/**', route => route.abort())
  await page.goto('/sub-react')
  await expect(page.getByRole('alert')).toContainText('应用暂时无法加载')
  await page.unrouteAll()
  await page.getByRole('button', { name: '重新加载页面' }).click()
  await expect(page.getByTestId('react-app')).toBeVisible()
})

test('未知路径可返回工作台，静态资源缺失返回 404', async ({ page, request }) => {
  await page.goto('/not-an-app')
  await expect(page.getByRole('heading', { name: '这里还没有应用' })).toBeVisible()
  await page.getByRole('link', { name: '返回 Vue 示例' }).click()
  await expect(page.getByTestId('vue-app')).toBeVisible()
  expect((await request.get('/missing-file.js')).status()).toBe(404)
})
