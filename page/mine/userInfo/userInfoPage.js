import React, {Component, useReducer} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    BackHandler
} from 'react-native';
import Picker from 'react-native-picker';
import { WhiteSpace, Toast, Provider } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Heading2, Paragraph, styles_common } from '../../../assets/js/CommonStyles'
import Header from '../../../assets/js/components/Header'

export default class UserInfoPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: {},
            defaultPhotoUrl: require('../../../assets/img/mine/notsetted.png'),
            photoUrl: require('../../../assets/img/mine/user.png'),
            nickName: '',
            sex: '',
            birthday: '',
            identity: '',
            id: ''
        }
    }

    componentDidMount() {
        this.getData()
        BackHandler.addEventListener('hardwareBackPress', Picker.hide);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', Picker.hide);
    }

    //从本地存储读取数据更新到state
    getData = async () => {
        try {
            let user = await AsyncStorage.getItem('user')
            user = JSON.parse(user)
            //console.warn('user:',user)
            this.setState({
                user: user,
                nickName: user.nickName,
                sex: user.sex,
                birthday: user.birthday,
                identity: user.identity,
                id: user._id
            })
        } catch(e) {
            console.error(e)
        }
      }

    //保存个人信息修改
    saveAll = () => {
        let user = this.state.user;
        user.nickName = this.state.nickName;
        user.sex = this.state.sex;
        user.birthday = this.state.birthday;
        user.identity = this.state.identity;

        //上传到服务器
        fetch('http://192.168.43.2:3000/modifyUser', {
        method: 'POST',
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            id: this.state.id,      
            user: user,
        }),
        })
            .then(async() => {
                //更新本地存储
                await AsyncStorage.setItem('user', JSON.stringify(user));
                //保存成功
                Toast.success('保存成功',0.5,()=>{
                    //返回上一级页面并调用更新函数
                    this.props.navigation.state.params?this.props.navigation.state.params.onSave():null;
                    this.props.navigation.goBack();
                },true)
            })
            .catch((error) => {
            Toast.offline('服务器出错了',0.5,()=>{},true)
            //console.error(error);
            });
      }

    //创建年月日数据
    createDate() {
        let date = [];
        for(let i=1990;i<2021;i++){
            let month = [];
            for(let j = 1;j<13;j++){
                let day = [];
                if(j === 2){
                    for(let k=1;k<29;k++){
                        if(k<10) {
                            day.push('0'+k)
                        } else {
                            day.push(k);
                        }
                    }
                    //Leap day for years that are divisible by 4, such as 2000, 2004
                    if(i%4 === 0){
                        day.push(29);
                    }
                }
                else if(j in {1:1, 3:1, 5:1, 7:1, 8:1, 10:1, 12:1}){
                    for(let k=1;k<32;k++){
                        if(k<10) {
                            day.push('0'+k);
                        } else {
                            day.push(k);
                        }
                    }
                }
                else{
                    for(let k=1;k<31;k++){
                        if(k<10) {
                            day.push('0'+k)
                        } else {
                            day.push(k);
                        }
                    }
                }
                let _month = {};
                if(j<10) {
                    _month['0'+j] = day;
                } else {
                    _month[j] = day;
                }
                
                month.push(_month);
            }
            let _date = {};
            _date[i] = month;
            date.push(_date);
        }
        return date;
    }

    //普通Picker
    showPicker(item, data) {
        Picker.init({
            pickerData: data.pickerData,
            selectedValue: item=='birthday'?[...this.state.birthday.split('-')]:[this.state[item]],

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
                switch (item) {
                    case 'sex': 
                    this.setState({sex: pickedValue.join()});
                    break;
                    case 'birthday': 
                    this.setState({birthday: pickedValue.join('-')});
                    break;
                    case 'identity': 
                    this.setState({identity: pickedValue.join()});
                    break;
                };
            },
        });
        Picker.show();
    }
    
    //点击昵称
    iptClick= () => {
        //console.warn("!!!")
        Picker.hide();
        this.inputRef.focus()
    }

    render() {
        const notsetted = 
        <View style={styles_common.rowStartCenter}>
            <Paragraph>去设置</Paragraph>
            <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
        </View>
        return (
            <Provider>
                <View style={styles_common.containerGray}>
                    {/* 渲染头部组件 */}
                    <Header 
                        navigation={this.props.navigation}
                        back={true}
                        title='个人信息'
                        subtitle='保存'
                        subtitleMethod={this.saveAll}
                        subtitleColor='#EB705E'
                    />
                    <ScrollView>
                        <TouchableOpacity activeOpacity ={0.5} style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                            <Heading2>头像</Heading2>
                            <View style={styles_common.rowStartCenter}>
                                <Image style={styles.photo} source={this.state.photoUrl?this.state.photoUrl:this.state.defaultPhotoUrl} />
                                <Image style={styles_common.arrow_right} source={require('../../../assets/img/cell_arrow_right.png')} />
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            onPress={this.iptClick} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem]}>
                            <Heading2>昵称</Heading2>
                            <TextInput
                                style={{ fontSize: 18 }}
                                maxLength={11}
                                textAlign='right'
                                selectionColor='#EEBF30'
                                underlineColorAndroid='transparent'
                                value={this.state.nickName}
                                placeholder='请设置昵称'
                                placeholderTextColor='#A5A5A5'
                                onFocus={this.iptClick}
                                onChangeText={text => this.setState({nickName: text})}
                                ref={el => (this.inputRef = el)}
                            />
                        </TouchableOpacity>
                        <WhiteSpace size='md'></WhiteSpace>
                        <TouchableOpacity 
                            activeOpacity ={0.5}
                            style={[styles_common.rowBetweenCenter, styles.bodyItem]}
                            onPress={this.showPicker.bind(this, 'sex', {pickerTitleText: '请选择你的性别',pickerData: ['男', '女']})}>
                            <Heading2>性别</Heading2>
                            { this.state.sex ? <Heading2>{this.state.sex}</Heading2> : notsetted}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem]}
                            onPress={this.showPicker.bind(this, 'birthday', {pickerTitleText: '请选择你的生日',pickerData: this.createDate()})}>
                            <Heading2>生日</Heading2>
                            { this.state.birthday ? <Heading2>{this.state.birthday}</Heading2> : notsetted}
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem, style={borderBottomWidth: 0}]} 
                            onPress={this.showPicker.bind(this, 'identity', {pickerTitleText: '请选择你的身份',pickerData: ['学生', '上班族', '其他']})}>
                            <Heading2>身份</Heading2>
                            { this.state.identity ? <Heading2>{this.state.identity}</Heading2> :notsetted}
                        </TouchableOpacity>
                        <WhiteSpace size='lg'></WhiteSpace>
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            style={[styles_common.rowBetweenCenter, styles.bodyItem, style={borderBottomWidth: 0}]}>
                            <Heading2>我的ID</Heading2>
                            <Heading2 style={{color: '#A5A5A5'}}>{this.state.id}</Heading2>
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
    photo: {
        width: 32,
        height: 32,
        borderRadius: 16,
        marginRight: 10
    }
});