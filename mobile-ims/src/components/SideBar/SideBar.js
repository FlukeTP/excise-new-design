import React, { Component } from "react";
import { Alert, AsyncStorage, ImageBackground, StatusBar, StyleSheet } from "react-native";
import { Container, Content, Text, ListItem, Left, Button, Body, Thumbnail } from "native-base";
import { connect } from 'react-redux';
import Icon from 'react-native-vector-icons/FontAwesome';

import { APP_NAME } from '../../configs/constant';
import { AUTH_API } from '../../api/index';

// const routes = ["Home", "Chat", "Profile"];

class SideBar extends Component {
    constructor(props) {
        super(props);
        StatusBar.setHidden(true, 'none');
    }

    clearStorageAndRedirect = async () => {
        await AsyncStorage.clear();
        this.props.navigation.navigate('Auth');
    }

    logout = () => {
        Alert.alert(
            'คำเตือน',
            'ต้องการออกจากระบบหรือไม่ ?',
            [
                {
                    text: 'ตกลง', onPress: () => {
                        AUTH_API.logout().then(success => {
                            if (success) {
                                this.clearStorageAndRedirect();
                            }
                        });
                    }
                },
                { text: 'ยกเลิก', onPress: () => console.log('ยกเลิกแล้ว'), style: 'cancel' },
            ],
            { cancelable: false }
        )
    }

    render() {
        const uri = require("../../assets/images/bg_new.jpg");
        const avatar = require("../../assets/images/avatar.png");
        const { user } = this.props;
        return (
            <Container>
                <Content>
                    <Text style={styles.Title}>{APP_NAME}</Text>
                    <ImageBackground
                        // source={uri}
                        style={styles.Header}>
                        <Thumbnail style={styles.Avatar} source={avatar} />
                        <Text style={styles.UserName}>{user.name}</Text>
                        {/* สิทธิศักดิ์ นามสมมุติ */}
                        <Text style={styles.UserPosition}>ตำแหน่ง {user.position}</Text>
                        {/* เจ้าหน้าที่ฝ่ายตรวจสอบอื่นๆ */}
                    </ImageBackground>
                    <ListItem
                        con
                        button
                        onPress={() => this.logout()}>
                        <Left style={{ flex: 1 }}>
                            <Icon size={28} style={{ color: '#00569B' }} name="sign-out" />
                        </Left>
                        <Body style={{ flex: 5 }}>
                            <Text onPress={() => this.logout()} style={{ color: '#00569B', fontSize: 20 }}>ออกจากระบบ</Text>
                        </Body>
                    </ListItem>
                    {/* <List
                        dataArray={routes}
                        renderRow={data => {
                            return (
                                <ListItem
                                    button
                                    onPress={() => this.props.navigation.navigate(data)}>
                                    <Text>{data}</Text>
                                </ListItem>
                            );
                        }}
                    /> */}
                </Content>
            </Container>
        );
    }
}

const mapStateToProps = state => {
    return {
        user: state.user
    }
}

export default connect(mapStateToProps)(SideBar);

const styles = StyleSheet.create({
    Avatar: {
        backgroundColor: '#00569B',
        marginTop: 5,
        marginBottom: 10,
    },
    Header: {
        height: 160,
        alignSelf: "stretch",
        justifyContent: "flex-end",
        alignItems: "flex-start",
        paddingLeft: 15,
        paddingRight: 15
    },
    Title: {
        fontSize: 25,
        padding: 12,
        textAlign: 'center',
        backgroundColor: '#00569B',
        color: 'white',
        width: '100%',
    },
    UserName: {
        fontSize: 20,
        paddingBottom: 10,
        fontWeight: 'bold',
        color: '#00569B',
        width: '100%',
    },
    UserPosition: {
        fontSize: 15,
        paddingBottom: 15,
        borderBottomWidth: 2,
        borderBottomColor: '#00569B',
        color: '#00569B',
        width: '100%',
    }
});