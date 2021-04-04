import React, { Component } from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Switch,
    BackHandler
} from 'react-native';
import Picker from 'react-native-picker';

import { Heading2, styles_common } from '../../../assets/js/CommonStyles'
import Header from '../../../assets/js/components/Header'

export default class ReminderPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            reminderCheck: true,
            reminderTime: '18:30',
            reminderPeriod: '每天'
        }
    }

    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', Picker.hide);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', Picker.hide);
    }

    //保存页面设置,待开发
    saveAll = () => {
        console.warn('待开发')
    }

    // componentDidUpdate(){
    // }
    
    //设置提醒开关
    toggleReminder = value => {
        //console.warn('value:', value)
        Picker.hide();
        this.setState({reminderCheck: value})
        //console.warn(this.state.reminderCheck)
    }

    //闹钟事件Picker
    showTimePicker() {
        let hours = [],
            minutes = [];
        for(let i=0;i<24;i++){
            if(i<10) i='0'+i;
            hours.push(i);
        }
        for(let i=0;i<60;i++){
            if(i<10) i='0'+i;
            minutes.push(i);
        }
        let pickerData = [hours, minutes];
        let date = new Date();
        let selectedValue = [
            date.getHours(),
            date.getMinutes()
        ];
        Picker.init({
            pickerData,
            selectedValue,

            //自定义样式
            pickerConfirmBtnText: '保存',
            pickerCancelBtnText: '取消',
            pickerTitleText: '提醒时间',
            pickerToolBarFontSize: 18,            
            pickerFontSize: 18,           
            isLoop: true,	
            //wheelFlex	array: [1,1,1]
            // pickerTextEllipsisLen: 10,
            pickerConfirmBtnColor: [235,112,94,1],
            pickerCancelBtnColor: [0,0,0,1],
            pickerTitleColor: [0,0,0,1],	
            pickerFontColor: [0,0,0,1],
            pickerToolBarBg: [220,220,220,1],
            pickerBg: [255,255,255,1],	
            
            onPickerConfirm: pickedValue => {
                let timeArr = [...pickedValue]
                let timeTarget = timeArr[0]+':'+timeArr[1];
                this.setState({reminderTime: timeTarget})
            }
        });
        Picker.show();
    }

    //普通Picker
    showPicker(item, data) {
        Picker.init({
            pickerData: data.pickerData,
            selectedValue: [this.state[item]],

            //自定义样式
            pickerConfirmBtnText: '保存',
            pickerCancelBtnText: '取消',
            pickerTitleText: data.pickerTitleText,
            pickerToolBarFontSize: 18,            
            pickerFontSize: 18,           
            //isLoop: true,	
            //wheelFlex	array
            // pickerTextEllipsisLen: 10,
            pickerConfirmBtnColor: [235,112,94,1],
            pickerCancelBtnColor: [0,0,0,1],
            pickerTitleColor: [0,0,0,1],	
            pickerFontColor: [0,0,0,1],
            pickerToolBarBg: [220,220,220,1],
            pickerBg: [255,255,255,1],	
            
            onPickerConfirm: pickedValue => {
                this.setState({reminderPeriod: pickedValue.join()});
            },
        });
        Picker.show();    
    }

    render() {
        return (
            <View style={styles_common.containerGray}>
                {/* 渲染头部组件 */}
                <Header 
                    navigation={this.props.navigation}
                    back={true}
                    title='记账提醒'
                    subtitle='保存'
                    subtitleMethod={this.saveAll}
                    subtitleColor='#EB705E'
                />
                <ScrollView>
                    <View style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                        <Heading2>记账提醒</Heading2>
                        <Switch
                            value={this.state.reminderCheck}
                            onValueChange= {this.toggleReminder}
                            trackColor= {{false: '#A5A5A5', true: '#EEBF30'}}
                            thumbColor='white'
                        />
                    </View>
                    <TouchableOpacity activeOpacity ={0.5} 
                        style={[styles_common.rowBetweenCenter, styles.bodyItem]} 
                        onPress={this.showTimePicker.bind(this)} 
                        disabled={!this.state.reminderCheck}>
                        <Heading2>提醒时间</Heading2>
                        <View style={styles_common.rowBetweenCenter}>
                            <Heading2 style={!this.state.reminderCheck ? {color:'#A5A5A5'} : null}>{this.state.reminderTime}</Heading2>
                            <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
                        </View>
                    </TouchableOpacity>
                    <TouchableOpacity 
                        activeOpacity ={0.5} 
                        style={[styles_common.rowBetweenCenter, styles.bodyItem, style={borderBottomWidth: 0}]} 
                        onPress={this.showPicker.bind(this, 'reminderPeriod', {pickerTitleText: '重复周期',pickerData: ['每天', '每周一', '每周二', '每周三', '每周四', '每周五', '每周六', '每周天']})} 
                        disabled={!this.state.reminderCheck}>
                        <Heading2>重复周期</Heading2>
                        <View style={styles_common.rowBetweenCenter}>
                            <Heading2 style={!this.state.reminderCheck ? {color:'#A5A5A5'} : null}>{this.state.reminderPeriod}</Heading2>
                            <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
                        </View>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    bodyItem: {
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderColor: '#F3F4F8',
        height: 60,
        backgroundColor: 'white'
    },
});