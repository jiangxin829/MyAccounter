import React, {Component} from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import {
    View,
    StyleSheet,
    RefreshControl,
    Image,
    ScrollView,
    TouchableOpacity,
} from 'react-native';
import { WhiteSpace, Toast, Provider } from '@ant-design/react-native';
import AsyncStorage from '@react-native-community/async-storage';

import { HeadingBig, Paragraph, styles_common } from '../../assets/js/CommonStyles'
import ItemCell from '../../assets/js/components/ItemCell';

export default class MinePage extends Component {
    constructor(props) {
        super(props)
        this.state = {
            isRefreshing: false,
            nickName: '',
            accounterName: '',//accounting页面accounterName更新以后无法更新BottomTabNavigator的数据
            togetherTime: ''
        }
    }

    componentDidMount() {
        this.getData()
    }

    getData = async () => {
        try {
            let user = await AsyncStorage.getItem('user')
            user = JSON.parse(user)
            let startTime = new Date(user.createdTime).getTime();    
            let endTime = new Date().getTime();    
            let dates = Math.ceil(Math.abs((startTime - endTime))/(1000*60*60*24));  
            this.setState({
                nickName: user.nickName,
                togetherTime: dates,
                accounterName: user.accounterName
            })
          } catch (e) {
            console.error(e)
          }
    }

    //下拉刷新
    onHeaderRefresh = () => {
        this.setState({isRefreshing: true})
        this.getData()
        this.setState({isRefreshing: false})
    }

    //渲染头部组件
    renderHeader() {
        let {navigation} = this.props;
        return (
            <View style={{paddingBottom: 10}}>
                <View style={[styles_common.rowEndCenter, {marginTop: 10}]}>
                    <TouchableOpacity activeOpacity ={0.5} onPress={()=>{navigation.navigate('Reminder')}}>
                        <Image style={styles.icon_alert}
                               source={require('../../assets/img/mine/mine_alert.png')}/>
                    </TouchableOpacity>
                </View>
                <TouchableOpacity 
                    activeOpacity ={0.5} 
                    style={[styles_common.rowStartCenter, {margin: 10}]} 
                    onPress={()=>{navigation.navigate('UserInfo', {onSave: this.onHeaderRefresh})}}>
                    <Image style={styles.avatar} source={require('../../assets/img/mine/user.png')}/>
                    <View style={{paddingLeft: 10}}>
                        <HeadingBig style={{marginTop: 4}}>{this.state.nickName}</HeadingBig>
                        <Paragraph style={{marginTop: 6}}>与{this.state.accounterName}在一起的第
                            <HeadingBig style={{color: '#FFC653'}}>{this.state.togetherTime}</HeadingBig>天
                        </Paragraph>
                    </View>
                    <View style={{flex: 1}}></View>
                    <Image style={styles_common.arrow_right} source={require('../../assets/img/cell_arrow_right.png')} />
                </TouchableOpacity>
            </View>
        )
    }

    //渲染MineItems
    renderMineItemsCells(dataList) {
        let cells = []
        for (let i = 0; i < dataList.length; i++) {
            let sublist = dataList[i]
            for (let j = 0; j < sublist.length; j++) {
                let data = sublist[j]
                if(j == sublist.length - 1 && i != dataList.length - 1) {
                    let cell = 
                    <ItemCell image={data.image} title={data.title} subtitle={data.subtitle}
                    key={data.title} screen={data.screen} navigation={this.props.navigation} 
                    style={{borderBottomWidth: 1, borderColor: '#F3F4F8'}}/>
                    cells.push(cell)
                } else {
                    let cell = 
                    <ItemCell image={data.image} title={data.title} subtitle={data.subtitle}
                    key={data.title} screen={data.screen} navigation={this.props.navigation}/>
                    cells.push(cell)
                }
            }
        }
        return (
            <View style={{flex: 1}}>
                {cells}
            </View>
        )
    }

    //MineItems数据
    getDataList() {
        return (
            [
                [
                    {title: '调教MyAccounter', subtitle: '让Accounter更懂你', image: require('../../assets/img/mine/mine_edu.png'), screen: 'Teaching'},
                ],
                [
                    {title: '我的钱包', image: require('../../assets/img/mine/mine_wallet.png'), screen: 'Wallet'},
                ],
                [
                    {title: '记账提醒', subtitle: '每天18:30',image: require('../../assets/img/mine/mine_reminder.png'), screen: 'Reminder'},
                ],
                [
                    {title: '设置', image: require('../../assets/img/mine/mine_setting.png'), screen: 'Setting'},
                ],
                [
                    {title: '关于APP', subtitle: '我要合作', image: require('../../assets/img/mine/mine_gift.png'), screen: 'About'}
                ]
            ]
        )
    }

    render() {
        return (
            <View style={styles_common.containerWhite}>
                <ScrollView
                    refreshControl={
                        <RefreshControl
                            refreshing={this.state.isRefreshing}
                            onRefresh={() => this.onHeaderRefresh()}
                        />
                    }>
                    {this.renderHeader()}
                    <WhiteSpace />
                    {this.renderMineItemsCells(this.getDataList())}
                </ScrollView>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    icon_alert: {
        width: 25,
        height: 30,
        marginRight: 15
    },
    avatar: {
        width: 70,
        height: 70,
        marginHorizontal: 10,
        borderRadius: 35,
        borderWidth: 2,
        borderColor: '#EEBF30'
    },
    tabBarIcon: {
        width: 30,
        height: 30,
    }
});