import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    ScrollView,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList,
    Image,
    Dimensions,
    Text
} from 'react-native';

import { WhiteSpace, Toast, Modal, Provider, Carousel } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';
import Picker from 'react-native-picker';

import { Heading2, Tips, Paragraph, styles_common } from '../../../../assets/js/CommonStyles'
import Header from '../../../../assets/js/components/Header'
import AccountMenuItem from '../../../../assets/js/components/AccountMenuItem'

var screenWidth = Dimensions.get('window').width;

export default class ConsumeDetailPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            deal: this.props.navigation.getParam('deal',{}),
            dealType: this.props.navigation.getParam('deal',{}).dealType,
            dealName: this.props.navigation.getParam('deal',{}).dealName,
            dealNumber: this.props.navigation.getParam('deal',{}).dealNumber,
            outAccountId: this.props.navigation.getParam('deal',{}).outAccountId,
            inAccountId: this.props.navigation.getParam('deal',{}).inAccountId,
            outAccountName: '',
            inAccountName: '',
            dealNote: this.props.navigation.getParam('deal',{}).dealNote,
            dealTime: this.props.navigation.getParam('deal',{}).dealTime.split('T')[0],
            //
            dealMenuShow: false,
            outAccountMenuShow: false,
            inAccountMenuShow: false,
            accounts: [],
        }
    }

    componentDidMount() {
        this.getData();
        //console.warn(this.props.navigation.getParam('deal',{}))
    }

    //获取本地accounts数据
    getData = async () => {
        try {
            let accounts = await AsyncStorage.getItem('accounts');
            accounts = JSON.parse(accounts);
            this.setState({accounts: accounts});
            //页面内渲染对应的账户
            accounts.forEach(value=>{
                if(value._id==this.state.outAccountId){
                    this.setState({outAccountName: value.accountName});
                }
                if(value._id==this.state.inAccountId){
                    this.setState({inAccountName: value.accountName});
                }
            })
            } catch (e) {
                console.error(e)
            }
    }

    //保存修改
    saveAll = async () => {
        let deal = this.state.deal;
        deal.dealType = this.state.dealType;
        deal.dealName = this.state.dealName;
        let dealNumber = this.state.dealNumber;
        deal.dealNumber = parseFloat(this.state.dealNumber).toFixed(2);
        deal.outAccountId = this.state.outAccountId;
        deal.inAccountId = this.state.inAccountId;
        deal.dealTime = this.state.dealTime;
        deal.dealNote = this.state.dealNote;

        if(deal.outAccountId!=deal.inAccountId) {
            //上传到服务器
            fetch('http://192.168.43.2:3000/modifyDeal', {
                method: 'POST',
                headers: {
                    // Accept: 'application/json',
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    deal: deal,
                }),
                })
                    .then(res=>res.json())
                    .then(async (data)=>{
                        //console.warn(data)
                        //更新本地存储
                        await AsyncStorage.setItem('deals', JSON.stringify(data.deals));
                        await AsyncStorage.setItem('accounts', JSON.stringify(data.accounts));
                        //保存成功,更新页面
                        Toast.success('保存成功',0.5,()=>{
                            //返回上一级页面并传递更新的数据
                            this.props.navigation.state.params.onBackRefresh();
                            this.props.navigation.goBack();
                        },true)
                    })
                    .catch((error) => {
                        Toast.offline('服务器出错了',0.5,()=>{},true)
                        console.error(error);
                    });
        } else {
            Toast.fail("不能设为相同账户哦",0.5,()=>{},true);
        }
    }

    //删除deal及相关数据
    deleteDeal = async () => {
        this.setState({accounterName:this.state.accounterName1,changeAccounterNameShow:false});
        //上传到服务器
        fetch('http://192.168.43.2:3000/deleteDeal', {
        method: 'POST',
        headers: {
            // Accept: 'application/json',
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({
            deal: this.state.deal,
        }),
        })
            .then(res=>res.json())
            .then(async (data)=>{
                //console.warn(data)
                //更新本地存储
                await AsyncStorage.setItem('deals', JSON.stringify(data.deals));
                await AsyncStorage.setItem('accounts', JSON.stringify(data.accounts));
                //删除成功,更新页面
                Toast.success('删除成功',0.5,()=>{
                    //返回上一级页面并传递更新的数据
                    this.props.navigation.state.params.onBackRefresh();
                    this.props.navigation.goBack();
                },true)
            })
            .catch((error) => {
                Toast.offline('服务器出错了',0.5,()=>{},true)
                console.error(error);
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
    showPicker(data) {
        Picker.init({
            pickerData: data.pickerData,
            selectedValue: [...this.state.dealTime.split('-')],

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
                this.setState({dealTime: pickedValue.join('-')});
            },
        });
        Picker.show();
    }

    //轮播图自定义需求
    onHorizontalSelectedIndexChange(current) {
        this.setState({currentIndex: current});
    }

    render() {
        let dealImage = {
            '转账': require('../../../../assets/img/accounting/accounting_secondhand.png'),

            '早餐': require('../../../../assets/img/accounting/accounting_breakfast.png'),
            '午餐': require('../../../../assets/img/accounting/accounting_lunch.png'),
            '晚餐': require('../../../../assets/img/accounting/accounting_dinner.png'),
            '零食': require('../../../../assets/img/accounting/accounting_snack.png'),
            '饮料': require('../../../../assets/img/accounting/accounting_drink.png'),
            '买菜': require('../../../../assets/img/accounting/accounting_vegetable.png'),
            '水果': require('../../../../assets/img/accounting/accounting_fruit.png'),
            '香烟': require('../../../../assets/img/accounting/accounting_cigarette.png'),

            '生活用品': require('../../../../assets/img/accounting/accounting_dailyuse.png'),
            '服装': require('../../../../assets/img/accounting/accounting_clothes.png'),
            '包包': require('../../../../assets/img/accounting/accounting_bag.png'),
            '鞋子': require('../../../../assets/img/accounting/accounting_shoes.png'),
            '护肤彩妆': require('../../../../assets/img/accounting/accounting_cosmetic.png'),
            '饰品': require('../../../../assets/img/accounting/accounting_jewels.png'),
            '美容美甲': require('../../../../assets/img/accounting/accounting_manicure.png'),

            '交通': require('../../../../assets/img/accounting/accounting_traffic.png'),
            '加油': require('../../../../assets/img/accounting/accounting_gasoline.png'),
            '停车费': require('../../../../assets/img/accounting/accounting_parking.png'),
            '打车': require('../../../../assets/img/accounting/accounting_taxi.png'),
            '地铁': require('../../../../assets/img/accounting/accounting_subway.png'),
            '火车': require('../../../../assets/img/accounting/accounting_train.png'),
            '公交车': require('../../../../assets/img/accounting/accounting_bus.png'),
            '机票': require('../../../../assets/img/accounting/accounting_aircraft.png'),
            '修车养车': require('../../../../assets/img/accounting/accounting_repair.png'),

            '工资': require('../../../../assets/img/accounting/accounting_wage.png'),
            '生活费': require('../../../../assets/img/accounting/accounting_livingexpense.png'),
            '投资收入': require('../../../../assets/img/accounting/accounting_invest.png'),
            '兼职外快': require('../../../../assets/img/accounting/accounting_parttimejob.png'),
            '红包': require('../../../../assets/img/accounting/accounting_hongbao.png'),
            '二手闲置': require('../../../../assets/img/accounting/accounting_secondhand.png'),
            '报销': require('../../../../assets/img/accounting/accounting_reimburse.png'),
        }
        return (
            <Provider>
                <View style={styles_common.containerGray}>
                    {/* 渲染头部组件 */}
                    <Header 
                        headerBgc={{backgroundColor: '#F3F4F8'}}
                        navigation={this.props.navigation}
                        back={true}
                        title='详情'
                        subtitle='保存'
                        subtitleMethod={this.saveAll}
                        subtitleColor='#EB705E'
                    />
                    <ScrollView>
                        <View style={styles.radiusBox}>
                            <View style={[styles_common.rowCenterCenter, styles.title]}>
                                <TouchableOpacity
                                    disabled={this.state.dealType=='转'?true:false}
                                    style={[styles_common.rowStartCenter, {flex:1}]}
                                    activeOpacity ={0.5} 
                                    onPress={()=>{this.setState({dealMenuShow:true})}}
                                >
                                    <Image 
                                        style={styles.icon} 
                                        source={dealImage[this.state.dealName]} 
                                    />
                                    <Heading2>{this.state.dealName}</Heading2>   
                                </TouchableOpacity>
                                <TextInput
                                    style={styles.ipt}
                                    maxLength={7}
                                    textAlign='right'
                                    selectionColor='transparent'
                                    selectTextOnFocus={true}
                                    caretHidden={true}
                                    underlineColorAndroid='transparent'
                                    value={this.state.dealNumber}
                                    onChangeText={text=>this.setState({dealNumber: text})}
                                    keyboardType='number-pad'
                                />
                            </View>
                            <View style={styles.body}>
                                <TouchableOpacity 
                                    activeOpacity={0.5} 
                                    onPress={this.showPicker.bind(this, {pickerTitleText: '请选择时间',pickerData: this.createDate()})}
                                >
                                    <View style={[styles_common.rowStartCenter, styles.bodyItem]}>
                                        <Heading2 style={{color: '#A5A5A5'}}>时间</Heading2>
                                        <View style={{ flex: 1 }} />
                                        <Heading2>{this.state.dealTime}</Heading2>
                                        <Image style={styles_common.arrow_right} source={require('../../../../assets/img/cell_arrow_right.png')} />
                                    </View>
                                </TouchableOpacity>
                                <TouchableOpacity 
                                    activeOpacity={0.5} 
                                    onPress={()=>{this.setState({outAccountMenuShow:true})}}
                                >
                                    <View style={[styles_common.rowStartCenter, styles.bodyItem]}>
                                        <Heading2 style={{color: '#A5A5A5'}}>{this.state.dealType=='转'?'转出账户':'账户'}</Heading2>
                                        <View style={{ flex: 1 }} />
                                        <Heading2>{this.state.outAccountName}</Heading2>
                                        <Image style={styles_common.arrow_right} source={require('../../../../assets/img/cell_arrow_right.png')} />
                                    </View>
                                </TouchableOpacity>
                                {this.state.dealType=='转'?
                                <TouchableOpacity 
                                    activeOpacity={0.5} 
                                    onPress={()=>{this.setState({inAccountMenuShow:true})}}
                                >
                                    <View style={[styles_common.rowStartCenter, styles.bodyItem]}>
                                        <Heading2 style={{color: '#A5A5A5'}}>转入账户</Heading2>
                                        <View style={{ flex: 1 }} />
                                        <Heading2>{this.state.inAccountName}</Heading2>
                                        <Image style={styles_common.arrow_right} source={require('../../../../assets/img/cell_arrow_right.png')} />
                                    </View>
                                </TouchableOpacity>:null}
                            </View>
                            <View style={[styles_common.rowStartCenter, styles.note]}>
                                 <TouchableOpacity activeOpacity={0.5} style={{flex: 1}} onPress={()=>{}}>
                                    <View style={[styles_common.rowStartCenter, styles.bodyItem]}>
                                        <Heading2 style={{color: '#A5A5A5'}}>备注</Heading2>
                                        <TextInput
                                            style={styles.noteIpt}
                                            underlineColorAndroid='transparent'
                                            multiline={true}
                                            selectTextOnFocus={true}
                                            selectionColor='#EEBF30'
                                            defaultValue={this.state.dealNote}
                                            onChangeText={text=>this.setState({dealNote: text})}
                                        />
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                        <WhiteSpace />
                        <TouchableOpacity 
                            activeOpacity ={0.5} 
                            onPress={this.deleteDeal} 
                            style={[styles_common.rowCenterCenter, styles.deleteBtn]}>
                            <Heading2 style={{color: '#EB705E'}}>删除记录</Heading2>
                        </TouchableOpacity>
                    </ScrollView>

                    {/* 选择deal类型 */}
                    <Modal
                        popup
                        maskClosable
                        onClose={()=>this.setState({dealMenuShow:false, currentIndex: 0})}
                        visible={this.state.dealMenuShow}
                        animationType="slide-up"
                     >
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
                                            image: require('../../../../assets/img/accounting/accounting_breakfast.png')
                                        },
                                        {
                                            title: '午餐',
                                            image: require('../../../../assets/img/accounting/accounting_lunch.png')
                                        },
                                        {
                                            title: '晚餐',
                                            image: require('../../../../assets/img/accounting/accounting_dinner.png')
                                        },
                                        {
                                            title: '零食',
                                            image: require('../../../../assets/img/accounting/accounting_snack.png')
                                        },
                                        {
                                            title: '饮料',
                                            image: require('../../../../assets/img/accounting/accounting_drink.png')
                                        },
                                        {
                                            title: '买菜',
                                            image: require('../../../../assets/img/accounting/accounting_vegetable.png')
                                        },
                                        {
                                            title: '水果',
                                            image: require('../../../../assets/img/accounting/accounting_fruit.png')
                                        },
                                        {
                                            title: '香烟',
                                            image: require('../../../../assets/img/accounting/accounting_cigarette.png')
                                        },
                                    ]}                          
                                    keyExtractor={item => item.accountId}
                                    numColumns='5'
                                    renderItem={({item, index})=>
                                    <TouchableOpacity 
                                        activeOpacity={0.5} 
                                        style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                        onPress={()=>this.setState({dealType:'食',dealName:item.title,dealMenuShow:false, currentIndex: 0})}
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
                                            image: require('../../../../assets/img/accounting/accounting_dailyuse.png')
                                        },
                                        {
                                            title: '服装',
                                            image: require('../../../../assets/img/accounting/accounting_clothes.png')
                                        },
                                        {
                                            title: '包包',
                                            image: require('../../../../assets/img/accounting/accounting_bag.png')
                                        },
                                        {
                                            title: '鞋子',
                                            image: require('../../../../assets/img/accounting/accounting_shoes.png')
                                        },
                                        {
                                            title: '护肤彩妆',
                                            image: require('../../../../assets/img/accounting/accounting_cosmetic.png')
                                        },
                                        {
                                            title: '饰品',
                                            image: require('../../../../assets/img/accounting/accounting_jewels.png')
                                        },
                                        {
                                            title: '美容美甲',
                                            image: require('../../../../assets/img/accounting/accounting_manicure.png')
                                        },
                                    ]}                          
                                    keyExtractor={item => item.accountId}
                                    numColumns='5'
                                    renderItem={({item, index})=>
                                    <TouchableOpacity 
                                        activeOpacity={0.5} 
                                        style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                        onPress={()=>this.setState({dealType:'购',dealName:item.title,dealMenuShow:false, currentIndex: 0})}
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
                                            image: require('../../../../assets/img/accounting/accounting_traffic.png')
                                        },
                                        {
                                            title: '加油',
                                            image: require('../../../../assets/img/accounting/accounting_gasoline.png')
                                        },
                                        {
                                            title: '停车费',
                                            image: require('../../../../assets/img/accounting/accounting_parking.png')
                                        },
                                        {
                                            title: '打车',
                                            image: require('../../../../assets/img/accounting/accounting_taxi.png')
                                        },
                                        {
                                            title: '地铁',
                                            image: require('../../../../assets/img/accounting/accounting_subway.png')
                                        },
                                        {
                                            title: '火车',
                                            image: require('../../../../assets/img/accounting/accounting_train.png')
                                        },
                                        {
                                            title: '公交车',
                                            image: require('../../../../assets/img/accounting/accounting_bus.png')
                                        },
                                        {
                                            title: '机票',
                                            image: require('../../../../assets/img/accounting/accounting_aircraft.png')
                                        },
                                        {
                                            title: '修车养车',
                                            image: require('../../../../assets/img/accounting/accounting_repair.png')
                                        },
                                    ]}                          
                                    keyExtractor={item => item.accountId}
                                    numColumns='5'
                                    renderItem={({item, index})=>
                                    <TouchableOpacity 
                                        activeOpacity={0.5} 
                                        style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                        onPress={()=>this.setState({dealType:'行',dealName:item.title,dealMenuShow:false, currentIndex: 0})}
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
                                            image: require('../../../../assets/img/accounting/accounting_wage.png')
                                        },
                                        {
                                            title: '生活费',
                                            image: require('../../../../assets/img/accounting/accounting_livingexpense.png')
                                        },
                                        {
                                            title: '投资收入',
                                            image: require('../../../../assets/img/accounting/accounting_invest.png')
                                        },
                                        {
                                            title: '兼职外快',
                                            image: require('../../../../assets/img/accounting/accounting_parttimejob.png')
                                        },
                                        {
                                            title: '红包',
                                            image: require('../../../../assets/img/accounting/accounting_hongbao.png')
                                        },
                                        {
                                            title: '二手闲置',
                                            image: require('../../../../assets/img/accounting/accounting_secondhand.png')
                                        },
                                        {
                                            title: '报销',
                                            image: require('../../../../assets/img/accounting/accounting_reimburse.png')
                                        },
                                    ]}                          
                                    keyExtractor={item => item.accountId}
                                    numColumns='5'
                                    renderItem={({item, index})=>
                                    <TouchableOpacity 
                                        activeOpacity={0.5} 
                                        style={[styles_common.columnCenterCenter, {width:screenWidth/5}]}
                                        onPress={()=>this.setState({dealType:'收',dealName:item.title,dealMenuShow:false, currentIndex: 0})}
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
                        </View>
                    </Modal>
                    {/* 选择转出账户 */}
                    <Modal
                        popup
                        maskClosable
                        onClose={()=>this.setState({outAccountMenuShow:false})}
                        visible={this.state.outAccountMenuShow}
                        animationType="slide-up"
                     >
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
                                    onSelecte={()=>this.setState({outAccountId: item._id, outAccountName: item.accountName, outAccountMenuShow: false})}
                                />}
                            />
                         </View>
                    </Modal>
                    {/* 选择转入账户 */}
                    <Modal
                        popup
                        maskClosable
                        onClose={()=>this.setState({inAccountMenuShow:false})}
                        visible={this.state.inAccountMenuShow}
                        animationType="slide-up"
                     >
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
                                    onSelecte={()=>this.setState({inAccountId: item._id, inAccountName: item.accountName, inAccountMenuShow: false})}
                                />}
                            />
                         </View>
                    </Modal>
                </View>
            </Provider>
        );
    }
}
const styles = StyleSheet.create({
    //详情盒子
    radiusBox: {
        marginHorizontal: 15,
        marginVertical: 5,
        paddingHorizontal: 20,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    title: {
        borderBottomWidth: 1,
        borderColor: '#F3F4F8',
        paddingVertical: 10,
    },
    ipt: {
        padding: 0,
        flex: 1,
        fontSize: 18, 
        color: '#FF7864',
        fontWeight: '700',
    },
    icon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        marginRight: 10
    },
    body: {
        borderBottomWidth: 1,
        borderColor: '#F3F4F8',
        paddingVertical: 5, 
    },
    bodyItem: {
        paddingVertical: 10,
    },
    note: {
        paddingVertical: 5, 
    },
    //删除按钮
    deleteBtn: {
        marginHorizontal: 15,
        marginVertical: 5,
        paddingVertical: 10,
        borderRadius: 10,
        backgroundColor: 'white'
    },
    //account菜单
    accountMenu: {
        paddingVertical: 20,
        paddingHorizontal: 10,
        height: 170,
    },
    //deal菜单
    menuItem: {
        paddingTop: 10,
        height: 150,
    },
    menuIcon: {
        width: 40,
        height: 40
    },
    //备注
    noteIpt: {
        paddingVertical: 0,
        paddingHorizontal: 10,
        flex: 1,
        fontSize: 18
    },
});