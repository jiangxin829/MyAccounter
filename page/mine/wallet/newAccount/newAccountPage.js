import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    TextInput,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
} from 'react-native';

import { WhiteSpace, Toast, Provider } from '@ant-design/react-native';
import Picker from 'react-native-picker';
import AsyncStorage from '@react-native-community/async-storage';

import { Heading2, styles_common } from '../../../../assets/js/CommonStyles'
import Header from '../../../../assets/js/components/Header'

export default class NewAccountPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            accountCard: '未选择发卡行',
            accountName: this.props.navigation.getParam('accountType', 'XXX'),
            accountType: this.props.navigation.getParam('accountType', 'XXX'),
            accountNumber: '0.00',
        }
    }

    //保存新建账户
    saveAll = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            user = JSON.parse(user);
            let accounts = await AsyncStorage.getItem('accounts');
            accounts = JSON.parse(accounts);
            //上传到服务器
            fetch('http://192.168.43.2:3000/addAccount', {
            method: 'POST',
            headers: {
                // Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                accountType: this.state.accountType,
                accountName: this.state.accountName,
                accountNumber: parseFloat(this.state.accountNumber).toFixed(2),
                accountCard: this.state.accountType=='银行卡'?this.state.accountCard:'',
                userId: user._id
            }),
            })
                .then(res=>res.json())
                .then(async (data)=>{
                    accounts.push(data);
                    //更新本地存储
                    await AsyncStorage.setItem('accounts', JSON.stringify(accounts));
                    //保存成功
                    Toast.success('保存成功',0.5,()=>{
                     //返回walletPage并调用更新函数
                     this.props.navigation.state.params.onBackRefresh();
                     this.props.navigation.goBack(this.props.navigation.getParam('backKey'));
                    },true)
                })
                .catch((error) => {
                    Toast.offline('服务器出错了',0.5,()=>{},true)
                    //console.error(error);
                    });
            } catch(e) {
            console.error(e)
        }
      }

    //普通Picker
    showPicker(data) {
        Picker.init({
            pickerData: data.pickerData,
            selectedValue: ['中国银行'],

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
                this.setState({accountCard: pickedValue.join()})
            },
        });
        Picker.show();
    }

    render() {
        let headerTitle = '新建' + this.state.accountType + '账户';
        return (
            <Provider>
                <View style={styles_common.containerGray}>
                    {/* 渲染头部组件 */}
                    <Header 
                        navigation={this.props.navigation}
                        back={true}
                        title={headerTitle}
                        subtitle='保存'
                        subtitleMethod={this.saveAll}
                        subtitleColor='#EB705E'
                    />
                    <ScrollView>
                        {/* 渲染银行账户-发卡行选项 */}
                        {this.state.accountType!='银行卡'?null:
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem]}
                            onPress={this.showPicker.bind(this, {pickerTitleText: '选择发卡行',pickerData: 
                            ['工商银行','建设银行','交通银行','农业银行','中国银行','邮政储蓄','民生银行','兴业银行','中信银行']})}>
                            <Heading2>发卡行</Heading2>
                            <View style={styles_common.rowStartCenter}>
                                <Heading2>{this.state.accountCard}</Heading2>
                                <Image style={styles_common.arrow_right} source={require('../../../../assets/img/cell_arrow_right.png')} />
                            </View>
                        </TouchableOpacity>}
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            onPress={()=> this.inputRef1.focus()} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                            <Heading2>账户名称</Heading2>
                            <TextInput
                                style={{ fontSize: 18 }}
                                maxLength={7}
                                textAlign='right'
                                selectionColor='#EEBF30'
                                underlineColorAndroid='transparent'
                                value={this.state.accountName}
                                onChangeText={text => this.setState({accountName: text})}
                                autoFocus={this.state.accountType!='银行卡'?true:false}
                                ref={el => (this.inputRef1 = el)}
                            />
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem, {borderBottomWidth: 0}]}>
                            <Heading2>账户类型</Heading2>
                            <Heading2 style={{color: '#A5A5A5'}}>{this.state.accountType}</Heading2>
                        </TouchableOpacity>
                        <WhiteSpace />
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            onPress={()=> this.inputRef2.focus()} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                            <Heading2>金额</Heading2>
                            <TextInput
                                style={{ fontSize: 18 }}
                                textAlign='right'
                                selectionColor='#EEBF30'
                                underlineColorAndroid='transparent'
                                value={this.state.accountNumber}
                                keyboardType='number-pad'
                                selectTextOnFocus={true}
                                onChangeText={text => this.setState({accountNumber: text})}
                                ref={el => (this.inputRef2 = el)}
                            />
                        </TouchableOpacity>
                    </ScrollView>
                </View>
            </Provider>
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