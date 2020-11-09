## Description

[Nest](https://github.com/nestjs/nest) framework TypeScript starter repository.

## Installation

1.新建项目
nest new start-nest-project(项目名)

2.安装 yarn
（1）淘宝提供的镜像下载，比较快
npm install -g yarn --registry=https://registry.npm.taobao.org
（2）配置资源
yarn config set registry https://registry.npm.taobao.org -g
yarn config set sass_binary_site http://cdn.npm.taobao.org/dist/node-sass -g

也可以不用淘宝镜像，直接快速安装：
npm install -g yarn

判断 yarn 是否安装成功
yarn -v

.prettierrc 文件配置：
{
// tab 缩进大小,默认为 2
"tabWidth": 4,
// 使用 tab 缩进，默认 false
"useTabs": false,
// 使用分号, 默认 true
"semi": false,
// 使用单引号, 默认 false(在 jsx 中配置无效, 默认都是双引号)
"singleQuote": false,
// 行尾逗号,默认 none,可选 none|es5|all
// es5 包括 es5 中的数组、对象
// all 包括函数对象等所有可选
"TrailingCooma": "all",
// 对象中的空格 默认 true
// true: { foo: bar }
// false: {foo: bar}
"bracketSpacing": true,
// JSX 标签闭合位置 默认 false
// false: <div
// className=""
// style={{}}
// >
// true: <div
// className=""
// style={{}} >
"jsxBracketSameLine": false,
// 箭头函数参数括号 默认 avoid 可选 avoid| always
// avoid 能省略括号的时候就省略 例如 x => x
// always 总是有括号
"arrowParens": "avoid"
}

## 环境

- windows 10
- nodejs v12.13.0
  > 推荐使用 nvm 安装 nodejs [https://github.com/coreybutler/nvm-windows](https://github.com/coreybutler/nvm-windows)
- npm v6.12.0
- 包管理工具 yarn 版本 1.19.1 [https://yarn.bootcss.com/](https://yarn.bootcss.com/docs/install/#windows-stable)
- 开发工具 vscode
  > 项目中.vscode 目录保存了推荐 vscode 配置，extensions.json 为推荐扩展， settings.json 为推荐配置
- nest 版本: 7.1.2

## 开发

1. 获取项目

```bash

git clone git@github.com:Funch-Yang/start-nest-project.git # 拉取代码
cd sdy-third-party
yarn install
yarn start:dev

```

2. 项目根目录下新建.env 文件

```
NODE_ENV=develop

PORT=3000

DB_TYPE=mysql
DB_HOST=localhost
DB_PORT=3306
DB_CHARSET=utf8mb4
DB_USERNAME=root
DB_PASSWORD=123456
DB_DATABASE=nest_demo

```

## 项目结构

```text
src
├─ confing // 配置模块
├─ core // 核心中间件模块
├─ entity // 数据库实体模块
└─ modules // 业务逻辑模块目录，所有业务相关逻辑都放到该目录对应的模块
```

所有业务相关的逻辑都应存放于`modules`目录下，接口按照功能模块划分，通常以表为参考，即一张表（除关系表外）对应一个功能模块。例如：用户相关的功能，应该全部位于`/modules/user/`目录下。

## 接口规范(restful api)

### 接口返回格式

接口返回格式统一为

```typescript
{
  code: number; // 错误码
  message: string; // 错误信息
  data: any;
  timestamp: any; // 时间戳
}
```

## 相关技术

- nodejs [https://nodejs.org/en/docs/](https://nodejs.org/en/docs/)
- typescript [https://www.tslang.cn/docs/home.html](https://www.tslang.cn/docs/home.html)
- 项目框架 [nestjs][https://docs.nestjs.com/](https://docs.nestjs.com/)
- 框架平台 [express][https://expressjs.com/](https://expressjs.com/)
- 数据库 ORM 框架 [typeorm][https://typeorm.io/#/](https://typeorm.io/#/)
- 登录认证 [Passport.js][http://www.passportjs.org/](http://www.passportjs.org/)
- 文档 [swagger-ui-express][https://www.npmjs.com/package/swagger-ui-express](https://www.npmjs.com/package/swagger-ui-express)
