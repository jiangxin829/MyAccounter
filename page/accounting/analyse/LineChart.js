import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    FlatList,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    ScrollView
} from 'react-native';
import AsyncStorage from '@react-native-community/async-storage';
import { VictoryLine, VictoryChart, VictoryTheme, VictoryLabel } from "victory-native";
var screenWidth = Dimensions.get('window').width;
//console.warn(screenWidth)

import { styles_common, Paragraph, Heading2 } from '../../../assets/js/CommonStyles'

export default class AnalysePage extends Component {
    constructor(props){
        super(props)
        this.state = {
            currentYear: new Date().getFullYear(),
            deals: [],
            yearChart: {},
            yearList: [],
            selectedIn: false,
            selectedOut: true
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
            this.getyearData(this.state.currentYear);
        } catch(e) {
            console.error(e)
        }
    }

    //计算年份支出收入
    getyearData = (currentYear) => {
        //设置当前页面年份
        this.setState({currentYear: currentYear})
        let yearChart = {
            //月份收入支出数据
            monthInData: [],
            monthOutData: []
        };
        let yearList = [];
        this.state.deals.forEach((value, index)=>{
            let dealTime = value.dealTime.split('-');
            if(dealTime[0]==currentYear) {
                if(value.dealType=='收') {
                    //chart
                    if(yearChart.monthInData[parseInt(dealTime[1])]) {
                        yearChart.monthInData[parseInt(dealTime[1])].y+=parseFloat(value.dealNumber);
                    } else {
                        yearChart.monthInData[parseInt(dealTime[1])] = {x: parseInt(dealTime[1]).toFixed(0), y: 0};
                        yearChart.monthInData[parseInt(dealTime[1])].y+=parseFloat(value.dealNumber);
                    }
                    //list
                    if(yearList[parseInt(dealTime[1])]) {
                        yearList[parseInt(dealTime[1])].in+=parseFloat(value.dealNumber);
                    } else {
                        yearList[parseInt(dealTime[1])] = {keyValue: parseInt(dealTime[1]), in: 0, out: 0};
                        yearList[parseInt(dealTime[1])].in+=parseFloat(value.dealNumber);
                    }
                } else if(value.dealType!='转') {
                    //chart
                    if(yearChart.monthOutData[parseInt(dealTime[1])]) {
                        yearChart.monthOutData[parseInt(dealTime[1])].y+=parseFloat(value.dealNumber);
                    } else {
                        yearChart.monthOutData[parseInt(dealTime[1])] = {x: parseInt(dealTime[1]).toFixed(0), y: 0};
                        yearChart.monthOutData[parseInt(dealTime[1])].y+=parseFloat(value.dealNumber);
                    }
                    //list
                    if(yearList[parseInt(dealTime[1])]) {
                        yearList[parseInt(dealTime[1])].out+=parseFloat(value.dealNumber);
                    } else {
                        yearList[parseInt(dealTime[1])] = {keyValue: parseInt(dealTime[1]), in: 0, out: 0};
                        yearList[parseInt(dealTime[1])].out+=parseFloat(value.dealNumber);
                    }
                }
            }
        })
        //计算当前chart的最大月份
        let maxLength = yearChart.monthInData.length>yearChart.monthOutData.length?yearChart.monthInData.length:yearChart.monthOutData.length
        for(let i=0;i<maxLength;i++) {
            if(yearChart.monthInData[i]==null) {
                yearChart.monthInData[i] = {x: parseInt(i).toFixed(0), y: 0}
            }
            if(yearChart.monthOutData[i]==null) {
                yearChart.monthOutData[i] = {x: parseInt(i).toFixed(0), y: 0}
            }
            if(i>0&&yearList[i]==null) {
                yearList[i] = {keyValue: parseInt(i), in: 0, out: 0};
            }
        }
        //console.warn(yearChart)
        this.setState({yearChart: yearChart, yearList: yearList});
    }
    
    //收入开关
    toggleInBtn() {
        if(this.state.selectedIn==true&&this.state.selectedOut==false) {
            return;
        } else {
            let temp = !this.state.selectedIn;
            this.setState({selectedIn: temp});
        }
    }

    //支出开关
    toggleOutBtn() {
        if(this.state.selectedOut==true&&this.state.selectedIn==false) {
            return;
        } else {
            let temp = !this.state.selectedOut;
            this.setState({selectedOut: temp});
        }
    }

    //分页
    changeYear(year) {
        this.getyearData(year);
        this.setState({currentYear: year});
    }

