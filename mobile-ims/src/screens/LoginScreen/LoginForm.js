import React, { Component } from 'react';
import { Alert, AsyncStorage, StyleSheet, View } from 'react-native';
import { Content, Item, Input, Button, Text, Icon } from 'native-base';
import { Field, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { AUTH_API } from '../../api/index';
import { USER } from '../../store/actions/index';

const validate = values => {
    const error = {};
    error.username = '';
    error.password = '';
    var user = values.username;
    var pass = values.password;
    if (values.username === undefined) {
        user = '';
        error.username = 'need';
    }
    if (values.password === undefined) {
        pass = '';
    }
    if (user === '') {
        error.username = 'need';
    }
    if (pass === '') {
        error.password = 'need';
    }
    return error;
};
class LoginForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            isReady: false
        };
        this.renderInput = this.renderInput.bind(this);
    }

    renderInput(props) {
        const { input, meta: { touched, error, warning } } = props;
        var hasError = false;
        if (error !== undefined && touched) {
            hasError = true;
        }
        if (input.name === 'username') {
            return (
                <Item style={hasError ? styles.ItemError : styles.Item} error={hasError}>
                    <Icon name='person' style={{ color: 'white' }} />
                    <Input style={styles.Input} placeholder="ชื่อผู้ใช้"
                        placeholderTextColor="#d0d0d0" {...input} />
                    {hasError ? <Icon style={{ color: 'white' }} name='close-circle' /> : <Text />}
                </Item>
            )
        }
        if (input.name === 'password') {
            return (
                <Item style={hasError ? styles.ItemError : styles.Item} error={hasError}>
                    <Icon name='lock' style={{ color: 'white' }} />
                    <Input style={styles.Input} placeholder="รหัสผ่าน"
                        placeholderTextColor="#d0d0d0"
                        secureTextEntry {...input} />
                    {hasError ? <Icon style={{ color: 'white' }} name='close-circle' /> : <Text />}
                </Item>
            )
        }
        return (
            <Item style={hasError ? styles.ItemError : styles.Item} error={hasError}>
                <Input style={styles.Input} placeholder=""
                    placeholderTextColor="#d0d0d0" {...input} />
                {hasError ? <Icon style={{ color: 'white' }} name='close-circle' /> : <Text />}
            </Item>
        )
    }

    saveUserDetail = async (username, password) => {
        await AsyncStorage.setItem('username', username);
        await AsyncStorage.setItem('password', password);
        const user = await AUTH_API.detail();
        const new_user = {
            ...user,
            name: user.fullName
        }
        await this.props.setUser(new_user);
        this.props.navigation.navigate('AuthLoading');
    }

    onSubmit = (values, dispatch) => {
        const { username, password } = values;
        if (username != "" && password != "") {
            AUTH_API.login(username, password).then(logged => {
                if (logged == true) {
                    this.saveUserDetail(username, password);
                } else {
                    Alert.alert(
                        'ไม่สามารถเข้าสู่ระบบได้',
                        'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!',
                        [
                            { text: 'ตกลง', onPress: () => console.log('OK Pressed'), style: 'cancel' },
                        ],
                        { cancelable: false }
                    )
                }
            }).catch(() => {
                Alert.alert(
                    'ไม่สามารถเข้าสู่ระบบได้',
                    'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!',
                    [
                        { text: 'ตกลง', onPress: () => console.log('OK Pressed'), style: 'cancel' },
                    ],
                    { cancelable: false }
                )
            });
        }
    }

    render() {
        const { handleSubmit, reset } = this.props;
        return (
            <Content style={styles.Form}>
                <Field name="username" component={this.renderInput} />
                <Field name="password" component={this.renderInput} />
                <Item style={styles.ItemNoBorder}>
                    <Text style={styles.textRight}>ลืมรหัสผ่านหรือไม่ ?</Text>
                </Item>
                <Button onPress={handleSubmit(this.onSubmit)} full style={styles.Button}>
                    <Text style={styles.ButtonText}>
                        เข้าสู่ระบบ
                    </Text>
                </Button>
            </Content>
        )
    }
}

const mapDispatchToProps = (dispatch) => {
    return {
        setUser: user => dispatch(USER.setUser(user))
    }
}

export default reduxForm({
    form: 'login',
    validate
})(connect(null, mapDispatchToProps)(LoginForm));

const styles = StyleSheet.create({
    Form: {
        width: '80%',
        marginTop: 40
    },
    Item: {
        marginLeft: 0,
        backgroundColor: '#1E78B6',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15,
        marginBottom: 15,
        borderBottomColor: '#F14E23'
    },
    ItemError: {
        marginLeft: 0,
        backgroundColor: '#F14E23',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 15,
        marginBottom: 15,
        borderBottomColor: '#F14E23'
    },
    ItemNoBorder: {
        marginLeft: 0,
        marginBottom: 60,
        borderBottomColor: '#00569B'
    },
    textRight: {
        // fontFamily: Fonts.prompt,
        width: '100%',
        textAlign: 'right',
        color: 'white'
    },
    Input: {
        fontSize: 20,
        // fontFamily: Fonts.prompt,
        color: 'white'
    },
    Button: {
        borderRadius: 10,
        backgroundColor: '#F14E23'
    },
    ButtonText: {
        fontSize: 20,
        // fontFamily: Fonts.prompt,
        color: 'white'
    }
})