import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    Text,
    FlatList,
    Dimensions,
    Keyboard,
    ScrollView
} from 'react-native';

import { Carousel, Modal } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { Tips, Heading2, styles_common, Paragraph } from '../../assets/js/CommonStyles'
import AccountMenuItem from '../../assets/js/components/AccountMenuItem'

var screenWidth = Dimensions.get('window').width;

export default class AccountingMenu extends Component{
    constructor(props){
        super(props)
        this.state = {
            dealType: '食',
            dealName: '早餐',
            dealNumber: '0.00',
            dealTime: new Date(),//待完善
            dealNote: '',

            accountName: '',
            outAccountId: '',
            accounts: [],
            dealNote1: '',
            noteShow: false,
            currentIndex: 0,
            menuShow: true,
            selectAccountType:false
        }
    }

    componentDidMount() {
        this.getData();
        this.keyboardDidHideListener = Keyboard.addListener('keyboardDidHide', this._keyboardDidHide);
        this.keyboardDidShowListener = Keyboard.addListener('keyboardDidShow', this._keyboardDidShow);
    }

    componentWillUnmount() {
        this.keyboardDidShowListener.remove();
        this.keyboardDidHideListener.remove();
    }

    //获取本地accounts数据
    getData = async () => {
        try {
            let accounts = await AsyncStorage.getItem('accounts');
            accounts = JSON.parse(accounts);
            this.setState({accounts: accounts});
            this.state.accountName==''?this.setState({accountName: accounts[0].accountName,outAccountId: accounts[0]._id}):null;
          } catch (e) {
            console.error(e)
          }
    }

    //单独处理TextInput物理返回 问题：TextInput未能失去焦点 再点击会闪一下
    _keyboardDidHide = () => {
        this.setState({menuShow:true,selectAccountType:false});
    }
    _keyboardDidShow = () => {
        this.setState({menuShow:false});
    }

    //轮播图自定义需求
    onHorizontalSelectedIndexChange(current) {
        this.setState({currentIndex: current});
    }

    //点击设置账户
    clickSelectButton() {
        this.getData();
        this.setState({selectAccountType:true});
    }

    //设置消费支付的账户
    setAccount = account => {
        this.setState({accountName:account.accountName, outAccountId: account._id});
        this.setState({menuShow:true,selectAccountType:false,currentIndex:0});
    }

    //提交本次deal
    setDeal = () => {
        let dealTimeMonth = (this.state.dealTime.getMonth()+1)<10?('0' + (this.state.dealTime.getMonth()+1)) : (this.state.dealTime.getMonth()+1);
        let dealTimeDate = this.state.dealTime.getDate()<10?('0' + this.state.dealTime.getDate()) : this.state.dealTime.getDate();
        let deal = {
            dealType: this.state.dealType,
            dealName: this.state.dealName,
            dealNumber: parseFloat(this.state.dealNumber).toFixed(2),
            dealTime: this.state.dealTime.getFullYear()+'-'+dealTimeMonth+'-'+dealTimeDate,
            dealNote: this.state.dealNote,
            outAccountId: this.state.outAccountId
        }
        //将deal详情传给父组件
        this.props.onSend(deal);
        //恢复默认
        this.setState({
            dealType: '食',
            dealName: '早餐',
            dealNumber: '0.00',
            dealTime: new Date(),
            dealNote: '',

            menuShow: true,
            selectAccountType: false
        })
    }

