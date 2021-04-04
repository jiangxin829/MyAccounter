import React, { Component } from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import { View, StyleSheet, Image, TouchableOpacity, TouchableHighlightBase } from 'react-native';
import { Heading2, styles_common } from '../CommonStyles'

export default class AccountCell extends Component {
    render() {
        let icon = null;
        if (this.props.image) {
            icon = <Image style={styles.icon} source={this.props.image} />
        }
        let screen = this.props.screen
        let {navigation} = this.props;
        return (
            <TouchableOpacity 
            style={[styles_common.rowStartCenter, styles.content, this.props.style]}
            activeOpacity ={0.5} 
            onPress={()=>{navigation.navigate(screen, {
                'accountType': this.props.title, 
                'account': this.props.account, 
                onBackRefresh: this.props.onBackRefresh,
                'backKey': this.props.backKey
                })}}>
                {icon}
                <Heading2 style={{marginHorizontal:15}}>{this.props.title}</Heading2>
                <View style={{ flex: 1 }} />
                {this.props.subtitle?<Heading2 style={{marginHorizontal:15}}>{this.props.subtitle}</Heading2>:null}
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
    content: {
        height: 60,
        backgroundColor: 'white'
    },
    icon: {
        marginLeft: 15,
        width: 40,
        height: 40,
        borderRadius: 20,
    }
});