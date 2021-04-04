import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity
} from 'react-native';

import { WhiteSpace } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { HeadingBig, Heading2, styles_common, Tips } from '../../../../assets/js/CommonStyles'
import Header from '../../../../assets/js/components/Header'
import MonthItem from './MonthItem'

export default class WalletAccountPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            account: this.props.navigation.getParam('account',{}),
            currentYear: new Date().getFullYear(),
            accountDeals: [],
            yearDetail: {},
        }
    }

    componentDidMount() {
        this.getData()
    }

    //从本地存储读取数据更新到state
    getData = async () => {
        try {
            let deals = await AsyncStorage.getItem('deals');
            deals = JSON.parse(deals);
            let accounts = await AsyncStorage.getItem('accounts');
            accounts = JSON.parse(accounts);
            accounts.forEach(value=>{
                if(value._id==this.state.account._id) {
                    this.setState({account: value})
                }
            })
            let accountDeals = [];
            deals.forEach(value=>{
                if(value.outAccountId==this.state.account._id) {
                    accountDeals.push(value);
                }
                if(value.inAccountId&&value.inAccountId==this.state.account._id) {
                    accountDeals.push(value);
                }
            })
            this.setState({accountDeals: accountDeals});
            //默认获取当前年度数据
            this.getYearDetail(this.state.currentYear, accountDeals);
        } catch(e) {
            console.error(e)
        }
    }

    //计算年份支出收入
    getYearDetail = (currentYear,deals) => {
        //设置当前页面年份
        this.setState({currentYear: currentYear})
        let yearDetail = {
            currentYear: currentYear,
            currentYearIn: 0,
            currentYearOut: 0,
            monthDetail: {},
        };
        deals.forEach((value, index)=>{
            let dealTime = value.dealTime.split('-');
            //console.warn(dealTime);
            if(dealTime[0]==currentYear) {
                if(value.dealType=='收') {
                    yearDetail.currentYearIn+=parseFloat(value.dealNumber);
                } else if(value.dealType=='转') {
                    if(value.inAccountId==this.state.account._id) {
                        yearDetail.currentYearIn+=parseFloat(value.dealNumber);
                    }
                    if(value.outAccountId==this.state.account._id) {
                        yearDetail.currentYearOut+=parseFloat(value.dealNumber);
                    }
                } else {
                    yearDetail.currentYearOut+=parseFloat(value.dealNumber);
                }
                if(yearDetail.monthDetail[dealTime[1]]) {
                    yearDetail.monthDetail[dealTime[1]].push(value);
                } else {
                    yearDetail.monthDetail[dealTime[1]] = [];
                    yearDetail.monthDetail[dealTime[1]].push(value);
                }
            }
        })
        //console.warn(yearDetail);
        yearDetail.currentYearIn = yearDetail.currentYearIn.toFixed(2);
        yearDetail.currentYearOut = yearDetail.currentYearOut.toFixed(2);
        this.setState({yearDetail: yearDetail});
    }

    //渲染MonthItem
    renderMonthItem(monthDetail){
        let cells = [];
        let newMonthDetail = [];
        for(let month in monthDetail) {
            newMonthDetail[parseInt(month)] = monthDetail[month];
        }
        
        for(let i=newMonthDetail.length-1;i>0;i--) {  
            if(newMonthDetail[i]!=null) {
                let monthIn = 0;
                let monthOut = 0;
                newMonthDetail[i].forEach(value=>{
                    if(value.dealType=='收') {
                        monthIn+=parseFloat(value.dealNumber);
                    } else if(value.dealType=='转') {
                        if(value.inAccountId==this.state.account._id) {
                            monthIn+=parseFloat(value.dealNumber);
                        }
                        if(value.outAccountId==this.state.account._id) {
                            monthOut+=parseFloat(value.dealNumber);
                        }
                    } else {
                        monthOut+=parseFloat(value.dealNumber);
                    }
                })
                let cell = <MonthItem 
                    month={i} 
                    monthIn={monthIn.toFixed(2)} 
                    monthOut={monthOut.toFixed(2)} 
                    key={i} 
                    monthDetail={newMonthDetail[i]} 
                    account={this.state.account}
                    navigation={this.props.navigation}
                    onBackRefresh={this.getData}
                />
                //console.warn(newMonthDetail[i]);
                cells.push(cell);
            }
        }
        return cells;
    }

    //从设置页面传来数据更新页面
    onSaveAccount = (account) => {
        //console.warn(account)
        this.setState({account: account})
    }

    //设置页面
    setting = () => {
        this.props.navigation.navigate('WalletAccountSetting', {
            'account': this.state.account, 
            onSaveAccount: this.onSaveAccount,
            onBackRefresh: this.props.navigation.state.params.onBackRefresh,
            //此页面返回导航goBack的key 用于设置页面删除后直接跳转到walletPage
            'backKey': this.props.navigation.state.key
        })
    }

    render() {
        let color = {
            '现金': '#A1E495',
            '支付宝': '#75C6FE',
            '微信': '#6CD8AC',
            '银行卡': '#FED47E',
            '蚂蚁花呗': '#75C6FD',
            '京东白条': '#FC8589',
        };
        let titleColor= color[this.state.account.accountType];
        return (
            <View style={styles_common.containerGray}>
                {/* 渲染头部组件 */}
                <Header
                    headerBgc={{backgroundColor: '#F3F4F8'}}
                    navigation={this.props.navigation}
                    back={true}
                    onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                    title={this.state.account.accountName}
                    subtitle='设置'
                    subtitleMethod={this.setting}
                />
                <ScrollView>
                    <WhiteSpace />
                    {/* 年流入流出 */}
                    <View style={[{backgroundColor: titleColor}, styles.radiusBox]}>
                        <WhiteSpace size='sm' />
                        <View style={styles_common.rowStartCenter}>
                            <HeadingBig style={{color: 'white'}}>{this.state.account.accountNumber}&nbsp;</HeadingBig>
                            <TouchableOpacity onPress={this.setting}>
                                <Image style={styles.penIcon} source={require('../../../../assets/img/account/account_pen.png')}></Image>
                            </TouchableOpacity>
                        </View>
                        <Tips>账户余额</Tips>
                        <View style={styles_common.rowStartCenter}>
                            <View style={{flex: 1}}>
                                <View style={styles_common.rowStartCenter}>
                                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.getYearDetail(this.state.currentYear-1, this.state.accountDeals)}}>
                                    <Tips style={{fontSize: 18}}>&lt;&nbsp;&nbsp;</Tips>
                                    </TouchableOpacity>
                                        <Heading2 style={{color: 'white'}}>{this.state.yearDetail.currentYear}</Heading2>
                                    <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.getYearDetail(parseInt(this.state.currentYear)+1, this.state.accountDeals)}}>
                                        <Tips style={{fontSize: 18}}>&nbsp;&nbsp;&gt;</Tips>
                                    </TouchableOpacity>
                                </View>
                                <Tips>年份</Tips>
                            </View>
                            <View style={{flex: 1}}>
                                <Heading2 style={{color: 'white'}}>{this.state.yearDetail.currentYearOut}</Heading2>
                                <Tips>流出</Tips>
                            </View>
                            <View style={{flex: 1}}>
                                <Heading2 style={{color: 'white'}}>{this.state.yearDetail.currentYearIn}</Heading2>
                                <Tips>流入</Tips>
                            </View>
                        </View>
                    </View>
                    {/* 月份流入流出及明细 */}
                    {this.renderMonthItem(this.state.yearDetail.monthDetail)}
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    radiusBox: {
        marginHorizontal: 15,
        marginVertical: 5,
        padding: 15,
        borderRadius: 10,
    },
    penIcon: {
        width: 18,
        height: 18  
    }
});