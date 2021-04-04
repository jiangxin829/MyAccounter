import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
} from 'react-native';

import { HeadingBig, Heading2, styles_common, Tips } from '../../../assets/js/CommonStyles'
import Header from '../../../assets/js/components/Header'

export default class TypeDetailPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            deals: this.props.navigation.getParam('deals',{})[this.props.navigation.getParam('dealName','')],
        }
    }

    //渲染list
    renderList() {
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
        let cells = [];
        this.state.deals.detail.forEach((item,index)=>{
            let cell = <TouchableOpacity 
                activeOpacity={0.5}
                style={[styles_common.rowStartCenter, styles.resultItem]} 
                key={index}
                onPress={()=>this.props.navigation.navigate('ConsumeDetail', {deal: item, onBackRefresh: this.getData})}
            >
                <Image source={dealImage[item.dealName]} style={styles.resultIcon} />
                <View style={{flex:1}}>
                    <Heading2>{item.dealName}</Heading2>
                    {item.dealNote?<Tips numberOfLines={1} ellipsizeMode='tail'style={{color:'#A5A5A5', width:150}}>{item.dealNote}</Tips>:null}
                </View>
                <View style={{alignItems: 'flex-end'}}>
                    <Heading2>{item.dealNumber}</Heading2>
                    <Tips style={{color: '#A5A5A5'}}>{item.dealTime}</Tips>
                </View>
            </TouchableOpacity>
            cells.push(cell);
        })
        return cells;
    }

    //获取本地数据
    getData = () => {
        //待更新
    }

    render() {
        return (
            <View style={styles_common.containerGray}>
                {/* 渲染头部组件 */}
                <Header
                    headerBgc={{backgroundColor: '#F3F4F8'}}
                    navigation={this.props.navigation}
                    back={true}
                    // onBackRefresh={this.props.navigation.state.params.onBackRefresh}
                    title={this.state.deals.dealName}
                />
                <ScrollView>
                    <View style={[styles_common.columnBetweenCenter, styles.radiusBox]}>
                        <Heading2 style={{color: 'white'}}>{this.props.navigation.getParam('time','')}</Heading2>
                        <View style={[styles_common.rowBetweenCenter, {width: '100%'}]}>
                            <Heading2 style={{color: 'white'}}>{this.props.navigation.getParam('isOut',true)?'总支出:':'总收入:'}</Heading2>
                            <HeadingBig style={{color: 'white'}}>{this.state.deals.dealNumber.toFixed(2)}</HeadingBig>
                        </View>
                    </View>
                    <View>
                        {/* 渲染list */}
                        {this.renderList()}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    radiusBox: {
        marginHorizontal: 15,
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 30,
        borderRadius: 10,
        height: 100,
        backgroundColor: '#FFD778'
    },
    resultItem: {
        marginHorizontal: 15,
        marginVertical: 5,
        paddingVertical: 10,
        paddingHorizontal: 10,
        backgroundColor: 'white',
        borderRadius: 10
    },
    resultIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
        borderRadius: 20
    },
});