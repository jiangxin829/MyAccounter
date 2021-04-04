import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    TextInput,
    RefreshControl,
    FlatList
} from 'react-native';

import { Provider, Modal } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import LinearGradient from 'react-native-linear-gradient';

import { Heading1, Heading2, Tips, styles_common, Paragraph } from '../../assets/js/CommonStyles'
import AccountingMenu from './accountingMenu'

var screenWidth = Dimensions.get('window').width;

export default class AccountingPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            isRefreshing: false,
            user: {},
            accounts: [],
            deals: [],
            accounterName: '',
            accounterName1: '',
            monthDetail: {currentMonth: '',currentMonthOut: 0.00,currentMonthIn: 0.00},           
            changeAccounterNameShow: false,
            menuShow: false
        }
    }
   
    componentDidMount() {
        this.getData();
    }

    //下拉刷新
    onHeaderRefresh = () => {
        this.setState({isRefreshing: true});
        this.getData();
        this.setState({isRefreshing: false});
    }

    //获取本地数据
    getData = async () => {
        try {
            let user = await AsyncStorage.getItem('user');
            let accounts = await AsyncStorage.getItem('accounts');
            let deals = await AsyncStorage.getItem('deals');
            let newDeals = [];
            //过滤转账记录
            JSON.parse(deals).forEach(value=>{
                if(value.dealType!='转') {
                    newDeals.push(value);
                }
            })
            this.setState({
                user: JSON.parse(user),
                accounts: JSON.parse(accounts),
                deals: newDeals,
                accounterName: JSON.parse(user).accounterName,
            })
            this.getMonthDetail(newDeals);
          } catch (e) {
            console.error(e)
          }
    }

    //计算当前月份支出收入
    getMonthDetail = deals => {
        let currentMonth = new Date().getMonth() + 1;
        let currentMonthIn = 0;
        let currentMonthOut = 0;
        deals.forEach((value, index)=>{
            let dealTime = value.dealTime.split('-');
            //console.warn(dealTime);
            if(dealTime[0]==new Date().getFullYear()&&dealTime[1]==new Date().getMonth()+1) {
                if(value.dealType=='收') {
                    currentMonthIn+=parseFloat(value.dealNumber);
                } else if(value.dealType!='转') {
                    currentMonthOut+=parseFloat(value.dealNumber);
                }
            }
        })
        this.setState({monthDetail:{currentMonth:currentMonth,currentMonthIn:currentMonthIn,currentMonthOut:currentMonthOut}})
    }

    //新增普通消费交易记录
    addDeal = async deal => {
        //上传到服务器
        fetch('http://192.168.43.2:3000/addDeal', {
        method: 'POST',
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            dealType: deal.dealType,
            dealName: deal.dealName,
            dealNumber: deal.dealNumber,
            dealTime: deal.dealTime,
            dealNote: deal.dealNote,
            outAccountId: deal.outAccountId,
            userId: this.state.user._id,
        }),
        })
            .then(res=>res.json())
            .then(async (data)=>{
                //console.warn(data)
                // //更新本地存储
                await AsyncStorage.setItem('accounts', JSON.stringify(data.accounts));
                await AsyncStorage.setItem('deals', JSON.stringify(data.deals));
                //保存成功,更新页面
                this.getData();
                this.setState({menuShow: false});
                //this.onHeaderRefresh();
            })
            .catch((error) => {
                Toast.offline('服务器出错了',0.5,()=>{},true)
                console.error(error);
            });
    }

    //当新增记录时，列表定位到最底部
    onContentSizeChange = (contentWidth, contentHeight) => {
        let newLength = this.state.deals.length;
        newLength > this._lastDataLength && requestAnimationFrame(() => this._flatList && this._flatList.scrollToEnd({ animated: true }));
        this._lastDataLength = newLength;
    };

    //修改AccounterName
    changeAccounterName = async () => {
        this.setState({accounterName:this.state.accounterName1,changeAccounterNameShow:false});
        //上传到服务器
        fetch('http://192.168.43.2:3000/changeAccounterName', {
        method: 'POST',
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            accounterName: this.state.accounterName1,
            userId: this.state.user._id,
        }),
        })
            .then(res=>res.json())
            .then(async (data)=>{
                //console.warn(data)
                // //更新本地存储
                await AsyncStorage.setItem('user', JSON.stringify(data));
                //保存成功,更新页面
                this.getData();
            })
            .catch((error) => {
                Toast.offline('服务器出错了',0.5,()=>{},true)
                console.error(error);
            });
    }

    render() {
        return (
            <Provider>
                <View style={styles_common.containerWhite}>
                    {/* 头部组件 */}
                    <TouchableOpacity 
                        activeOpacity={0.5} 
                        style={[styles_common.columnCenterCenter, styles.header]}
                        onPress={()=>this.setState({changeAccounterNameShow: true})}
                    >
                        <Heading1>{this.state.accounterName}</Heading1>
                        <Tips style={{color:'#A5A5A5'}}>
                            {this.state.monthDetail.currentMonth+'月 收 '+this.state.monthDetail.currentMonthIn.toFixed(2)+' / 支 '+this.state.monthDetail.currentMonthOut.toFixed(2)}
                        </Tips>
                    </TouchableOpacity>
                    
                    <View style={[styles_common.rowCenterCenter, styles.subHeader]}>
                        <TouchableOpacity 
                            activeOpacity={0.5} 
                            style={[styles_common.rowStartCenter, {flex:1}]}
                            onPress={()=>this.props.navigation.navigate('Search')}
                        >           
                            <Image style={styles.subHeaderIcon} source={require('../../assets/img/accounting/accounting_search.png')}/>
                            <Paragraph>输入晚餐试试看</Paragraph>
                        </TouchableOpacity>
                        <TouchableOpacity activeOpacity={0.5} style={styles_common.rowEndCenter}>
                            <Image style={styles.subHeaderIcon} source={require('../../assets/img/accounting/accounting_calendar.png')}/>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={0.5} 
                            style={styles_common.rowEndCenter}
                            onPress={()=>this.props.navigation.navigate('Analyse')}
                        >
                            <Image style={styles.subHeaderIcon} source={require('../../assets/img/accounting/accounting_analyse.png')}/>
                        </TouchableOpacity>
                    </View>
                    {/* 消费记录 */}
                    <FlatList
                        extraData={this.state}
                        data={this.state.deals}                          
                        keyExtractor={deal => deal._id}
                        refreshing={true}
                        refreshControl={
                            <RefreshControl
                                refreshing={this.state.isRefreshing}
                                onRefresh={() => this.onHeaderRefresh()}
                                colors={['#EEBF30']}
                            />
                        }
                        ref={(flatList)=>this._flatList = flatList}
                        onContentSizeChange={this.onContentSizeChange}
                        renderItem={({item, index})=>
                        <View key={index}>
                            {/* 时间 */}
                            <View style={styles.messageTime}>
                                <Paragraph style={{fontSize: 12}}>
                                    {(item.dealTime.split('-')[0]==new Date().getFullYear()?'':item.dealTime.split('-')[0]+'.')+item.dealTime.split('-')[1]+'.'+item.dealTime.split('-')[2]}
                                </Paragraph>
                            </View>
                            {/* 记账记录 */}
                            <View style={[styles.messageBox,{justifyContent: 'flex-end'}]}>
                                <TouchableOpacity 
                                    activeOpacity={0.5}
                                    onPress={()=>this.props.navigation.navigate('ConsumeDetail', {deal: item, onBackRefresh: this.getData})}
                                >
                                    <LinearGradient 
                                        start={{x: 0, y: 0}} 
                                        end={{x: 1, y: 0}} 
                                        colors={['#FFC653', '#FFDB71', '#FFDB99']} 
                                        style={[styles.messageText,{borderTopLeftRadius: 20,borderTopRightRadius: 2,}]}
                                    >
                                        <Heading2 textBreakStrategy='simple'>
                                            {item.dealName}&nbsp;&nbsp;{'￥'+item.dealNumber}&nbsp;&nbsp;{item.dealNote!=''?' '+item.dealNote:''}
                                        </Heading2>
                                    </LinearGradient>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    activeOpacity={0.5}
                                    onPress={()=>this.props.navigation.navigate('UserInfo')}
                                >
                                    <Image source={require('../../assets/img/mine/user.png')} style={styles.photo}/>
                                </TouchableOpacity>
                            </View>
                            {/* 反馈 */}
                            <View style={[styles.messageBox,{justifyContent: 'flex-start',}]}>
                                <Image source={require('../../assets/img/MyAccounter.png')} style={styles.photo}/>
                                <View>
                                    <LinearGradient 
                                        start={{x: 0, y: 0}} 
                                        end={{x: 1, y: 0}} 
                                        colors={['#FFDB99', '#FFDB71', '#FFC653']} 
                                        style={[styles.messageText,{borderTopLeftRadius: 2,borderTopRightRadius: 20,}]}
                                    >
                                        <Heading2 textBreakStrategy='simple'>{item.dealAdvice}</Heading2>
                                    </LinearGradient>
                                </View>
                            </View>
                        </View>
                        }
                    />
                    {/* 记账按钮 */}
                    <View style={styles.addBox}>
                        <TouchableOpacity activeOpacity={0.7} onPress={()=>{this.setState({menuShow: true});this._flatList.scrollToEnd()}}>
                            <Image style={styles.addImg} source={require('../../assets/img/accounting.png')} />
                        </TouchableOpacity>
                    </View>
                </View>
                {/* 底部菜单 */}
                <Modal
                    popup
                    maskClosable
                    onClose={()=>this.setState({menuShow:false})}
                    visible={this.state.menuShow}
                    animationType="slide-up"
                >
                    <AccountingMenu onSend={this.addDeal}/>
                </Modal>
                {/* MyAccounter更名 */}
                <Modal
                    popup
                    maskClosable
                    onClose={()=>this.setState({changeAccounterNameShow:false})}
                    visible={this.state.changeAccounterNameShow}
                    animationType="slide-up"
                    style={styles.modal}
                >
                    <View style={styles_common.columnCenterCenter}>
                        <View style={styles.changeAccounterNameTop} />
                        <Heading1 style={styles.changeAccounterNameTitle}>我叫它什么</Heading1>
                        <TextInput
                            style={styles.changeAccounterNameIpt}
                            selectTextOnFocus={true}
                            selectionColor='#EEBF30'
                            underlineColorAndroid='transparent'
                            autoFocus={true}
                            defaultValue={this.state.accounterName}
                            onChangeText={text=>this.setState({accounterName1: text})}
                        />
                        <View style={styles_common.rowCenterCenter}>
                            <TouchableOpacity 
                                style={[styles.changeAccounterNameBtn, {borderRightWidth:1}]}
                                activeOpacity={0.5} 
                                onPress={()=>this.setState({changeAccounterNameShow:false})}>
                                <Heading2 style={{color: '#EB705E'}}>取消</Heading2>
                            </TouchableOpacity>
                            <TouchableOpacity 
                                style={[styles.changeAccounterNameBtn, {borderLeftWidth:1}]}
                                activeOpacity={0.5} 
                                onPress={this.changeAccounterName}>
                                <Heading2 style={{color: '#EEBF30'}}>确定</Heading2>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </Provider>
        );
    }
}
const styles = StyleSheet.create({
    messageBox: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        marginVertical: 5,
    },
    messageTime: {
        alignItems: 'center',
        marginVertical: 5,
    },
    messageText: {
        paddingVertical: 8,
        paddingHorizontal: 10,
        borderBottomLeftRadius: 20,
        borderBottomRightRadius: 20,
        maxWidth: screenWidth*0.7,
        //backgroundColor: '#FAC663'
    },
    photo: {
        marginHorizontal: 15,
        width: 34,
        height: 34,
        borderRadius: 17,
        borderWidth: 1,
        borderColor: '#FFDB99'
    },
    header: {
        height: 60,
        paddingTop: 5,
        borderBottomWidth: 1,
        borderColor: '#F3F4F8',
    },
    subHeader: {
        height: 50,
        paddingHorizontal: 5,
    },
    subHeaderIcon: {
        width: 30,
        height: 30,
        marginHorizontal: 10
    },

    //changeAccounterName Modal
    modal: {
        left: screenWidth/2-screenWidth*0.4,
        width: screenWidth*0.8,
        borderRadius: 15,
        backgroundColor: 'white',
        overflow: 'hidden'
    },
    changeAccounterNameTop: {
        width: '100%',
        height: 5,
        backgroundColor: '#EEBF30',
    },
    changeAccounterNameTitle: {
        paddingVertical: 10
    },
    changeAccounterNameIpt: {
        width: screenWidth*0.7,
        height: 50,
        backgroundColor: '#F3F4F8',
        borderRadius: 20,
        textAlign: 'center',
        fontSize: 18
    },
    changeAccounterNameBtn: {
        flex:1,
        marginTop: 15,
        borderTopWidth: 2,
        borderColor: '#F3F4F8',
        paddingVertical: 10,
        alignItems: 'center'
    },
    //addBtn
    addBox: {
        position: 'absolute',
        bottom: 0,
        left: screenWidth/2-25,
    },
    addImg: {
        width: 50,
        height: 50,
        borderRadius: 25,
        borderWidth: 1,
        borderColor: '#FAC663'
    }
});