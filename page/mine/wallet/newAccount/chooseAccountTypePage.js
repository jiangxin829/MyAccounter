import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    ScrollView,
} from 'react-native';

import { styles_common } from '../../../../assets/js/CommonStyles'
import Header from '../../../../assets/js/components/Header'
import AccountCell from '../../../../assets/js/components/AccountCell'

export default class ChooseAccountTypePage extends Component {
    constructor(props){
        super(props)
        this.state = {
        }
    }

    render() {
        return (
            <View style={styles_common.containerWhite}>
                {/* 渲染头部组件 */}
                <Header 
                    navigation={this.props.navigation}
                    back={true}
                    title='选择账户类型'
                />
                <ScrollView>
                    <AccountCell
                        image={require('../../../../assets/img/account/account_cash.png')}
                        title='现金'
                        style={{borderBottomWidth: 1, borderColor: '#F3F4F8'}}
                        screen='NewAccount'
                        navigation={this.props.navigation}
                        onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                        backKey={this.props.navigation.state.key}
                    />
                    <AccountCell
                        image={require('../../../../assets/img/account/account_alipay.png')}
                        title='支付宝'
                        style={{borderBottomWidth: 1, borderColor: '#F3F4F8'}}
                        screen='NewAccount'
                        navigation={this.props.navigation}
                        onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                        backKey={this.props.navigation.state.key}
                    />
                    <AccountCell
                        image={require('../../../../assets/img/account/account_wechat.png')}
                        title='微信'
                        style={{borderBottomWidth: 1, borderColor: '#F3F4F8'}}
                        screen='NewAccount'
                        navigation={this.props.navigation}
                        onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                        backKey={this.props.navigation.state.key}
                    />
                    <AccountCell
                        image={require('../../../../assets/img/account/account_card.png')}
                        title='银行卡'
                        style={{borderBottomWidth: 1, borderColor: '#F3F4F8'}}
                        screen='NewAccount'
                        navigation={this.props.navigation}
                        onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                        backKey={this.props.navigation.state.key}
                    />
                    <AccountCell
                        image={require('../../../../assets/img/account/account_huabei.png')}
                        title='蚂蚁花呗'
                        style={{borderBottomWidth: 1, borderColor: '#F3F4F8'}}
                        screen='NewAccount'
                        navigation={this.props.navigation}
                        onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                        backKey={this.props.navigation.state.key}
                    />
                    <AccountCell
                        image={require('../../../../assets/img/account/account_jd.png')}
                        title='京东白条'
                        style={{borderBottomWidth: 1, borderColor: '#F3F4F8'}}
                        screen='NewAccount'
                        navigation={this.props.navigation}
                        onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                        backKey={this.props.navigation.state.key}
                    />
                </ScrollView>
            </View>
        );
    }
}