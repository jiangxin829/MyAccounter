import React from 'react';// 主题黄: '#EEBF30' 238,191,48  //  Paragraph灰: '#A5A5A5 // borderColor,bgc灰: '#F3F4F8' 243,244,248
import { Text, StyleSheet } from 'react-native';

export function HeadingBig({style, ...props}) {
    return <Text style={[{fontSize: 22}, style]} {...props} />
}

export function Heading1({style, ...props}){
    return <Text style={[{fontSize: 18}, style]} {...props} />
}

export function Heading2({style, ...props}){
    return <Text style={[{fontSize: 16}, style]} {...props} />
}

export function Paragraph({style, ...props}){
    return <Text style={[{fontSize: 14, color: '#A5A5A5'}, style]} {...props} />
}
export function Tips({style, ...props}){
    return <Text style={[{fontSize: 12, color: 'rgba(255,255,255,0.5)'}, style]} {...props} />
}

export const styles_common = StyleSheet.create({
    rowStartCenter: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    rowEndCenter: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
        alignItems: 'center',
    },
    rowCenterCenter: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    rowBetweenCenter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    rowAroundCenter: {
        flexDirection: 'row',
        justifyContent: 'space-around',
        alignItems: 'center'
    },
    columnCenterCenter: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    columnBetweenCenter: {
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center'
    },
    columnAroundCenter: {
        flexDirection: 'column',
        justifyContent: 'space-around',
        alignItems: 'center'
    },

    containerWhite: {
        flex: 1,
        backgroundColor: 'white'
    },
    containerGray: {
        flex: 1,
        backgroundColor: '#F3F4F8',
    },
    arrow_right: {
        width: 14,
        height: 14,
        marginLeft: 5,
    },
    arrow_left: {
        width: 20,
        height: 18,
        marginLeft: 20,
    },
})