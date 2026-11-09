const path = require('node:path')
function spaFallback(folder) {
  return (req, res) => {
    // 缺失的脚本/样式必须返回 404，不能返回伪装成资源的 HTML。
    if ((req.method === 'GET' || req.method === 'HEAD') && !path.extname(req.path) && req.accepts('html')) {
      return res.sendFile(path.join(folder, 'index.html'))
    }
    res.status(404).type('text/plain').send('Not found')
  }
}
module.exports = { spaFallback }
