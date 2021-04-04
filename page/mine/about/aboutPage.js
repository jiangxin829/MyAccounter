import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';

import { Heading2, styles_common, Paragraph } from '../../../assets/js/CommonStyles'
import Header from '../../../assets/js/components/Header'

export default class AboutPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            version: 'V 2.4.2.0',
            qqNumber: '2967115803',
            qqEmail: '2967115803@qq.com'
        }
    }

    render() {
        return (
            <View style={styles_common.containerWhite}>
                {/* 渲染头部组件 */}
                <Header 
                    navigation={this.props.navigation}
                    back={true}
                    title='关于APP'
                />
                <ScrollView>
                    <View style={[styles_common.columnCenterCenter, styles.logo]}>
                        <Image style={styles.logoImg} source={require('../../../assets/img/MyAccounter.png')}></Image>
                    </View>
                    <TouchableOpacity activeOpacity ={0.5} style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                        <Heading2>检查更新</Heading2>
                        <View style={styles_common.rowCenterCenter}>
                            <Heading2>{this.state.version?this.state.version:'获取失败'}</Heading2>
                            <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity ={0.5} style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                        <Heading2>好评鼓励</Heading2>
                        <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity ={0.5} style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                        <Heading2>联系QQ</Heading2>
                        <View style={styles_common.rowCenterCenter}>
                            <Heading2 >{this.state.qqNumber}</Heading2>
                            <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity activeOpacity ={0.5} style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                        <Heading2>给我们写信</Heading2>
                        <View style={styles_common.rowCenterCenter}>
                            <Heading2>{this.state.qqEmail}</Heading2>
                            <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    logo: {
        height: 150
    },
    logoImg: {
        width: 100,
        height: 100
    },
    bodyItem: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#F3F4F8',
        height: 60,
        backgroundColor: 'white'
    },
});