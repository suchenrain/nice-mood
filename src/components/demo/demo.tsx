import Taro, { Component } from '@tarojs/taro'
import { View } from '@tarojs/components'

import { IDemoProps, IDemoState } from './demo.interface'
import './demo.scss'

class Demo extends Component<IDemoProps,IDemoState > {
  constructor(props: IDemoProps) {
    super(props)
    this.state = {}
  }
  static options = {
    addGlobalClass: true
  }
  static defaultProps:IDemoProps = {}
  render() {
    return (
      <View className='fx-demo-wrap'>
      </View>
    )
  }
}
export default Demo
