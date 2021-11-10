/// <refrence path="./vue-plugin/index.d.ts" />;

import { version as _v } from '../package.json'
import  './less/vs-tree.less'

import vsTree from './core'

// 
import plugin from './vue-plugin'

export default vsTree

// 版本号
export const version = _v

// Vue 插件
export const install = plugin(vsTree)
