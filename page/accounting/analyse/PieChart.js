import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    StyleSheet,
    Dimensions,
    ScrollView,
    TouchableOpacity,
    Image
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { VictoryPie } from "victory-native";
var screenWidth = Dimensions.get('window').width;

import { styles_common, Paragraph, Heading2 } from '../../../assets/js/CommonStyles'
import ListItem from './ListItem'

export default class AnalysePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentYear: new Date().getFullYear(),
            currentMonth: new Date().getMonth()+1,
            deals: [],
            isOut: true,
            monthOutChart: [],
            monthInChart: [],
            monthOutList: [],
            monthInList: {},
            total: 0,
            totalIn: 0,
            totalOut: 0
        }
    }

    componentDidMount() {
        this.getData()
    }

    //从本地存储读取数据更新到state
    getData = async () => {
        try {
            let deals = await AsyncStorage.getItem('deals');
            this.setState({deals: JSON.parse(deals)});
            //默认获取当前年度数据
            this.getyearData(this.state.currentYear, this.state.currentMonth);
        } catch(e) {
            console.error(e)
        }
    }

    //计算年份支出收入
    getyearData = (currentYear, currentMonth) => {
        //设置当前页面年份
        this.setState({currentYear: currentYear, currentMonth: currentMonth})
        let monthOutChart = [];
        let monthInChart = [];
        let monthOutList = {};
        let monthInList = {};
        let totalOut = 0;
        let totalIn = 0;
        this.state.deals.forEach((value, index)=>{
            let dealTime = value.dealTime.split('-');
            if(dealTime[0]==currentYear&&dealTime[1]==currentMonth) {
                if(value.dealType=='收') {
                    totalIn+=parseFloat(value.dealNumber);
                    //chart
                    if(monthInChart[value.dealName]) {
                        monthInChart[value.dealName].y+=parseFloat(value.dealNumber);
                    } else {
                        monthInChart[value.dealName] = {x: value.dealName, y: 0};
                        monthInChart[value.dealName].y+=parseFloat(value.dealNumber);
                    }
                    //list
                    if(monthInList[value.dealType]) {
                        monthInList[value.dealType].dealNumber+=parseFloat(value.dealNumber);
                        //detail
                        if(monthInList[value.dealType].detail[value.dealName]) {
                            monthInList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthInList[value.dealType].detail[value.dealName].detail.push(value);
                        } else {
                            monthInList[value.dealType].detail[value.dealName]={dealName: value.dealName, dealNumber: 0, detail:[]};
                            monthInList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthInList[value.dealType].detail[value.dealName].detail.push(value);
                        }
                    } else {
                        monthInList[value.dealType] = {dealType: value.dealType, dealNumber: 0, detail: {}};
                        monthInList[value.dealType].dealNumber+=parseFloat(value.dealNumber);
                        //detail
                        if(monthInList[value.dealType].detail[value.dealName]) {
                            monthInList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthInList[value.dealType].detail[value.dealName].detail.push(value);
                        } else {
                            monthInList[value.dealType].detail[value.dealName]={dealName: value.dealName, dealNumber: 0, detail:[]};
                            monthInList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthInList[value.dealType].detail[value.dealName].detail.push(value);
                        }
                    }
                } else if(value.dealType!='转') {
                    totalOut+=parseFloat(value.dealNumber);
                    //chart
                    let flag = 0;
                    if(value.dealType=='食') flag = 0;
                    if(value.dealType=='购') flag = 1;
                    if(value.dealType=='行') flag = 2;
                    if(monthOutChart[flag]) {
                        monthOutChart[flag].y+=parseFloat(value.dealNumber);
                    } else {
                        monthOutChart[flag] = {x: value.dealType, y: 0};
                        monthOutChart[flag].y+=parseFloat(value.dealNumber);
                    }
                    //list
                    if(monthOutList[value.dealType]) {
                        monthOutList[value.dealType].dealNumber+=parseFloat(value.dealNumber);
                        //detail
                        if(monthOutList[value.dealType].detail[value.dealName]) {
                            monthOutList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthOutList[value.dealType].detail[value.dealName].detail.push(value);
                        } else {
                            monthOutList[value.dealType].detail[value.dealName]={dealName: value.dealName, dealNumber: 0, detail:[]};
                            monthOutList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthOutList[value.dealType].detail[value.dealName].detail.push(value);
                        }
                    } else {
                        monthOutList[value.dealType] = {dealType: value.dealType, dealNumber: 0, detail: {}};
                        monthOutList[value.dealType].dealNumber+=parseFloat(value.dealNumber);
                        //detail
                        if(monthOutList[value.dealType].detail[value.dealName]) {
                            monthOutList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthOutList[value.dealType].detail[value.dealName].detail.push(value);
                        } else {
                            monthOutList[value.dealType].detail[value.dealName]={dealName: value.dealName, dealNumber: 0, detail:[]};
                            monthOutList[value.dealType].detail[value.dealName].dealNumber+=parseFloat(value.dealNumber);
                            monthOutList[value.dealType].detail[value.dealName].detail.push(value);
                        }
                    }
                }
            }
        })
        let newMonthOutList = [];
        let newMonthInChart = [];
        let newMonthInList = [];
        for(let item in monthOutList) {
            newMonthOutList.push(monthOutList[item]);
        }
        for(let item in monthInChart) {
            newMonthInChart.push(monthInChart[item])
        }
        for(let item in monthInList) {
            newMonthInList.push(monthInList[item]);
        }
        // console.warn('monthOutChart',monthOutChart)
        // console.warn('monthInChart',newMonthInChart)
        // console.warn('monthOutList',monthOutList)
        // console.warn('monthInList',monthInList)
        this.setState({
            monthOutChart: monthOutChart, 
            monthInChart: newMonthInChart, 
            monthOutList: newMonthOutList, 
            monthInList: newMonthInList,
            totalIn: totalIn,
            totalOut: totalOut,
            total: this.state.isOut?totalOut:totalIn,
        });
    }

    //分页
    changeMonth = (value) => {
        if(value>0) {
            if(this.state.currentMonth==12) {
                this.getyearData(this.state.currentYear+1, 1);
                this.setState({currentYear: this.state.currentYear+1, currentMonth: 1});
            } else {
                this.getyearData(this.state.currentYear, this.state.currentMonth+1);
                this.setState({currentMonth: this.state.currentMonth+1});
            }
        } else {
            if(this.state.currentMonth==1) {
                this.getyearData(this.state.currentYear-1, 12);
                this.setState({currentYear: this.state.currentYear-1, currentMonth: 12});
            } else {
                this.getyearData(this.state.currentYear, this.state.currentMonth-1);
                this.setState({currentMonth: this.state.currentMonth-1});
            }
        }
    }

    //渲染表格统计结果
    renderList = (list, total) => {
        if(list.length==0) {
            return <View style={styles_common.rowCenterCenter}>
                <Paragraph>当前月份没有记录哦~</Paragraph>
            </View>;
        } else {
            let cells = [];
            let cell = <View style={[styles_common.rowBetweenCenter, styles.bottomBorder]} key='head'>
                        <Paragraph>类别 / 比例</Paragraph>
                        <Paragraph>金额</Paragraph>
                    </View>
            cells.push(cell);
            list.forEach((value,index)=>{
                    cell = <ListItem 
                    list={value} 
                    index={index} 
                    length={list.length} 
                    key={index} 
                    count={value.dealNumber/total} 
                    time={this.state.currentYear+'.'+this.state.currentMonth}
                    isOut={this.state.isOut}
                    navigation={this.props.navigation}
                />
                cells.push(cell);
            });
            return cells;
        }
    }

    // 收入支出切换
    toggleOutIn() {
        let flag = this.state.isOut?this.state.totalIn:this.state.totalOut;
        this.setState({isOut: !this.state.isOut,total: flag});
    }

    render() {
        return (
            <View style={styles_common.containerGray}>
                <ScrollView>
                    {/* 饼状图 */}
                    <View style={[styles.card, {height: 360}]}>
                        {/* chart头部 */}
                        <View style={styles_common.rowBetweenCenter}>
                            <TouchableOpacity activeOpacity={0.5} style={{padding: 5}} onPress={()=>this.changeMonth(-1)}>
                                <Paragraph style={{fontSize: 24}}>&lt;</Paragraph>
                            </TouchableOpacity>
                            <Heading2 style={{color: '#A5A5A5'}}>{this.state.currentYear+'.'+this.state.currentMonth}</Heading2>
                            <TouchableOpacity activeOpacity={0.5} style={{padding: 5}} onPress={()=>this.changeMonth(1)}>
                                <Paragraph style={{fontSize: 24}}>&gt;</Paragraph>
                            </TouchableOpacity>
                        </View>
                        {/* chart主体 */}
                        <View style={styles.chartBody}>
                            {/* 收入支出切换按钮 */}
                            <TouchableOpacity 
                            activeOpacity={0.5} 
                            style={styles.toggleBtn}
                            onPress={()=>{this.toggleOutIn()}}
                            >
                                <Paragraph>{this.state.isOut?'总支出':'总收入'}</Paragraph>
                                <Heading2>{this.state.isOut?this.state.totalOut.toFixed(2):this.state.totalIn.toFixed(2)}</Heading2>
                                <Image source={require('../../../assets/img/analyse/toggle.png')} style={styles.toggleImg}/>
                            </TouchableOpacity>
                            {/* chart */}
                            <VictoryPie
                                colorScale={["tomato", "orange", "gold", "cyan", "navy" ]}
                                data={this.state.isOut?this.state.monthOutChart:this.state.monthInChart}
                                innerRadius={70}
                                height={screenWidth/4*3}
                                labelRadius={({ innerRadius }) => innerRadius + 55 }
                                padAngle={1}
                                labels={({ datum }) => `${datum.x}: ${(datum.y/this.state.total*100).toFixed(2)+'%'}`}
                                style={{
                                    labels: {
                                      fontSize: 16, fill: "#A5A5A5"
                                    }
                                }}
                            />
                        </View>
                    </View>

                    {/* 表格汇总 */}
                    <View style={styles.card}>
                        {this.renderList(this.state.isOut?this.state.monthOutList:this.state.monthInList,this.state.total)}
                    </View>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    card: {
        marginHorizontal: 15,
        marginVertical: 5,
        paddingHorizontal: 15,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    chartBody: {
        position: 'relative',
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
        // borderWidth: 1,
        // borderColor: 'black'
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F8',
        paddingBottom: 10,
        marginBottom: 10
    },
    listItem: {
        textAlign: 'center',
        width: (screenWidth-30)/4-10,
        color: 'black',
        // borderColor: 'black',
        // borderWidth: 1
    },
    toggleBtn: {
        position: 'absolute',
        top: screenWidth/8*3-60,
        justifyContent: 'center',
        alignItems: 'center',
        zIndex: 111,
        height: 120,
        width: 120,
        borderRadius: 60,
    },
    toggleImg: {
        width: 20,
        height: 20
    }
});