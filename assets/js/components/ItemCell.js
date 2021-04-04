import React, { Component } from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import { View, StyleSheet, Image, TouchableOpacity } from 'react-native';
import { Heading2, Paragraph, styles_common } from '../CommonStyles'

export default class ItemCell extends Component {
    render() {
        let icon = null;
        if (this.props.image) {
            icon = <Image style={styles.icon} source={this.props.image} />
        }
        let screen = this.props.screen
        let {navigation} = this.props;
        return (
            <TouchableOpacity activeOpacity={0.5} onPress={()=>{navigation.navigate(screen)}}>
                <View style={[styles_common.rowStartCenter, styles.content, this.props.style]}>
                    {icon}
                    <Heading2>{this.props.title}</Heading2>
                    <View style={{ flex: 1 }} />
                    {this.props.subtitle?<Paragraph>{this.props.subtitle}</Paragraph>:null}
                    <Image style={styles_common.arrow_right} source={require('../../img/cell_arrow_right.png')} />
                </View>
            </TouchableOpacity>
        );
    }
}

const styles = StyleSheet.create({
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