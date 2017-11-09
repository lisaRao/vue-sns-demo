# company-fe
> 这个项目使用了 vue 全家桶 ^_^ 

> 本地服务启动后 访问 localhost:3005 即可  

> `跨域处理配置了 /api 路径 故 router 中配置 禁止使用 /api/xxx `


### 使用技术
- vue.js
- vux: vue 组件库
- vuex: 主要实现非父子组件通讯
- vue-router：管理单页面应用路由
- axios：发起http请求
- Webpack：自动化构建工具，主要配置由vue-cli脚手架提供。
- ES6：采用ES6语法。

### 安装运行（安装运行前请确定已安装node环境）
> 要求 node 环境在 4.0以上


> 检查是否安装 node.js ，如果没有安装，windows系统从 [node 官网下载](http://nodejs.cn/download/) 最新版本，然后安装淘宝镜像` npm install -g cnpm --registry=https://registry.npm.taobao.org `,

#### 加载依赖 【可选，从 git pull 下来项目 可不执行下面句子】
```bash
    npm install
```
#### 启动服务
> 支持热启动 本地访问地址 localhost:3005 也可以在 ./config/index.js:26 更改

```bash
    npm run dev
```
###  项目构建打包发布到线上
> 为了使webpack 打包时间节省，添加了 dll 处理，所以 在 开始打包前请执行 
```bash
    npm run build:dll:win 
```
> 然后再执行 下面👇 ，打包后会自动生成 dist 文件

```bash
    npm run build
```

### 架构目录简要说明

<pre>
├── build              // 构建服务和webpack配置
├── config             // 项目不同环境的配置
├── dist               // 项目build目录
├── index.html         // 项目入口文件
├── package.json       // 项目配置文件
├── static       	   // 放置静态资源
├── .babelrc           // babel 配置文件 用于转码
├── .editorconfig      // 项目编辑统一设置
├── .gitignore         // git 屏蔽文件[默认屏蔽了 dist和 node_modules 目录下所有文件]
├── node_modules       // 依赖插件生成目录
├── src                // 生产目录
│   ├── assets         // 图片资源
│   ├── router         // 单页面路由设置
│   ├── service        // 数据交互处理
│   ├── store          // vuex 状态存储
│   ├── libs           // 第三方插件库
│   ├── config         // vux 主题颜色配置，(暂时公共样式存放)
│   ├── App.vue        // 主页面
│   ├── filters.js     // vue filters
│   └── main.js        // Webpack 预编译入口[各入口引入都由此]
│   ├── components     // 各种组件
│   │   ├── home       // 首页
│   │   ├── common     // 公共组件
│   │   ├── user       //  个人[我]模块组件
.....
</pre>


### 技术站相关官方 文档

*   [vux](https://vux.li/#/)
*   [vue.js](https://cn.vuejs.org/v2/api/)
*   [vuex](https://vuex.vuejs.org/zh-cn/)
*   [vue-router](https://router.vuejs.org/zh-cn/)
*   [axios](https://github.com/mzabriskie/axios)

