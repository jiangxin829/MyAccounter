import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import { View, StyleSheet } from 'react-native';
import { Tabs } from '@ant-design/react-native';

import { styles_common } from '../../../assets/js/CommonStyles'
import Header from '../../../assets/js/components/Header'
import PieChart from './PieChart';
import LineChart from './LineChart';

export default class AnalysePage extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles_common.containerGray}>
                {/* 渲染头部组件 */}
                <Header 
                    navigation={this.props.navigation}
                    back={true}
                    title='统计分析'
                    headerBgc={{backgroundColor:'transparent'}}
                />
                {/* 标题 */}
                <View style={[styles_common.rowCenterCenter, styles.header]}>
                   <Tabs tabs={[{title: '分类'}, {title: '趋势'}]} 
                        tabBarBackgroundColor='transparent' 
                        tabBarUnderlineStyle={{backgroundColor: '#FFDB99'}}
                        tabBarTextStyle={{fontSize: 16}}
                        tabBarActiveTextColor='black'
                        tabBarInactiveTextColor='#A5A5A5'
                    >
                       <View style={styles.body}>
                           <PieChart navigation={this.props.navigation}/>
                       </View>
                       <View style={styles.body}>
                           <LineChart />
                       </View>
                   </Tabs>
                </View>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        flex: 1,
        top: -15
    },
    body: {
        flex: 1,
        paddingVertical: 5
    }
});