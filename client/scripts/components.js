/**
 * pages页面快速生成脚本 
 * 
 * 用法：npm run comp `文件名`
 * 
 */

// eslint-disable-next-line import/no-commonjs
const fs = require('fs');



const dirName = process.argv[2];
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);
const camelName = require('./util').toCamel(capPirName);

if (!dirName) {
  console.log('文件夹名称不能为空！');
  console.log('示例：npm run comp test');
  process.exit(0);
}
const propInterface = `I${camelName}Props`;
const stateInterface = `I${camelName}State`;
// for the convenience of import
const fileName = `index`;
//页面模板
const indexTep = `import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { ${propInterface}, ${stateInterface} } from './${fileName}.interface'
import './${fileName}.scss'

class ${camelName} extends Component<${propInterface},${stateInterface} > {
  constructor(props: ${propInterface}) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:${propInterface} = {}
  render() {
    return (
      <View className='fx-${dirName}'>
      </View>
    )
  }
}
export default ${camelName}
`

// scss文件模版
const scssTep = `@import "@/styles/variables.scss";
@import "@/styles/mixins/index.scss";

.#{$prefix} {
  &-${dirName} {
    width: 100%;
  }
}
`

const interfaceTep = `/**
 * ${dirName}.state 参数类型
 *
 * @export
 * @interface ${stateInterface}
 */
export interface ${stateInterface} {}
/**
 * ${dirName}.props 参数类型
 *
 * @export
 * @interface ${propInterface}
 */
export interface ${propInterface} {}
`

fs.mkdirSync(`./src/components/${dirName}`); // mkdir $1
process.chdir(`./src/components/${dirName}`); // cd $1

fs.writeFileSync(`${fileName}.tsx`, indexTep); //tsx
fs.writeFileSync(`${fileName}.scss`, scssTep); // scss
fs.writeFileSync(`${fileName}.interface.ts`, interfaceTep); // interface
