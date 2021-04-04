import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';

import { Heading2, styles_common } from '../../../assets/js/CommonStyles'

export default class ListItem extends Component{
    constructor(props){
        super(props);
        this.state= {
            showDetail: true,
        }
    }

    //是否收起详情
    toggleShowDetail = () => {
        this.setState({showDetail: !this.state.showDetail})
    }

    //渲染月份详情
    renderMonthDetail() {
        let cells = [];
        let dealImage = {
            '转账': require('../../../assets/img/accounting/accounting_secondhand.png'),

            '早餐': require('../../../assets/img/accounting/accounting_breakfast.png'),
            '午餐': require('../../../assets/img/accounting/accounting_lunch.png'),
            '晚餐': require('../../../assets/img/accounting/accounting_dinner.png'),
            '零食': require('../../../assets/img/accounting/accounting_snack.png'),
            '饮料': require('../../../assets/img/accounting/accounting_drink.png'),
            '买菜': require('../../../assets/img/accounting/accounting_vegetable.png'),
            '水果': require('../../../assets/img/accounting/accounting_fruit.png'),
            '香烟': require('../../../assets/img/accounting/accounting_cigarette.png'),

            '生活用品': require('../../../assets/img/accounting/accounting_dailyuse.png'),
            '服装': require('../../../assets/img/accounting/accounting_clothes.png'),
            '包包': require('../../../assets/img/accounting/accounting_bag.png'),
            '鞋子': require('../../../assets/img/accounting/accounting_shoes.png'),
            '护肤彩妆': require('../../../assets/img/accounting/accounting_cosmetic.png'),
            '饰品': require('../../../assets/img/accounting/accounting_jewels.png'),
            '美容美甲': require('../../../assets/img/accounting/accounting_manicure.png'),

            '交通': require('../../../assets/img/accounting/accounting_traffic.png'),
            '加油': require('../../../assets/img/accounting/accounting_gasoline.png'),
            '停车费': require('../../../assets/img/accounting/accounting_parking.png'),
            '打车': require('../../../assets/img/accounting/accounting_taxi.png'),
            '地铁': require('../../../assets/img/accounting/accounting_subway.png'),
            '火车': require('../../../assets/img/accounting/accounting_train.png'),
            '公交车': require('../../../assets/img/accounting/accounting_bus.png'),
            '机票': require('../../../assets/img/accounting/accounting_aircraft.png'),
            '修车养车': require('../../../assets/img/accounting/accounting_repair.png'),

            '工资': require('../../../assets/img/accounting/accounting_wage.png'),
            '生活费': require('../../../assets/img/accounting/accounting_livingexpense.png'),
            '投资收入': require('../../../assets/img/accounting/accounting_invest.png'),
            '兼职外快': require('../../../assets/img/accounting/accounting_parttimejob.png'),
            '红包': require('../../../assets/img/accounting/accounting_hongbao.png'),
            '二手闲置': require('../../../assets/img/accounting/accounting_secondhand.png'),
            '报销': require('../../../assets/img/accounting/accounting_reimburse.png'),
        }
        for (let value in this.props.list.detail) {
            let cell = <TouchableOpacity 
                activeOpacity={0.5} 
                style={styles.listItem} 
                key={value} 
                onPress={()=>this.props.navigation.navigate('TypeDetail', {
                    'deals': this.props.list.detail, 
                    'dealName': value, 
                    'time': this.props.time,
                    'isOut': this.props.isOut
                })}
            >
                <Image source={dealImage[value]} style={styles.icon} />
                <Heading2 style={{color: '#A5A5A5'}}>{this.props.list.detail[value].dealName}</Heading2>
                <View style={{flex: 1}}></View>
                <Heading2 style={{color: '#A5A5A5'}}>{this.props.list.detail[value].dealNumber.toFixed(2)}</Heading2>
            </TouchableOpacity>
            cells.push(cell);
        }
        return cells;
    }

    render(){
        //console.warn(this.props.list)
        return(
            <View style={this.props.index==this.props.length-1?null:styles.bottomBorder}>
                <TouchableOpacity 
                activeOpacity={0.5} 
                style={styles_common.rowBetweenCenter}
                onPress={this.toggleShowDetail}
                >
                    {/* <View style={styles.arrowIconBox}>
                        {this.state.showDetail?<Image style={styles.arrowIcon} source={require('../../../../assets/img/account/account_arrow_up.png')}/>
                        :<Image style={styles.arrowIcon} source={require('../../../../assets/img/account/account_arrow_down.png')}/>}
                    </View> */}
                    <Heading2>{this.props.list.dealType+' / '}</Heading2>
                    <Heading2 style={{color: '#A5A5A5'}}>{(this.props.count*100).toFixed(2)+'%'}</Heading2>
                    <View style={{flex: 1}}/>
                    <Heading2>{this.props.list.dealNumber.toFixed(2)}</Heading2>
                </TouchableOpacity>
                {this.state.showDetail?<View style={styles.list}>
                    {this.renderMonthDetail()}
                </View>:null}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F8',
        paddingBottom: 10,
        marginBottom: 10
    },
    list: {
        marginHorizontal: 10,
        marginTop: 10,
        padding: 5,
        borderRadius: 10,
        backgroundColor: '#F3F4F8'
    },
    listItem: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 5
    },
    icon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginRight: 5
    }
});