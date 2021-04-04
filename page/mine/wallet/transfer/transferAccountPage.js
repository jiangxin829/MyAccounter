import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    ScrollView,
    StyleSheet,
    Image,
    TouchableOpacity,
    TextInput,
    Dimensions,
    FlatList,
    Keyboard
} from 'react-native';

import { Toast, WhiteSpace, Modal, Provider } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Heading2, styles_common, Paragraph } from '../../../../assets/js/CommonStyles'
import Header from '../../../../assets/js/components/Header'
import AccountMenuItem from '../../../../assets/js/components/AccountMenuItem'

var screenWidth = Dimensions.get('window').width;

export default class TransferAccountPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            accounts: this.props.navigation.getParam('accounts',[]),
            transferOutAccount: '',
            transferInAccount: '',
            transferNumber: '0.00',
            menuShow: true,
            step: 1,
            transferTime: new Date(),//待完善
            transferNote: '',
            transferNote1: '',
            noteShow: false
        }
    }

    componentDidMount() {
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    //单独处理TextInput物理返回 问题：TextInput未能失去焦点 再点击会闪一下
    _keyboardDidHide = () => {
        this.setState({menuShow:true})
    }
    _keyboardDidShow = () => {
        this.setState({menuShow:false})
    }

    //新增账户转账交易记录
    saveAll = async () => {
        if(this.state.transferOutAccount!=''&&this.state.transferInAccount!=''&&this.state.transferNumber!=''){
            //上传到服务器
            fetch('http://192.168.43.2:3000/transferAccount', {
            method: 'POST',
            headers: {
                // Accept: 'application/json',
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                userId: this.state.transferOutAccount.userId,
                outAccountId: this.state.transferOutAccount._id,
                inAccountId: this.state.transferInAccount._id,
                transferNumber: parseFloat(this.state.transferNumber).toFixed(2),
                transferTime: new Date().getFullYear()+'-'+
                ((new Date().getMonth()+1)<10?('0' + (new Date().getMonth()+1)) : (new Date().getMonth()+1))+'-'+
                (new Date().getDate()<10?('0' + new Date().getDate()) : new Date().getDate()),
                transferNote: '['+this.state.transferOutAccount.accountName+'转到'+this.state.transferInAccount.accountName+'] ' +this.state.transferNote
            }),
            })
                .then(res=>res.json())
                .then(async (data)=>{
                    //console.warn(data)
                    // //更新本地存储
                    await AsyncStorage.setItem('accounts', JSON.stringify(data.accounts));
                    await AsyncStorage.setItem('deals', JSON.stringify(data.deals));
                    //保存成功
                    Toast.success('保存成功',0.5,()=>{
                     //返回walletPage并调用更新函数
                     this.props.navigation.state.params.onBackRefresh();
                     this.props.navigation.goBack();
                    },true)
                })
                .catch((error) => {
                    Toast.offline('服务器出错了',0.5,()=>{},true)
                    console.error(error);
                });
        } else {
            Toast.info('转账信息不能为空',0.5,()=>{},true)
        }
      }

    //设置转入转出账户
    setAccount = account => {
        //console.warn(account)
        if(this.state.step==1) {
            if(this.state.transferInAccount!=''&&account==this.state.transferInAccount){
                Toast.fail("不能设为相同账户哦",0.5,()=>{},true)
                return 
            }   
            this.setState({transferOutAccount:account, step: 2});
        }
        if(this.state.step==2) {
            if(this.state.transferOutAccount!=''&&account==this.state.transferOutAccount){
                  Toast.fail("不能设为相同账户哦",0.5,()=>{},true)
                return 
            }
            this.setState({transferInAccount:account, step: 1});
        }
    }

    render() {
        let accountImage = {
            '现金': require('../../../../assets/img/account/account_cash.png'),
            '支付宝': require('../../../../assets/img/account/account_alipay.png'),
            '微信': require('../../../../assets/img/account/account_wechat.png'),
            '银行卡': require('../../../../assets/img/account/account_card.png'),
            '蚂蚁花呗': require('../../../../assets/img/account/account_huabei.png'),
            '京东白条': require('../../../../assets/img/account/account_jd.png'),
        }
        return (
            <Provider>
                <View style={styles_common.containerGray}>
                    {/* 渲染头部组件 */}
                    <Header 
                        headerBgc={{backgroundColor: '#F3F4F8'}}
                        navigation={this.props.navigation}
                        back={true}
                        title='转账'
                        subtitle='保存'
                        subtitleMethod={this.saveAll}
                        subtitleColor='#EB705E'
                    />
                    <ScrollView>
                        <WhiteSpace size='lg' />
                        {/* 转出账户 */}
                        <View style={[styles.accountItem, styles_common.rowCenterCenter]}>
                            <TouchableOpacity 
                                style={[styles_common.rowStartCenter, {flex:1}]}
                                activeOpacity ={0.5} 
                                onPress={()=>{this.setState({menuShow:true, step:1})}}>
                                <Image 
                                    style={styles.icon} 
                                    source={this.state.transferOutAccount==''?require('../../../../assets/img/account/account_out.png'):
                                    accountImage[this.state.transferOutAccount.accountType]} 
                                />
                                <Heading2 style={{marginHorizontal:15}}>
                                    {this.state.transferOutAccount==''?'转出账户':this.state.transferOutAccount.accountName}
                                </Heading2>
                                    
                            </TouchableOpacity>
                            <TextInput
                                style={styles.ipt}
                                maxLength={7}
                                textAlign='right'
                                selectionColor='transparent'
                                selectTextOnFocus={true}
                                caretHidden={true}
                                underlineColorAndroid='transparent'
                                value={this.state.transferNumber}
                                onFocus={()=>this.setState({menuShow:false})}
                                onChangeText={text=>this.setState({transferNumber: text})}
                                keyboardType='number-pad'
                                //ref={el => (this.inputRef1 = el)}
                            />
                        </View>
                        <WhiteSpace size='sm' />
                        {/* 转入账户 */}
                        <View style={[styles.accountItem, styles_common.rowCenterCenter]}>
                            <TouchableOpacity 
                                style={[styles_common.rowStartCenter, {flex:1}]}
                                activeOpacity ={0.5} 
                                onPress={()=>{this.setState({menuShow:true,step:2})}}>
                                    <Image 
                                        style={styles.icon} 
                                        source={this.state.transferInAccount==''?require('../../../../assets/img/account/account_in.png'):
                                        accountImage[this.state.transferInAccount.accountType]} 
                                    />
                                    <Heading2 style={{marginHorizontal:15}}>
                                        {this.state.transferInAccount==''?'转出账户':this.state.transferInAccount.accountName}
                                    </Heading2>
                                    
                            </TouchableOpacity>
                            <TextInput
                                style={styles.ipt}
                                textAlign='right'
                                selectionColor='transparent'
                                selectTextOnFocus={true}
                                caretHidden={true}
                                underlineColorAndroid='transparent'
                                value={this.state.transferNumber}
                                onFocus={()=>this.setState({menuShow:false})}
                                onChangeText={text => this.setState({transferNumber: text})}
                                keyboardType='number-pad'
                                //ref={el => (this.inputRef2 = el)}
                            />
                            <Image style={styles.nextIcon} source={require('../../../../assets/img/account/account_next.png')} />
                        </View>
                    </ScrollView>
                    {/* 账户选择菜单 */}
                    {this.state.menuShow?
                        <View style={styles.bottomContainer}>
                            <View style={[styles_common.rowBetweenCenter, styles.bottomHeader]}>
                                <Paragraph style={styles.bottomHeaderText}>
                                    {this.state.transferTime.getFullYear()+'.'+
                                    ((this.state.transferTime.getMonth()+1)<10?('0' + (this.state.transferTime.getMonth()+1)) : (this.state.transferTime.getMonth()+1))+'.'+
                                    (this.state.transferTime.getDate()<10?('0' + this.state.transferTime.getDate()) : this.state.transferTime.getDate())}   
                                </Paragraph>
                                <TouchableOpacity 
                                    activeOpacity={0.5} 
                                    onPress={()=>this.setState({noteShow: true})}>
                                    <Paragraph
                                        numberOfLines={1}
                                        ellipsizeMode='tail'
                                        style={styles.bottomHeaderText}>
                                        {this.state.transferNote==''?'添加备注':this.state.transferNote}
                                    </Paragraph>
                                </TouchableOpacity>
                            </View>
                            <FlatList
                                style={styles.bottomBody}
                                extraData={this.state}
                                data={this.state.accounts}                          
                                keyExtractor={item => item._id}
                                numColumns='2'
                                renderItem={({item, index})=>
                                <AccountMenuItem 
                                    account={item}
                                    accountImage={accountImage}
                                    isOdd={this.state.accounts.length%2==0?false:true}
                                    isLast={index==this.state.accounts.length-1?true:false}
                                    onSelecte={this.setAccount}
                                />}
                            />
                        </View>
                    :null}
                    <Modal
                        popup
                        maskClosable
                        onClose={()=>this.setState({noteShow:false})}
                        visible={this.state.noteShow}
                        animationType="slide-up"
                        //待修复onBackHandler={()=>true}
                        >
                        <View style={[styles_common.rowStartCenter, styles.noteContainer]}>
                            <TextInput
                                style={styles.noteIpt}
                                underlineColorAndroid='transparent'
                                multiline={true}
                                numberOfLines={4}
                                autoFocus={true}
                                defaultValue={this.state.transferNote}
                                onChangeText={text=>this.setState({transferNote1: text})}
                            />
                            <View>
                                <TouchableOpacity 
                                    style={styles.noteBtn}
                                    activeOpacity={0.5} 
                                    onPress={()=>this.setState({noteShow:false})}>
                                    <Heading2 style={{color: 'white'}}>取消</Heading2>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    style={styles.noteBtn}
                                    activeOpacity={0.5} 
                                    onPress={()=>{this.setState({transferNote:this.state.transferNote1,noteShow:false})}}>
                                    <Heading2 style={{color: 'white'}}>确定</Heading2>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Modal>
                </View>
            </Provider>
            
        );
    }
}



