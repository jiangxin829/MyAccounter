import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    StatusBar,
    Switch
} from 'react-native';
import { WhiteSpace } from '@ant-design/react-native';
import { NavigationActions, StackActions } from 'react-navigation';

import { Heading2, styles_common } from '../../../assets/js/CommonStyles'
import Header from '../../../assets/js/components/Header'
import ItemCell from '../../../assets/js/components/ItemCell';
import AsyncStorage from '@react-native-community/async-storage';

export default class SettingPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            personalSwitch: false
        }
    }

    //个性化设置开关
    toggleSwitch = value => {
        this.setState({personalSwitch: value})
    }
    
    //退出登录
    signOut = async () => {
        await AsyncStorage.clear();
        // this.props.navigation.reset();
        // this.props.navigation.navigate('Login');
        const resetAction = StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({ routeName: 'Login' })],
        });
        this.props.navigation.dispatch(resetAction);
    }

    render() {
        return (
            <View style={styles_common.containerGray}>
                {/* 渲染头部组件 */}
                <Header 
                    navigation={this.props.navigation}
                    back={true}
                    title='设置'
                />
                <ScrollView>
                    <View style={[styles_common.rowStartCenter, styles.content]}>
                        <Image style={styles.icon} source={require('../../../assets/img/setting/setting_personal.png')}/>
                        <Heading2>个性化</Heading2>
                        <View style={{ flex: 1 }} />
                        <Switch
                            value={this.state.personalSwitch}
                            onValueChange= {this.toggleSwitch}
                            trackColor= {{false: '#A5A5A5', true: '#EEBF30'}}
                            thumbColor='white'
                        />
                        <StatusBar
                            hidden={this.state.personalSwitch}
                            //animated='hidden'
                            //translucent={this.state.personalSwitch}
                            //backgroundColor='rgba(255,255,255,0)'
                            //barStyle='dark-content'
                        />
                    </View>
                    {/* <ItemCell 
                        image={require('../../../assets/img/setting/setting_lock.png')} 
                        title='密码锁' 
                        style={styles.settingItem} 
                        navigation={this.props.navigation}
                        /> */}
                    <ItemCell 
                        image={require('../../../assets/img/setting/setting_modify.png')} 
                        title='修改密码' 
                        style={{backgroundColor: 'white'}} 
                        screen='UserPassword'
                        navigation={this.props.navigation}/>
                    <WhiteSpace size='lg'></WhiteSpace>
                    <WhiteSpace size='lg'></WhiteSpace>
                    <TouchableOpacity 
                        activeOpacity ={0.5} 
                        style={[styles_common.rowCenterCenter, styles.settingRed]}
                        onPress={()=>this.signOut()}
                    >
                        <Heading2 style={{color: '#EB705E'}}>退出登录</Heading2>
                    </TouchableOpacity>
                </ScrollView>
            </View>
        );
    }
}
const styles = StyleSheet.create({
    settingItem: {
        borderBottomWidth: 1,
        borderColor: '#F3F4F8',
    },
    settingRed: {
        height: 60,
        backgroundColor: 'white'
    },
    content: {
        height: 60,
        paddingLeft: 15,
        paddingRight: 10,
        backgroundColor: 'white', 
    },
    icon: {
        width: 25,
        height: 25,
        marginRight: 10,
    }
});