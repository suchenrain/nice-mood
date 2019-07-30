/** 
 *  pages 页面快速生成脚本
 *  
 *  npm run tem '文件名‘
 */

// eslint-disable-next-line import/no-commonjs
const fs = require('fs')

const dirName = process.argv[2]
const capPirName = dirName.substring(0, 1).toUpperCase() + dirName.substring(1);

if (!dirName) {
    console.log('文件名不能为空');
    console.log('用法：npm run page test');
    process.exit(0);
}

const propInterface = `I${capPirName}Props`;
const stateInterface = `I${capPirName}State`;

// 页面模板构建

const indexTep = `
import Taro, { Component, Config } from '@tarojs/taro'
import { View } from '@tarojs/components'
// import { connect } from '@tarojs/redux'

// import Api from '@/utils/httpRequest'
// import Tips from '@/utils/tips'
// import {  } from '@/components'
import { ${propInterface}, ${stateInterface} } from './${dirName}.interface'

import './${dirName}.scss'

// @connect(({ ${dirName} }) => ({
//     ...${dirName},
// }))
class ${capPirName} extends Component<${propInterface},${stateInterface} > {
config:Config = {
    navigationBarTitleText: '页面标题'
}
constructor(props: ${propInterface}) {
    super(props)
    this.state = {}
}
componentDidMount() {
    
}
render() {
    return (
    <View className='fx-${dirName}-wrap'>
        页面内容
    </View>
    )
}
}
export default ${capPirName}
`

// scss 文件模板

const scssTep = `
@import "@/styles/variables.scss";
@import "@/styles/mixins/index.scss";

.#{$prefix} {
    &-${dirName}-wrap {
        width: 100%;
        min-height: 100Vh;
    }
}
`

// config 接口地址配置模板

const configTep = `
    export default {
        test:'/wechat/perfect-info',  //XX接口
    }
`

// 接口请求模板

const serviceTep = `
    import Api from '@/utils/httpRequest'
    export const testApi = data => Api.test(
        data
    )
`

// model 模板

const modelTep = `
    // import Taro from '@tarojs/taro';
    // import * as ${dirName}Api from './service';
    export default {
        namespace: '${dirName}',
        state: {
        },
        
        effects: {},
        
        reducers: {}
    
    }
`

const interfaceTep = `
/**
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

fs.mkdirSync(`./src/pages/${dirName}`); // mkdir $1
process.chdir(`./src/pages/${dirName}`); // cd $1

fs.writeFileSync(`${dirName}.tsx`, indexTep); //tsx
fs.writeFileSync(`${dirName}.scss`, scssTep); // scss
fs.writeFileSync('config.ts', configTep); // config
fs.writeFileSync('service.ts', serviceTep); // service
fs.writeFileSync('model.ts', modelTep); // model
fs.writeFileSync(`${dirName}.interface.ts`, interfaceTep); // interface
process.exit(0);
