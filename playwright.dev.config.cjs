const config = require('./playwright.config.cjs')
process.env.E2E_DEV = '1'
module.exports = { ...config,
  use: { ...config.use, baseURL: 'http://127.0.0.1:8080' },
  projects: config.projects.filter(project => project.name === 'desktop'),
  webServer: { command: 'npm run dev', url: 'http://127.0.0.1:8080', timeout: 180000, reuseExistingServer: false,
    env: { HOST: '127.0.0.1', MAIN_PORT: '8080', VUE_PORT: '7777', REACT_PORT: '7788', HTML_PORT: '7799', VUE_APP_SUB_VUE: '', VUE_APP_SUB_REACT: '', VUE_APP_SUB_HTML: '' } }
}
