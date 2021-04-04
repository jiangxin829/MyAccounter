import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    StyleSheet,
    RefreshControl,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { WhiteSpace } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Heading1, Paragraph, styles_common } from '../../../assets/js/CommonStyles'
import AccountCell from '../../../assets/js/components/AccountCell';

export default class WalletPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            isRefreshing: false,
            totalAssets: 0,
            accounts: []
        }
    }
    componentDidMount() {
        this.getData()
    }

    //从本地存储读取数据更新到state
    getData = async () => {
        try {
            let accounts = await AsyncStorage.getItem('accounts');
            let totalAssets = 0;
            accounts = JSON.parse(accounts);
            accounts.forEach(value=>{
                totalAssets+= parseFloat(value.accountNumber); 
            })
            this.setState({accounts: accounts, totalAssets: totalAssets.toFixed(2)});
        } catch(e) {
            console.error(e)
        }
      }

    //下拉刷新
    onHeaderRefresh = () => {
        this.setState({isRefreshing: true})
        this.getData()
        this.setState({isRefreshing: false})
    }

    //渲染头部组件
    renderHeader() {
        return(
            <View style={[styles_common.rowCenterCenter, styles.header]}>
                <TouchableOpacity 
                    style={styles.header_left}
                    activeOpacity ={0.5} 
                    onPress={()=>this.props.navigation.goBack()}>
                    <Image style={styles.arrow_left} source={require('../../../assets/img/account/cell_arrow_left.png')} />
                </TouchableOpacity>
                <Heading1 style={{color: 'white'}}>我的钱包</Heading1>
                <TouchableOpacity 
                    style={styles.header_right}
                    activeOpacity ={0.5} 
                    onPress={()=>this.props.navigation.navigate('TransferAccount', {accounts: this.state.accounts, onBackRefresh: this.onHeaderRefresh})}>
                    <Heading1 style={{color: 'white'}}>转账</Heading1>
                </TouchableOpacity>
            </View>
        )
    }

    //渲染账户AccountCell
    renderAccount(dataList) {
        let cells = [];
        let accountImage = {
            '现金': require('../../../assets/img/account/account_cash.png'),
            '支付宝': require('../../../assets/img/account/account_alipay.png'),
            '微信': require('../../../assets/img/account/account_wechat.png'),
            '银行卡': require('../../../assets/img/account/account_card.png'),
            '蚂蚁花呗': require('../../../assets/img/account/account_huabei.png'),
            '京东白条': require('../../../assets/img/account/account_jd.png'),
        }
        dataList.forEach((value, index)=> {
            let cell = 
                <AccountCell 
                    key={index}
                    account={value}
                    title={value.accountName} 
                    accountType={value.accountType}
                    subtitle={value.accountNumber} 
                    image={accountImage[value.accountType]} 
                    style={styles.accountItem}
                    screen='WalletAccount'
                    navigation={this.props.navigation}
                    onBackRefresh= {this.onHeaderRefresh}
                />
            cells.push(cell)
        })
        return (
            <View>
                {cells}
            </View>
        )
    }

    render() {
        return (
            <View style={styles_common.containerGray}>
                {/* 渲染背景 */}
                <View style={styles.walletBgc}/>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={this.onHeaderRefresh}
                            colors={['#EB705E']}
                        />
                    }>
                    {/* 渲染头部 */}
                    {this.renderHeader()}
                    {/* 总资产 */}
                    <View style={styles_common.columnCenterCenter}>
                        <Paragraph style={{color: '#FFB6A4'}}>总资产</Paragraph>
                        <WhiteSpace/>
                        <Heading1 style={{color: 'white'}}>{this.state.totalAssets}</Heading1>
                    </View>
                    <WhiteSpace size='lg' />
                    
                    {this.renderAccount(this.state.accounts)}

                    {/* 新建账户 */}
                    <AccountCell
                        title='新建账户'
                        image={require('../../../assets/img/account/account_add.png')} 
                        style={styles.accountItem}
                        screen='ChooseAccountType' 
                        navigation={this.props.navigation}
                        onBackRefresh= {this.onHeaderRefresh}
                    />
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    walletBgc: {
        position: 'absolute',
        width: '100%', //缺width属性View不显示
        height: 180,
        backgroundColor: '#EB705E'
    },
    header: {
        position: 'relative',
        height: 60,
        
    },
    header_left: {
        position: 'absolute',
        top: 21,
        left: 16,
        paddingHorizontal: 4,
    },
    arrow_left: {
        width: 20,
        height: 20
    },
    header_right: {
        position: 'absolute',
        top: 10,
        right: 15,
        height: 40,
        justifyContent: 'center'
    },
    accountItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
    }
});