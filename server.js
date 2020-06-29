const Koa = require('koa')
const next = require('next')
const Router = require('koa-router')
const port = parseInt(process.env.PORT, 10) || 3003
const dev = process.env.NODE_ENV !== 'production'
const app = next({ dev })
const handle = app.getRequestHandler()
const proxy = require('koa-server-http-proxy')

//app.prepare:我们需要等待pages目录下的所有页面被编译完成，然后再启动koa的服务。
app.prepare().then(() => {
  const server = new Koa()
  const router = new Router();
  router.all('*', async ctx => {
    await handle(ctx.req, ctx.res)
    ctx.respond = false
  })
  server.use(proxy('/api', {
    target: 'https://m.toutiao.com',
    changeOrigin: true,
    pathRewrite: {
      '^/api/': '/'
    }
  }));
  server.use(async (ctx, next) => {
    ctx.res.statusCode = 200
    await next()
  })

  server.use(router.routes())
  server.listen(port, () => {
    console.log(`> Ready on http://localhost:${port}`)
  })
})