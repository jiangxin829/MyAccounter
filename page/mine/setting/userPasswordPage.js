import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    StyleSheet,
    ScrollView,
    TextInput,
    Image,
    TouchableOpacity
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { Toast, Provider } from '@ant-design/react-native';

import { Heading2, Paragraph, styles_common } from '../../../assets/js/CommonStyles'
import Header from '../../../assets/js/components/Header'

export default class UserPasswordPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            user: {},
            nickName: '',
            oldPassword: '',
            newPassword: '',
            hidePassword: true,
        }
    }

    componentDidMount() {
        this.getData()
    }

    //获取本地数据
    getData = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            this.setState({
                user: JSON.parse(user),
                nickName: JSON.parse(user).nickName
            })
          } catch (e) {
            console.error(e)
          }
    }

     //保存当前设置
     saveAll = () => {
        if(this.state.oldPassword==''||this.state.newPassword=='') {
            Toast.fail('输入不能为空',0.5);
            return;
        } else {
            if(this.state.oldPassword!=this.state.user.password) {
                Toast.fail('原密码错误',0.5);
                return;
            } else {
                if(this.state.newPassword.length<6) {
                    Toast.fail('密码长度最低六位',0.5);
                    return;
                } else {
                    if(this.state.oldPassword==this.state.newPassword) {
                        Toast.fail('新旧密码不能相同',0.5);
                        return;
                    } else {
                        let user = this.state.user;
                        user.password = this.state.newPassword;
                        fetch('http://192.168.43.2:3000/modifyPassword', {
                            method: 'POST',
                            headers: {
                                // Accept: 'application/json',
                                'Content-Type': 'application/json',
                            },
                            body: JSON.stringify({
                                userId: this.state.user._id,
                                user: user
                            }),
                            })
                                .then(async res=>{
                                    //更新本地存储
                                    await AsyncStorage.setItem('user', JSON.stringify(user));
                                    Toast.success('修改成功',0.5,()=>{
                                        //返回上一级页面
                                        this.props.navigation.goBack();
                                    },true)
                                })
                                .catch((error) => {
                                    Toast.offline('服务器出错了',0.5,()=>{},true)
                                    console.error(error);
                                });
                    }
                }
            }
        }
    }

    //显示密码
    showPassword = () => {
        let flag = !this.state.hidePassword;
        this.setState({hidePassword: flag});
    }

    render() {
        return (
            <Provider>
                <View style={styles_common.containerGray}>
                    {/* 渲染头部组件 */}
                    <Header 
                        navigation={this.props.navigation}
                        back={true}
                        title='修改密码'
                        subtitle='保存'
                        subtitleMethod={this.saveAll}
                        subtitleColor='#EB705E'
                    />
                    <ScrollView>
                        <Heading2 style={{padding: 20}}>当前用户: {this.state.nickName}</Heading2>
                        <View style={[styles_common.rowBetweenCenter, {position: 'relative'}]}>
                            <TextInput
                                style={styles.ipt}
                                selectionColor='#EEBF30'
                                underlineColorAndroid='transparent'
                                placeholder='请输入原密码'
                                placeholderTextColor='#A5A5A5'
                                secureTextEntry={this.state.hidePassword}
                                onChangeText={value=>this.setState({oldPassword: value})}
                            />
                            {this.state.oldPassword.length>0?
                            <TouchableOpacity style={styles.iptBtn} onPress={this.showPassword}>
                                <Image 
                                    style={styles.iptImg}
                                    source={this.state.hidePassword?
                                        require('../../../assets/img/setting/eye_off.png'):require('../../../assets/img/setting/eye_on.png')} 
                                />
                            </TouchableOpacity>:null}
                        </View>
                        <View style={[styles_common.rowBetweenCenter, {position: 'relative'}]}>
                            <TextInput
                                style={styles.ipt}
                                selectionColor='#EEBF30'
                                underlineColorAndroid='transparent'
                                placeholder='请输入新密码'
                                placeholderTextColor='#A5A5A5'
                                secureTextEntry={this.state.hidePassword}
                                onChangeText={value=>this.setState({newPassword: value})}
                            />
                        {this.state.oldPassword.length>0?
                            <TouchableOpacity style={styles.iptBtn} onPress={this.showPassword}>
                                <Image 
                                    style={styles.iptImg}
                                    source={this.state.hidePassword?
                                        require('../../../assets/img/setting/eye_off.png'):require('../../../assets/img/setting/eye_on.png')} 
                                />
                            </TouchableOpacity>:null}
                        </View>
                    </ScrollView>
                </View>
            </Provider>
        );
    }
}
const styles = StyleSheet.create({
    ipt: {
        flex: 1,
        fontSize: 18,
        backgroundColor: 'white',
        padding: 20
    },
    iptBtn: {
        position: 'absolute',
        right: 25,
    },
    iptImg: {
        height: 20,
        width: 20,
    },
});