    render(){
        //console.warn(this.state.accounts)
        return(
            <View>
                {/* 菜单头部 */}
                <ScrollView>
                    <View style={[styles_common.rowCenterCenter, styles.menuHeader]}>
                        <View style={[styles_common.rowStartCenter, styles.menuHeaderItem, {flex:1}]}>
                            <TouchableOpacity 
                                activeOpacity={0.5} 
                                style={{paddingHorizontal: 15, flex:1}}
                                onPress={()=>this.setState({menuShow:true,selectAccountType:false,currentIndex:0})}>
                                <Heading2>{this.state.dealName}</Heading2>
                            </TouchableOpacity>
                            <TextInput
                                style={styles.menuIpt}
                                maxLength={7}
                                selectionColor='transparent'
                                selectTextOnFocus={true}
                                caretHidden={true}
                                underlineColorAndroid='transparent'
                                value={this.state.dealNumber}
                                onFocus={()=>this.setState({menuShow:false,currentIndex:0})}
                                onChangeText={text => this.setState({dealNumber: text})}
                                keyboardType='number-pad'
                                returnKeyLabel='发送'
                                onSubmitEditing={this.setDeal}
                            />
                        </View>
                    </View>
                    {/* 菜单副头部 */}
                    <View style={[styles_common.rowBetweenCenter, styles.menuSubHeader]}>
                        <View style={[styles_common.rowCenterCenter, styles.menuSubHeaderItem]}>
                            <Paragraph 
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{color:null,width: 90,textAlign: 'center',}}>
                                {this.state.dealTime.getFullYear()+'.'+
                                ((this.state.dealTime.getMonth()+1)<10?('0' + (this.state.dealTime.getMonth()+1)) : (this.state.dealTime.getMonth()+1))+'.'+
                                (this.state.dealTime.getDate()<10?('0' + this.state.dealTime.getDate()) : this.state.dealTime.getDate())}    
                            </Paragraph>
                        </View>
                        <TouchableOpacity 
                            style={[styles_common.rowCenterCenter, styles.menuSubHeaderItem]}
                            onPress={()=>this.clickSelectButton()}
                        >
                            <Paragraph 
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{color:null,width: 90,textAlign: 'center',}}>
                                {this.state.accountName}</Paragraph>
                        </TouchableOpacity>
                        <TouchableOpacity 
                            activeOpacity={0.5} 
                            onPress={()=>this.setState({noteShow: true})}
                            style={[styles_common.rowCenterCenter, styles.menuSubHeaderItem]}
                        >
                            <Paragraph
                                numberOfLines={1}
                                ellipsizeMode='tail'
                                style={{color:null,width: 90,textAlign: 'center'}}>
                                {this.state.dealNote==''?'添加备注':this.state.dealNote}
                            </Paragraph>
                        </TouchableOpacity>
                    </View>
                </ScrollView>
                
