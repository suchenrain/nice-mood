# taro-ts-dva

基于 [Taro][0] + [Typescript][1] + [Dva][2] 搭建的 **微信小程序快速开发** 脚手架, 通过[Mock.js][3]提供本地`mock`服务。

刚接触 Taro/React 不久，所以只是分享一些开发经验，希望能够快速利用这套工具开发微信小程序。如果觉得不错的话，请点右上角“ :star: Star”支持一下我，谢谢！And if any questions，欢迎提 issue；如果有任何改进，也欢迎 PR。

## 开发环境

- **node**: `10.7.0`
- **taro-cli**: `1.3.4`
- **包管理工具**: `npm` 5.2+ 或 `yarn` (需要 `npx`)
- **微信开发者工具**

```sh
# npm
$ npm i -g @tarojs/cli

# yarn
$ yarn global add @tarojs/cli
```

## 运行项目

```sh
# clone到本地
$ git clone https://github.com/suchenrain/taro-ts-dva.git
$ cd taro-ts-dva

# npm
$ npm install
$ npm run dev:weapp ## 编译微信小程序

# 或者yarn
$ yarn
$ yarn run dev:weapp

# 打开新终端，启动mock服务
$ npm run mock
# 或
$ yarn run mock
```

## 项目说明

### 项目结构

```sh
.
├── config                  # Taro编译配置
│   ├── dev.js              # 开发环境配置
│   ├── index.js            # 公共配置
│   └── prod.js              # 生产环境
├── dist            # 编译生成的原生小程序
│
├── global.d.ts
├── gulpfile.js          # Gulp 4.0+ 配置
├── mock                 # 本地Mock服务
│   ├── db.js           # mock data
│   ├── factory
│   │   └── news.js
│   ├── routes.js
│   └── server.js           # mock server
├── package.json            # 依赖项
├── project.config.json        # 小程序项目配置
├── scripts              # 帮助脚本：生成page和component模板
│   ├── components.js
│   └── page.js
├── src
│   ├── app-shim.d.ts             # 自定义类型
│   ├── app.scss                  # 全局样式
│   ├── app.tsx                   # 入口文件
│   ├── assets                    # 静态资源：image、iconfont等
│   │   ├── tab_home.png
│   │   └── tab_home_f.png
│   ├── components                  # 公用dumb组件
│   │   ├── demo
│   │   └── index.ts             # expose component
│   ├── config                   # 程序配置
│   │   ├── httpRequestConfig.ts
│   │   ├── index.ts
│   │   └── taroConfig.ts
│   ├── constants          # 常量
│   │   └── status.ts
│   ├── index.html
│   ├── models           # 项目dva插件model函数的引用或者是一些共用的js文件
│   │   └── index.ts
│   ├── pages         # 小程序页面
│   │   └── index
│   ├── styles             # 公用样式库
│   │   ├── common
│   │   ├── mixins
│   │   └── variables.scss
│   ├── types        # 公共的Typescript类型声明
│   └── utils                # 封装的一些插件
│       ├── common.ts        # 共用函数
│       ├── dva.ts       # dva配置封装
│       ├── httpRequest.ts       # 统一配置请求接口
│       ├── logger.ts         # 封装log函数
│       └── tips.ts           # 整合封装微信原生弹窗
└── tsconfig.json        # typescript 配置
```

## 模板生成脚本

- component
  通过以下命令可以快速在`components`下生成组件:

  ```sh
  $ yarn run comp <name>  # name支持kebab-case命名
  # 或
  $ npm run comp <name>
  ```

  > **注意**：需要导出在 page 中引用的组件请添加至`components/index.ts`。

- page

  通过以下命令可以快速在`pages`下生成页面:

  ```sh
  $ yarn run page <name> # name支持kebab-case命名
  # 或
  $ npm run page <name>
  ```

[0]: https://github.com/NervJS/taro
[1]: https://github.com/microsoft/TypeScript
[2]: https://github.com/dvajs/dva
[3]: http://mockjs.com/
