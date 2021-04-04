import React, {Component} from 'react';
import {View, TouchableOpacity, StyleSheet, Text, Image} from 'react-native';

import { Heading2, styles_common, Tips } from '../../../../assets/js/CommonStyles'

export default class MonthItem extends Component{
    constructor(props){
        super(props);
        this.state= {
            showDetail: true,
            monthDetail: this.props.monthDetail,//通过props传到组件中，再用state去渲染，当父组件传值更新时，无法更新子组件内容，本行待删
        }
    }

    //是否收起详情
    toggleShowDetail = () => {
        this.setState({showDetail: !this.state.showDetail})
    }

    //渲染月份消费详情
    renderMonthDetail() {
        //console.warn(this.props.monthDetail)
        let cells = [];
        let newMonthDetail = [];
        let dealImage = {
            '转账': require('../../../../assets/img/accounting/accounting_secondhand.png'),

            '早餐': require('../../../../assets/img/accounting/accounting_breakfast.png'),
            '午餐': require('../../../../assets/img/accounting/accounting_lunch.png'),
            '晚餐': require('../../../../assets/img/accounting/accounting_dinner.png'),
            '零食': require('../../../../assets/img/accounting/accounting_snack.png'),
            '饮料': require('../../../../assets/img/accounting/accounting_drink.png'),
            '买菜': require('../../../../assets/img/accounting/accounting_vegetable.png'),
            '水果': require('../../../../assets/img/accounting/accounting_fruit.png'),
            '香烟': require('../../../../assets/img/accounting/accounting_cigarette.png'),

            '生活用品': require('../../../../assets/img/accounting/accounting_dailyuse.png'),
            '服装': require('../../../../assets/img/accounting/accounting_clothes.png'),
            '包包': require('../../../../assets/img/accounting/accounting_bag.png'),
            '鞋子': require('../../../../assets/img/accounting/accounting_shoes.png'),
            '护肤彩妆': require('../../../../assets/img/accounting/accounting_cosmetic.png'),
            '饰品': require('../../../../assets/img/accounting/accounting_jewels.png'),
            '美容美甲': require('../../../../assets/img/accounting/accounting_manicure.png'),

            '交通': require('../../../../assets/img/accounting/accounting_traffic.png'),
            '加油': require('../../../../assets/img/accounting/accounting_gasoline.png'),
            '停车费': require('../../../../assets/img/accounting/accounting_parking.png'),
            '打车': require('../../../../assets/img/accounting/accounting_taxi.png'),
            '地铁': require('../../../../assets/img/accounting/accounting_subway.png'),
            '火车': require('../../../../assets/img/accounting/accounting_train.png'),
            '公交车': require('../../../../assets/img/accounting/accounting_bus.png'),
            '机票': require('../../../../assets/img/accounting/accounting_aircraft.png'),
            '修车养车': require('../../../../assets/img/accounting/accounting_repair.png'),

            '工资': require('../../../../assets/img/accounting/accounting_wage.png'),
            '生活费': require('../../../../assets/img/accounting/accounting_livingexpense.png'),
            '投资收入': require('../../../../assets/img/accounting/accounting_invest.png'),
            '兼职外快': require('../../../../assets/img/accounting/accounting_parttimejob.png'),
            '红包': require('../../../../assets/img/accounting/accounting_hongbao.png'),
            '二手闲置': require('../../../../assets/img/accounting/accounting_secondhand.png'),
            '报销': require('../../../../assets/img/accounting/accounting_reimburse.png'),
        }
        this.props.monthDetail.forEach(value=>{
            if(newMonthDetail[parseInt(value.dealTime.split('-')[2])]) {
                newMonthDetail[parseInt(value.dealTime.split('-')[2])].push(value);
            } else {
                newMonthDetail[parseInt(value.dealTime.split('-')[2])] = [];
                newMonthDetail[parseInt(value.dealTime.split('-')[2])].push(value);
            }
        })
        let lastIndex = newMonthDetail.some((value,index)=>{
            if(value!=null) {
                //console.warn(index)
                return index;
            }
        })
        for(let i=newMonthDetail.length-1; i>0; i--) {
            if(newMonthDetail[i]!=null) {
                newMonthDetail[i].forEach((value,index)=>{
                    let cell = <TouchableOpacity 
                            key={value._id} 
                            activeOpacity={0.5}
                            style={[styles_common.rowCenterCenter, {paddingTop: 10}, ]} activeOpacity={0.5} 
                            onPress={()=>this.props.navigation.navigate('ConsumeDetail', {deal: value, onBackRefresh: this.props.onBackRefresh})}
                        >
                        {index==0?<Heading2 style={styles.detailTime}>{' '+i+'日'}</Heading2>:<View style={styles.detailTime}/>}
                        <View style={[styles_common.rowCenterCenter, {flex: 1, paddingBottom: 10}, i==lastIndex&&index==newMonthDetail[i].length-1?null:{borderBottomColor: '#F3F4F8', borderBottomWidth:1}]}>
                            <Image source={dealImage[value.dealName]} style={styles.detailIcon}/>
                            <View style={{flex:1}}>
                                <Heading2>{value.dealName}</Heading2>
                                {value.dealNote?<Tips numberOfLines={1} ellipsizeMode='tail'style={{color:'#A5A5A5', width:150}}>{value.dealNote}</Tips>:null}
                            </View>
                            {value.dealType=='收'||(value.dealType=='转'&&value.inAccountId==this.props.account._id)?
                            <Heading2 style={{color:'#54D19C'}}>{'+'+value.dealNumber}</Heading2>:
                            <Heading2 style={{color:'#E77376'}}>{'-'+value.dealNumber}</Heading2>}
                        </View>
                    </TouchableOpacity>
                    cells.push(cell);
                })
            }
        }
        return cells;
    }

    render(){
        return(
            <View style={styles.radiusBox}>
                <TouchableOpacity 
                    style={[styles_common.rowBetweenCenter, this.state.showDetail?
                        {borderBottomColor: '#F3F4F8', borderBottomWidth:1, paddingBottom: 10}:{paddingBottom: 15}]}
                    activeOpacity={0.5}
                    onPress={this.toggleShowDetail}>
                    <Heading2 style={{width: 50, flex: 1}}>{this.props.month}月份</Heading2>
                    <View style={{flex:1}}>
                        <Tips style={{color:'#54D19C', fontWeight: '600'}}>流入:{this.props.monthIn}</Tips>
                        <Tips style={{color:'#E77376', fontWeight: '600'}}>流出:{this.props.monthOut}</Tips>
                    </View>
                    <View style={styles.arrowIconBox}>
                        {this.state.showDetail?<Image style={styles.arrowIcon} source={require('../../../../assets/img/account/account_arrow_up.png')}/>
                        :<Image style={styles.arrowIcon} source={require('../../../../assets/img/account/account_arrow_down.png')}/>}
                    </View>
                </TouchableOpacity>
                {this.state.showDetail?this.renderMonthDetail():null}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    radiusBox: {
        marginHorizontal: 15,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingTop: 15,
        borderRadius: 10,
        backgroundColor: 'white',
    },
    arrowIconBox: {
        flex: 1,
        alignItems: 'flex-end'
    },
    arrowIcon: {
        width: 14,
        height: 14  
    },
    //detail
    detailTime: {
        textAlign: 'left',
        width: 60,
        paddingBottom: 10
    },
    detailIcon: {
        width: 30,
        height: 30,
        borderRadius: 15,
        marginHorizontal: 10
    }
});