                {this.state.menuShow?
                (this.state.selectAccountType?
                // 选择账户类型菜单
                <View style={styles.accountMenu}>
                    <FlatList
                        extraData={this.state}
                        data={this.state.accounts}                          
                        keyExtractor={item => item._id}
                        numColumns='2'
                        renderItem={({item, index})=>
                        <AccountMenuItem 
                            account={item}
                            isOdd={this.state.accounts.length%2==0?false:true}
                            isLast={index==this.state.accounts.length-1?true:false}
                            onSelecte={this.setAccount}
                        />}
                    />
                </View>:
                // 消费类型菜单
                <View>
                    {/* 轮播 */}
                    <Carousel
                        selectedIndex={0}
                        dots={false}
                        afterChange={(current)=>this.onHorizontalSelectedIndexChange(current)}
                    >
                        <FlatList
                            style={styles.menuItem}
                            extraData={this.state}
                            data={[
                                {
                                    title: '早餐',
                                    image: require('../../assets/img/accounting/accounting_breakfast.png')
                                },
                                {
                                    title: '午餐',
                                    image: require('../../assets/img/accounting/accounting_lunch.png')
                                },
                                {
                                    title: '晚餐',
                                    image: require('../../assets/img/accounting/accounting_dinner.png')
                                },
                                {
                                    title: '零食',
                                    image: require('../../assets/img/accounting/accounting_snack.png')
                                },
                                {
                                    title: '饮料',
                                    image: require('../../assets/img/accounting/accounting_drink.png')
                                },
                                {
                                    title: '买菜',
                                    image: require('../../assets/img/accounting/accounting_vegetable.png')
                                },
                                {
                                    title: '水果',
                                    image: require('../../assets/img/accounting/accounting_fruit.png')
                                },
                                {
                                    title: '香烟',
                                    image: require('../../assets/img/accounting/accounting_cigarette.png')
                                },
                            ]}                          
                            keyExtractor={item => item.accountId}
                            numColumns='5'
                            renderItem={({item, index})=>
                            <TouchableOpacity 
                                activeOpacity={0.5} 
                                style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                onPress={()=>this.setState({dealType:'食',dealName:item.title,selectAccountType:true})}
                            >
                                <Image style={styles.menuIcon} source={item.image}/>
                                <Text style={{paddingBottom: 10,fontSize: 14,color: '#A5A5A5'}}>{item.title}</Text>
                            </TouchableOpacity>
                            }
                        />  
                        <FlatList
                            style={{paddingTop:10}}
                            extraData={this.state}
                            data={[
                                {
                                    title: '生活用品',
                                    image: require('../../assets/img/accounting/accounting_dailyuse.png')
                                },
                                {
                                    title: '服装',
                                    image: require('../../assets/img/accounting/accounting_clothes.png')
                                },
                                {
                                    title: '包包',
                                    image: require('../../assets/img/accounting/accounting_bag.png')
                                },
                                {
                                    title: '鞋子',
                                    image: require('../../assets/img/accounting/accounting_shoes.png')
                                },
                                {
                                    title: '护肤彩妆',
                                    image: require('../../assets/img/accounting/accounting_cosmetic.png')
                                },
                                {
                                    title: '饰品',
                                    image: require('../../assets/img/accounting/accounting_jewels.png')
                                },
                                {
                                    title: '美容美甲',
                                    image: require('../../assets/img/accounting/accounting_manicure.png')
                                },
                            ]}                          
                            keyExtractor={item => item.accountId}
                            numColumns='5'
                            renderItem={({item, index})=>
                            <TouchableOpacity 
                                activeOpacity={0.5} 
                                style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                onPress={()=>this.setState({dealType:'购',dealName:item.title,selectAccountType:true})}
                            >
                                <Image style={styles.menuIcon} source={item.image}/>
                                <Text style={{paddingBottom: 10,fontSize: 14,color: '#A5A5A5'}}>{item.title}</Text>
                            </TouchableOpacity>
                            }
                        /> 
                        <FlatList
                            style={{paddingTop:10}}
                            extraData={this.state}
                            data={[
                                {
                                    title: '交通',
                                    image: require('../../assets/img/accounting/accounting_traffic.png')
                                },
                                {
                                    title: '加油',
                                    image: require('../../assets/img/accounting/accounting_gasoline.png')
                                },
                                {
                                    title: '停车费',
                                    image: require('../../assets/img/accounting/accounting_parking.png')
                                },
                                {
                                    title: '打车',
                                    image: require('../../assets/img/accounting/accounting_taxi.png')
                                },
                                {
                                    title: '地铁',
                                    image: require('../../assets/img/accounting/accounting_subway.png')
                                },
                                {
                                    title: '火车',
                                    image: require('../../assets/img/accounting/accounting_train.png')
                                },
                                {
                                    title: '公交车',
                                    image: require('../../assets/img/accounting/accounting_bus.png')
                                },
                                {
                                    title: '机票',
                                    image: require('../../assets/img/accounting/accounting_aircraft.png')
                                },
                                {
                                    title: '修车养车',
                                    image: require('../../assets/img/accounting/accounting_repair.png')
                                },
                            ]}                          
                            keyExtractor={item => item.accountId}
                            numColumns='5'
                            renderItem={({item, index})=>
                            <TouchableOpacity 
                                activeOpacity={0.5} 
                                style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                onPress={()=>this.setState({dealType:'行',dealName:item.title,selectAccountType:true})}
                            >
                                <Image style={styles.menuIcon} source={item.image}/>
                                <Text style={{paddingBottom: 10,fontSize: 14,color: '#A5A5A5'}}>{item.title}</Text>
                            </TouchableOpacity>
                            }
                        />  
                        <FlatList
                            style={{paddingTop:10}}
                            extraData={this.state}
                            data={[
                                {
                                    title: '工资',
                                    image: require('../../assets/img/accounting/accounting_wage.png')
                                },
                                {
                                    title: '生活费',
                                    image: require('../../assets/img/accounting/accounting_livingexpense.png')
                                },
                                {
                                    title: '投资收入',
                                    image: require('../../assets/img/accounting/accounting_invest.png')
                                },
                                {
                                    title: '兼职外快',
                                    image: require('../../assets/img/accounting/accounting_parttimejob.png')
                                },
                                {
                                    title: '红包',
                                    image: require('../../assets/img/accounting/accounting_hongbao.png')
                                },
                                {
                                    title: '二手闲置',
                                    image: require('../../assets/img/accounting/accounting_secondhand.png')
                                },
                                {
                                    title: '报销',
                                    image: require('../../assets/img/accounting/accounting_reimburse.png')
                                },
                            ]}                          
                            keyExtractor={item => item.accountId}
                            numColumns='5'
                            renderItem={({item, index})=>
                            <TouchableOpacity 
                                activeOpacity={0.5} 
                                style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                onPress={()=>this.setState({dealType:'收',dealName:item.title,selectAccountType:true})}
                            >
                                <Image style={styles.menuIcon} source={item.image}/>
                                <Text style={{paddingBottom: 10,fontSize: 14,color: '#A5A5A5'}}>{item.title}</Text>
                            </TouchableOpacity>
                            }
                        />  
                    </Carousel>
                        
                    {/* 轮播自定义底部 */}
                    <View style={[styles_common.rowCenterCenter,{height:20}]}>
                        <View style={{padding:5}}>
                            <Tips style={{color: this.state.currentIndex==0?'#EEBF30':'#A5A5A5'}}>食</Tips>
                        </View>
                        <View style={{padding:5}}>
                            <Tips style={{color: this.state.currentIndex==1?'#EEBF30':'#A5A5A5'}}>购</Tips>
                        </View>
                        <View style={{padding:5}}>
                            <Tips style={{color: this.state.currentIndex==2?'#EEBF30':'#A5A5A5'}}>行</Tips>
                        </View>
                        <View style={{padding:5}}>
                            <Tips style={{color: this.state.currentIndex==3?'#EEBF30':'#A5A5A5'}}>收</Tips>
                        </View>
                    </View>
                </View>) : null
                }

