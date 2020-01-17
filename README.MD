## 基于Next.js的头条SSR应用

## 项目创建

    create-next-app next-koa-headline

该脚手架成生的配置非常简单，仅仅处理ssr逻辑，无法处理less,css,svg,img 等资源，也不包含web服务框架

## 配置流程

### 增加css与svg的处理

本地创建next.config.js:

      const withCss = require('@zeit/next-css');
      const withImages = require('next-images')
      const withPlugins = require("next-compose-plugins");//实现多创建处理
      // fix: prevents error when .css files are required by node
      if (typeof require !== 'undefined') {
        require.extensions['.css'] = (file) => {}
      }
      module.exports = withPlugins([withCss,withImages])
  
### 引入antd mobile


      npm install --save antd-mobile babel-plugin-import @babel/plugin-proposal-decorators

创建`.babelrc`文件：

      {
          "presets": ["next/babel"],
          "plugins": [
              ["@babel/plugin-proposal-decorators", { "legacy": true }],
              ["import", { 
                "libraryName": "antd-mobile",
                "style":"css"
                }]
          ]
      }

增加next.config.js配置：

      webpack: (config, { isServer }) => {
      if (isServer) {
        const antStyles = /antd-mobile\/.*?\/style.*?/
        const origExternals = [...config.externals]
        config.externals = [
          (context, request, callback) => {
            if (request.match(antStyles)) return callback()
            if (typeof origExternals[0] === 'function') {
              origExternals[0](context, request, callback)
            } else {
              callback()
            }
          },
          ...(typeof origExternals[0] === 'function' ? [] : origExternals),
        ]

        config.module.rules.unshift({
          test: antStyles,
          use: 'null-loader',
        })
      }
      return config
    }


### 增加alias配置

      npm install babel-plugin-module-resolver -D

修改`.babelrc`文件，增加插件

         [ "module-resolver",
          {
            "alias": {
              "@assets": "./assets",
              "@components": "./components",
              "@http": "./http",
              "@pages": "./pages"
            }
          }]

### 增加koa2 与 反向代理

      npm i koa koa-router koa-server-http-proxy  cross-env -S

根目录下创建server.js文件：

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
          target: 'http://service.inswindows.com',
          changeOrigin: true,
          pathRewrite: {
            // '^/app/': ''
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
修改package.json中启动命令：

      "scripts": {
          "dev": "node server.js",
          "build": "next build",
          "start": "cross-env NODE_ENV=production node server.js"
        },
        
## 项目运行

### 安装依赖
	$ yarn install

### 运行开发模式

	$ yarn run dev

### 以生产模式启动一个Web服务器

	$ yarn run build
	$ yarn start

###  PM2 启动服务

  $ yarn run pm2

## 其他说明

如果只部署服务器端（非静态），只需要保留如下结构即可:

	  ├─.next
	  ├─server.js        
	  ├─next.config.js   
	  ├─package.json  


## 关于css

- Next.js 推荐使用 styled-jsx 的方案，参考[官方文档](https://nextjs.frontendx.cn/docs/#css), 自己通过less来处理的时候会出现样式丢失的问题，原因未详细定位，个人认为styled-jsx更加简洁与高效，就采用的这种方案

- 全局css的问题，通过`./pages/_app.js`文件，重写了 App 模块, 引入了全局css与head

## 关于请求

选用axios进行请求，同时支持服务端与客户端，创建对象时通过process进行了区分

      const http = axios.create({
        baseURL: process.browser?"/":"http://service.inswindows.com",//根url,根据服务端与客户端区分
        timeout: 8000
      });

Next.js 内部新增了一个异步方法：`getInitialProps`来加载数据，具体参见[文档](https://nextjs.frontendx.cn/docs/#%E8%8E%B7%E5%8F%96%E6%95%B0%E6%8D%AE%E4%BB%A5%E5%8F%8A%E7%BB%84%E4%BB%B6%E7%94%9F%E5%91%BD%E5%91%A8%E6%9C%9F)

## 路由跳转

页面内通过`next/router`模块中的对象来完成

## 关于SSR的特点
SSR框架中并不是所有请求都是服务端获取，服务端获取的场景一般两种情况：
- 第一种，系统初始化进入
- 第二种，任意页面的刷新

无论nuxtJs 与 nextJs 均为这种模式

## 参考
- [Next.js中文文档](https://nextjs.frontendx.cn/)
- [Next.js with-antd-mobile 官方配置demo](https://github.com/zeit/next.js/tree/canary/examples/with-antd-mobile)
- [Next.js + koa2 官方配置demo](https://github.com/zeit/next.js/tree/canary/examples/custom-server-koa)
- [Next.js所有官方demo](https://github.com/zeit/next.js/tree/canary/examples)
