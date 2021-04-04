import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    ScrollView,
    Image
} from 'react-native';

import { NavigationActions, StackActions } from 'react-navigation';
import { Toast, Provider } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import { Heading2, HeadingBig } from '../../assets/js/CommonStyles'

export default class LoginPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            nickName: '',
            password: '',
            hidePassword: true,
        }
    }

    //提交表单进行验证
    submitLogin = async () => {
        if(this.state.nickName==''||this.state.password=='') {
            Toast.fail('昵称密码不能为空',0.5);
            return;
        } else {
            if(this.state.password.length<6) {
                Toast.fail('密码长度最低六位',0.5);
                return;
            } else {
                fetch('http://192.168.43.2:3000/login', {
                    method: 'POST',
                    headers: {
                        // Accept: 'application/json',
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify({
                        nickName: this.state.nickName,
                        password: this.state.password
                    }),
                    })
                        .then(res=>res.json())
                        .then(async (data)=>{
                            //console.warn(data)
                            if(data.user=='') {
                                Toast.fail('密码错误',0.5);
                            } else {
                                //更新本地存储
                                await AsyncStorage.setItem('user', JSON.stringify(data.user));
                                await AsyncStorage.setItem('accounts', JSON.stringify(data.accounts));
                                await AsyncStorage.setItem('deals', JSON.stringify(data.deals));
                                //保存成功
                                if(data.note) {
                                    Toast.success(data.note,0.5,()=>{
                                        //更新页面
                                        const resetAction = StackActions.reset({
                                            index: 0,
                                            actions: [NavigationActions.navigate({ routeName: 'BottomTabNavigator' })],
                                        });
                                        this.props.navigation.dispatch(resetAction);
                                    },true)
                                } else {
                                    Toast.success('登录成功',0.5,()=>{
                                        //更新页面
                                        const resetAction = StackActions.reset({
                                            index: 0,
                                            actions: [NavigationActions.navigate({ routeName: 'BottomTabNavigator' })],
                                        });
                                        this.props.navigation.dispatch(resetAction);
                                    },true)
                                }
                            }
                        })
                        .catch((error) => {
                            Toast.offline('服务器出错了',0.5,()=>{},true)
                            console.error(error);
                        });
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
                <LinearGradient colors={['#FFCB66', '#FFB65D', '#FFA254']} style={styles.container}>
                    <View style={styles.title}>
                        <HeadingBig style={{color: 'white'}}>欢迎加入MyAccounter</HeadingBig>
                    </View>
                    <View style={styles.box}>
                        <TextInput 
                            style={styles.nickNameIpt}
                            maxLength={11}
                            placeholder='请输入你的昵称'
                            placeholderTextColor='#A5A5A5'
                            underlineColorAndroid='transparent'
                            onChangeText={text => this.setState({nickName: text})}
                        />
                        <View style={styles.passwordBox}>
                            <TextInput
                                style={styles.passwordIpt}                    
                                placeholder='请输入你的密码'
                                placeholderTextColor='#A5A5A5'
                                secureTextEntry={this.state.hidePassword}
                                onChangeText={text => this.setState({password: text})}
                            />
                            {this.state.password.length>0?
                            <TouchableOpacity style={styles.iptBtn} onPress={this.showPassword}>
                                <Image 
                                    style={styles.iptImg}
                                    source={this.state.hidePassword?
                                        require('../../assets/img/setting/eye_off.png'):require('../../assets/img/setting/eye_on.png')} 
                                />
                            </TouchableOpacity>:null}
                        </View>
                        <TouchableOpacity 
                            style={styles.btn} 
                            activeOpacity={0.5} 
                            onPress={()=>this.submitLogin()}
                        >
                            <Heading2 style={{color: 'white'}}>登录/注册</Heading2>
                        </TouchableOpacity>
                    </View>
                </LinearGradient>
            </Provider>
        );
    }
}
const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    title: {
        marginTop: 80,
        alignItems: 'center'
    },
    box: {
        margin: 15,
        padding: 20,
        borderRadius: 15,
        backgroundColor: 'white'
    },
    nickNameIpt: {
        marginBottom: 10,
        padding: 10,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F8',
        width: '100%',
        fontSize: 18,
        color: 'black',
    },
    passwordBox: {
        position: 'relative',
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F8',
        marginBottom: 10,
    },
    passwordIpt: {
        
        padding: 10,
        width: '100%',
        fontSize: 18,
        color: 'black',
    },
    iptBtn: {
        position: 'absolute',
        right: 25,
        top: 14
    },
    iptImg: {
        height: 20,
        width: 20,
    },
    btn: {
        justifyContent: 'center',
        alignItems: 'center',
        width: '100%',
        height: 50,
        borderRadius: 30,
        backgroundColor: '#FFB65D',
    }
});