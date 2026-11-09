const { defineConfig, devices } = require('@playwright/test')
module.exports = defineConfig({
  testDir: './tests/e2e', timeout: 45000, expect: { timeout: 12000 },
  fullyParallel: false, workers: 1, retries: 0,
  reporter: [['list'], ['html', { open: 'never' }]],
  use: { baseURL: 'http://127.0.0.1:4173', trace: 'retain-on-failure', screenshot: 'only-on-failure' },
  projects: [
    { name: 'desktop', use: { ...devices['Desktop Chrome'], viewport: { width: 1440, height: 1000 } } },
    { name: 'mobile', use: { ...devices['iPhone 13'], defaultBrowserType: 'chromium' } },
    { name: 'tablet', use: { ...devices['iPad Mini'], defaultBrowserType: 'chromium' } }
  ],
  webServer: { command: 'npm run build && npm run preview', url: 'http://127.0.0.1:4173', reuseExistingServer: false, timeout: 180000,
    env: { HOST: '127.0.0.1', PREVIEW_PORT: '4173', VUE_APP_SUB_VUE: '', VUE_APP_SUB_REACT: '', VUE_APP_SUB_HTML: '' } }
})
