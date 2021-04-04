import React, { Component } from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import { View, Image, TouchableOpacity, StyleSheet, BackHandler } from 'react-native';
import { Heading1, styles_common } from '../CommonStyles'
import Picker from 'react-native-picker';

export default class Header extends Component {
    componentDidMount() {
        BackHandler.addEventListener('hardwareBackPress', this.onBack);
    }

    componentWillUnmount() {
        BackHandler.removeEventListener('hardwareBackPress', this.onBack);
    }

    //返回
    onBack = () => {
        //console.warn(this.props.pickerOn);
        Picker.hide();
        this.props.onBackRefresh&&this.props.onBackRefresh();
        this.props.navigation.goBack();
        //返回时传递参数 可选
        //this.props.navigation.state.params.callBack(data)
        return true
    }
    render() {
        return (
            <View style={[styles_common.rowCenterCenter, styles.header, this.props.headerBgc]}>
                {this.props.back ? 
                <TouchableOpacity style={styles.header_left} activeOpacity ={0.5} onPress={this.onBack}>
                    <Image style={styles.arrow_left} source={require('../../img/cell_arrow_left.png')} />
                </TouchableOpacity> : null}
                
                <Heading1>{this.props.title}</Heading1>

                {this.props.subtitle&&this.props.subtitleMethod ?
                <TouchableOpacity style={styles.header_right} activeOpacity ={0.5} onPress={this.props.subtitleMethod}>
                    <Heading1 style={{color: this.props.subtitleColor}}>{this.props.subtitle}</Heading1>
                </TouchableOpacity> : null}
            </View>
        )
    }
}
const styles = StyleSheet.create({
    header: {
        position: 'relative',
        height: 60,
        borderBottomWidth: 1,
        borderColor: '#F3F4F8',
        backgroundColor: 'white'
    },
    header_left: {
        position: 'absolute',
        top: 21,
        left: 16,
        paddingHorizontal: 4,
    },
    arrow_left: {
        width: 20,
        height: 20
    },
    header_right: {
        position: 'absolute',
        top: 10,
        right: 15,
        height: 40,
        justifyContent: 'center',
    }
})