    //渲染表格统计结果
    renderList = () => {
        if(this.state.yearList.length==0) {
            return <View style={styles_common.rowCenterCenter}>
                <Paragraph>当前年份没有记录哦~</Paragraph>
            </View>;
        } else {
            //console.warn(this.state.yearList);
            let cells = [];
            let cell = <View style={[styles_common.rowAroundCenter, styles.bottomBorder]} key='head'>
                        <Paragraph>时间</Paragraph>
                        <Paragraph>收入</Paragraph>
                        <Paragraph>支出</Paragraph>
                        <Paragraph>结余</Paragraph>
                    </View>
            cells.push(cell);
            this.state.yearList.forEach((item, index) => {
                if(item!=null) {
                    cell = <View key={index+item.keyValue} style={[styles_common.rowBetweenCenter, index==this.state.yearList.length-1?null:styles.bottomBorder]}>
                            <Paragraph style={styles.listItem}>{item.keyValue+'月'}</Paragraph>
                            <Paragraph style={styles.listItem}>{item.in.toFixed(2)}</Paragraph>
                            <Paragraph style={styles.listItem}>{item.out.toFixed(2)}</Paragraph>
                            <Paragraph style={[styles.listItem, {color: '#E77376'}]}>{(item.in-item.out).toFixed(2)}</Paragraph>
                        </View>
                    cells.push(cell);
                }
            })
            return cells;
        }
    }

    render() {
        //console.warn(this.state.yearChart.monthOutData)
        return (
            <View style={styles_common.containerGray}>
                <ScrollView>
                    {/* 折线图 */}
                    <View style={[styles.card, {height: 360}]}>
                        {/* chart头部 */}
                        <View style={styles_common.rowBetweenCenter}>
                            {/* 头部左侧功能 */}
                            <View style={styles_common.rowStartCenter}>
                                <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.changeYear(this.state.currentYear-1)}} style={{padding: 5}}>
                                    <Paragraph style={{fontSize: 24}}>&lt;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;</Paragraph>
                                </TouchableOpacity>
                                <Heading2 style={{color: '#A5A5A5'}}>{this.state.currentYear}</Heading2>
                                <TouchableOpacity activeOpacity={0.5} onPress={()=>{this.changeYear(this.state.currentYear+1)}} style={{padding: 5}}>
                                    <Paragraph style={{fontSize: 24}}>&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&gt;</Paragraph>
                                </TouchableOpacity>
                            </View>
                            {/* 头部右侧功能 */}
                            <View style={styles_common.rowStartCenter}>
                                <TouchableOpacity 
                                    activeOpacity={0.5} 
                                    style={[styles.btn, this.state.selectedIn?{backgroundColor: '#FF6855'}:null]}
                                    onPress={()=>this.toggleInBtn()}
                                >
                                    <Paragraph style={this.state.selectedIn?{color: 'white'}:null}>收入</Paragraph>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    activeOpacity={0.5} 
                                    style={[styles.btn, this.state.selectedOut?{backgroundColor: '#6E92E6'}:null]}
                                    onPress={()=>this.toggleOutBtn()}
                                >
                                    <Paragraph style={this.state.selectedOut?{color: 'white'}:null}>支出</Paragraph>
                                </TouchableOpacity>
                            </View>
                        </View>
                        {/* chart主体 */}
                        <View style={styles.chartBody}>
                            <VictoryChart width={380} theme={VictoryTheme.material}>
                            <VictoryLabel x={25} y={30} text={"金额/元"}/>
                            <VictoryLabel x={340} y={300} text={"月份"}/>
                                {this.state.selectedOut?
                                <VictoryLine 
                                    style={{data: { stroke: '#6E92E6' },parent: { border: "1px solid #ccc"}}} 
                                    data={this.state.yearChart.monthOutData}
                                />:null}
                                {this.state.selectedIn?
                                <VictoryLine 
                                    style={{data: { stroke: '#FF6855' },parent: { border: "1px solid #111"}}} 
                                    data={this.state.yearChart.monthInData}
                                />:null}
                            </VictoryChart>
                        </View>
                    </View>

                    {/* 表格汇总 */}
                    <View style={styles.card}>
                        {this.renderList()}
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
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        marginHorizontal: 5,
        width: 60,
        height: 30,
        borderRadius: 15,
        backgroundColor: '#F3F4F8'
    },
    chartBody: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
    },
    bottomBorder: {
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F8',
        paddingBottom: 15,
        marginBottom: 15
    },
    listItem: {
        textAlign: 'center',
        width: (screenWidth-30)/4-10,
        color: 'black',
        // borderColor: 'black',
        // borderWidth: 1
    }
});