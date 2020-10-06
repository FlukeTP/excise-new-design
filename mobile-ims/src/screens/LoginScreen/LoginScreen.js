import React, { Component } from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Container, Thumbnail } from 'native-base';
import LoginForm from './LoginForm';

class LoginScreen extends Component {
    render() {
        const uri = require("../../assets/images/logo.png");
        return (
            <Container style={styles.header}>
                <Thumbnail resizeMode={'contain'} style={styles.titleLogo} source={uri} />
                <Text style={styles.titleText}>ระบบปฎิบัติการ</Text>
                <LoginForm navigation={this.props.navigation} />
            </Container>
        )
    }
}

export default LoginScreen;

const styles = StyleSheet.create({
    header: {
        backgroundColor: '#00569B',
        alignItems: 'center',
        paddingTop: '15%',
        width: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },
    titleLogo: {
        width: '80%',
        height: 130
    },
    titleText: {
        // fontFamily: Fonts.prompt,
        fontSize: 25,
        color: 'white',
        marginTop: -20,
        paddingRight: '20%',
        textAlign: 'right',
        width: '100%'
    }
});