const styles = StyleSheet.create({
    accountItem: {
        position: 'relative',
        marginHorizontal: 15,
        marginVertical: 5,
        borderRadius: 10,
        backgroundColor: 'white',
        height: 60
    },
    icon: {
        marginLeft: 15,
        width: 40,
        height: 40,
        borderRadius: 20
    },
    ipt: {
        padding: 0,
        flex: 1,
        marginRight: 15,
        fontSize: 18, 
        color: '#FF7864',
        fontWeight: '700',
    },
    nextIcon: {
        position: 'absolute',
        top: -30,
        left: screenWidth/2-35,
        width: 40,
        height: 40,
        borderRadius: 20,
        borderWidth: 1,
        borderColor: '#F3F4F8'
    },

    //底部菜单样式
    bottomContainer: {
        position: 'absolute',
        bottom: 0,
        width: '100%',
        height: 255,
        backgroundColor: 'white',
    },
    bottomHeader: {
        height: 50,
        paddingHorizontal: 10,
    },
    bottomHeaderText: {
        width: 110,
        textAlign: 'center',
        paddingVertical: 5,
        paddingHorizontal: 15,
        borderRadius: 20,
        color: null,
        backgroundColor: '#F3F4F8',
    },
    bottomBody: {
        padding:5,
        backgroundColor: '#F3F4F8',
    },
    //菜单备注样式
    noteContainer: {
        height: 110,
        backgroundColor: 'white',
        padding: 6
    },
    noteIpt: {
        backgroundColor: '#F3F4F8',
        margin: 6,
        flex: 1,
        fontSize: 18
    },
    noteBtn: {
        margin: 6,
        height: 40,
        width: 60,
        borderRadius: 10,
        backgroundColor: '#EEBF30',
        justifyContent: 'center',
        alignItems: 'center'
    }
});