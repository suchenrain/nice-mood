
    import Taro, { Component, Config } from '@tarojs/taro'
    import { View } from '@tarojs/components'
    // import { connect } from '@tarojs/redux'
    // import Api from '../../utils/httpRequest'
    // import Tips from '../../utils/tips'
    import { IndexProps, IndexState } from './index.interface'
    import './index.scss'
    // import {  } from '../../components'
    // @connect(({ index }) => ({
    //     ...index,
    // }))
    class Index extends Component<IndexProps,IndexState > {
    config:Config = {
        navigationBarTitleText: '页面标题'
    }
    constructor(props: IndexProps) {
        super(props)
        this.state = {}
    }
    componentDidMount() {
        
    }
    render() {
        return (
        <View className='fx-index-wrap'>
            页面内容
        </View>
        )
    }
    }
    export default Index
