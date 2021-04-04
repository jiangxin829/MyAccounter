import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Dimensions,
} from 'react-native';

import { Heading2, styles_common, Paragraph } from '../CommonStyles'

var screenWidth = Dimensions.get('window').width;

export default class AccountMenuItem extends Component{
    render() {
        let accountImage = {
            '现金': require('../../../assets/img/account/account_cash.png'),
            '支付宝': require('../../../assets/img/account/account_alipay.png'),
            '微信': require('../../../assets/img/account/account_wechat.png'),
            '银行卡': require('../../../assets/img/account/account_card.png'),
            '蚂蚁花呗': require('../../../assets/img/account/account_huabei.png'),
            '京东白条': require('../../../assets/img/account/account_jd.png'),
        }
        return(
            <TouchableOpacity 
                style={[styles_common.rowStartCenter, styles.menuItem, this.props.isOdd&&this.props.isLast?{width:screenWidth/2-15}:{flex:1}]} 
                activeOpacity={0.5}
                onPress={()=>this.props.onSelecte(this.props.account)}  
            >
                <Image style={styles.menuItemIcon} source={accountImage[this.props.account.accountType]}/>
                <View style={{paddingLeft: 10}}>
                    <Heading2>{this.props.account.accountName}</Heading2>
                    <Paragraph>{'余额:'+this.props.account.accountNumber}</Paragraph>
                </View>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    menuItem: {
        height: 55,
        borderRadius: 10,
        backgroundColor: 'white',
        margin: 5,
        padding: 10
    },
    menuItemIcon: {
        width: 40,
        height: 40,
        borderRadius: 20
    },
});