import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    Image,
    StyleSheet,
    TouchableOpacity,
    TextInput,
    FlatList
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';

import { Heading2, Tips, styles_common } from '../../../assets/js/CommonStyles'

export default class SearchPage extends Component {
    constructor(props){
        super(props)
        this.state = {
            deals: [],
            result: [],
            searchKeyWord: '',
            searched: false,
        }
    }

    componentDidMount() {
        this.getData()
    }

    //获取本地数据
    getData = async () => {
        try {
            let deals = await AsyncStorage.getItem('deals');
            this.setState({deals: JSON.parse(deals)});
          } catch (e) {
            console.error(e)
          }
    }

    search(searchKeyWord) {
        if(searchKeyWord!='') {
            this.setState({searched: true});
            let result = [];
            this.state.deals.forEach(value=>{
                if(value.dealName.match(searchKeyWord)!=null||value.dealNote.match(searchKeyWord)!==null) {
                    result.push(value);
                }
            })
            this.setState({result: result});
        } else {
            this.setState({searched: false});
        }
    } 
    render() {
        let dealImage = {
            '转账': require('../../../assets/img/accounting/accounting_secondhand.png'),

            '早餐': require('../../../assets/img/accounting/accounting_breakfast.png'),
            '午餐': require('../../../assets/img/accounting/accounting_lunch.png'),
            '晚餐': require('../../../assets/img/accounting/accounting_dinner.png'),
            '零食': require('../../../assets/img/accounting/accounting_snack.png'),
            '饮料': require('../../../assets/img/accounting/accounting_drink.png'),
            '买菜': require('../../../assets/img/accounting/accounting_vegetable.png'),
            '水果': require('../../../assets/img/accounting/accounting_fruit.png'),
            '香烟': require('../../../assets/img/accounting/accounting_cigarette.png'),

            '生活用品': require('../../../assets/img/accounting/accounting_dailyuse.png'),
            '服装': require('../../../assets/img/accounting/accounting_clothes.png'),
            '包包': require('../../../assets/img/accounting/accounting_bag.png'),
            '鞋子': require('../../../assets/img/accounting/accounting_shoes.png'),
            '护肤彩妆': require('../../../assets/img/accounting/accounting_cosmetic.png'),
            '饰品': require('../../../assets/img/accounting/accounting_jewels.png'),
            '美容美甲': require('../../../assets/img/accounting/accounting_manicure.png'),

            '交通': require('../../../assets/img/accounting/accounting_traffic.png'),
            '加油': require('../../../assets/img/accounting/accounting_gasoline.png'),
            '停车费': require('../../../assets/img/accounting/accounting_parking.png'),
            '打车': require('../../../assets/img/accounting/accounting_taxi.png'),
            '地铁': require('../../../assets/img/accounting/accounting_subway.png'),
            '火车': require('../../../assets/img/accounting/accounting_train.png'),
            '公交车': require('../../../assets/img/accounting/accounting_bus.png'),
            '机票': require('../../../assets/img/accounting/accounting_aircraft.png'),
            '修车养车': require('../../../assets/img/accounting/accounting_repair.png'),

            '工资': require('../../../assets/img/accounting/accounting_wage.png'),
            '生活费': require('../../../assets/img/accounting/accounting_livingexpense.png'),
            '投资收入': require('../../../assets/img/accounting/accounting_invest.png'),
            '兼职外快': require('../../../assets/img/accounting/accounting_parttimejob.png'),
            '红包': require('../../../assets/img/accounting/accounting_hongbao.png'),
            '二手闲置': require('../../../assets/img/accounting/accounting_secondhand.png'),
            '报销': require('../../../assets/img/accounting/accounting_reimburse.png'),
        }
        return (
            <View style={styles_common.containerWhite}>
                {/* 头部搜索框 */}
                <View style={[styles_common.rowBetweenCenter, styles.header]}>
                    <View style={[styles_common.rowBetweenCenter, styles.searchBar]}>
                        <Image source={require('../../../assets/img/search/search_search.png')} style={styles.searchIcon} />
                        <TextInput 
                            style={styles.searchIpt}
                            placeholder='输入晚餐试试看'
                            selectionColor='#EEBF30'
                            autoFocus={true}
                            onChangeText={text => {this.setState({searchKeyWord: text});this.search(text)}}
                            onSubmitEditing={()=>this.search(this.state.searchKeyWord)}
                            returnKeyLabel='搜索'
                        />
                    </View>
                    <TouchableOpacity 
                        activeOpacity={0.5} 
                        style={styles.cancleBtn}
                        onPress={()=>this.props.navigation.goBack()}
                    >
                        <Heading2>取消</Heading2>
                    </TouchableOpacity>
                </View>
                {/* 渲染搜索结果 */}
                {this.state.searched?
                (<View>
                    {this.state.result.length>0? 
                    (<View>
                        <FlatList
                            extraData={this.state}
                            data={this.state.result}                          
                            keyExtractor={result => result._id}
                            renderItem={({item, index})=>
                            <TouchableOpacity 
                                activeOpacity={0.5}
                                style={[styles_common.rowStartCenter, styles.resultItem]} 
                                key={index}
                                onPress={()=>this.props.navigation.navigate('ConsumeDetail', {deal: item, onBackRefresh: this.getData})}
                            >
                                <Image source={dealImage[item.dealName]} style={styles.resultIcon} />
                                <View style={{flex:1}}>
                                    <Heading2>{item.dealName}</Heading2>
                                    {item.dealNote?<Tips numberOfLines={1} ellipsizeMode='tail'style={{color:'#A5A5A5', width:150}}>{item.dealNote}</Tips>:null}
                                </View>
                                <View style={{alignItems: 'flex-end'}}>
                                    <Heading2>{item.dealNumber}</Heading2>
                                    <Tips style={{color: '#A5A5A5'}}>{item.dealTime}</Tips>
                                </View>
                            </TouchableOpacity>}
                        />
                    </View>) : 
                    (<View style={styles.notFound}>
                        <Image source={require('../../../assets/img/search/search_notFound.png')} style={styles.notFoundImg} />
                        <Heading2 style={{color: '#A5A5A5', width: 300, textAlign: 'center'}} numberOfLines={1} ellipsizeMode='tail'>Oh~找不到任何与
                            <Heading2 style={{color: 'black'}}>" {this.state.searchKeyWord} "</Heading2>
                        有关的内容</Heading2>
                    </View>)}
                </View>) : null}
            </View>
        );
    }
}
const styles = StyleSheet.create({
    header: {
        paddingVertical: 10,
        paddingHorizontal: 15,
        borderBottomWidth: 1,
        borderBottomColor: '#F3F4F8'
    },
    searchBar: {
        flex: 1,
        height: 40,
        paddingHorizontal: 10,
        borderRadius: 20,
        backgroundColor: '#F3F4F8'
    },
    searchIcon: {
        width: 30,
        height: 30,
        marginRight: 10,
    },
    searchIpt: {
        flex: 1,
        padding: 0,
        fontSize: 16,
    },
    cancleBtn: {
        justifyContent: 'center',
        alignItems: 'center',
        paddingLeft: 10,
    },
    //result
    resultItem: {
        marginHorizontal: 20,
        paddingVertical: 10,
        borderBottomColor: '#F3F4F8',
        borderBottomWidth: 1
    },
    resultIcon: {
        width: 40,
        height: 40,
        marginRight: 10,
    },
    notFound: {
        alignItems: 'center',
        paddingTop: 30
    },
    notFoundImg: {
        width: 300,
        height: 100,
        margin: 10
    }
});