                {/* 备注 */}
                <Modal
                    popup
                    maskClosable
                    onClose={()=>this.setState({noteShow:false})}
                    visible={this.state.noteShow}
                    animationType="slide-up"
                >
                    <View style={[styles_common.rowStartCenter, styles.noteContainer]}>
                        <TextInput
                            style={styles.noteIpt}
                            underlineColorAndroid='transparent'
                            multiline={true}
                            numberOfLines={4}
                            autoFocus={true}
                            defaultValue={this.state.dealNote}
                            onChangeText={text=>this.setState({dealNote1: text})}
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
                                onPress={()=>{this.setState({dealNote:this.state.dealNote1,noteShow:false})}}>
                                <Heading2 style={{color: 'white'}}>确定</Heading2>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </View> 
        )
    }
}

const styles = StyleSheet.create({
    menuHeader: {
        backgroundColor: 'white',
        paddingVertical: 10,
        borderColor: '#F3F4F8',
        borderTopWidth: 1,
        borderBottomWidth: 1
    },
    menuHeaderItem: {
        marginHorizontal: 30,
        height: 40,
        backgroundColor: '#F3F4F8',
        borderRadius: 30
    },
    menuIpt: {
        flex: 1,
        marginRight: 15,
        padding: 0,
        textAlign: 'right',
        fontSize: 18, 
        color: '#FF7864',
        fontWeight: '700',
    },
    menuSubHeader: {
        backgroundColor: 'white',
        paddingVertical: 2,
        paddingHorizontal: 5
    },
    menuSubHeaderItem: {
        height: 30,
        width: 100,
        paddingHorizontal: 5,
        backgroundColor: '#F3F4F8',
        borderRadius: 20
    },
    menuItem: {
        paddingTop: 10,
        height: 150,
    },
    menuIcon: {
        width: 40,
        height: 40
    },
    accountMenu: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        height: 170,
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