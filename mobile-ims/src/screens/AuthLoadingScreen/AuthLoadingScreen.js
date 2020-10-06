import React, { Component } from 'react';
import { Alert, AsyncStorage, Dimensions, NetInfo, ProgressBarAndroid, StatusBar, View } from 'react-native';
import { Thumbnail, Text } from 'native-base';
import { connect } from 'react-redux';
import { USER, NOTIFY } from '../../store/actions/index';
import { AUTH_API, NOTIFICATION_API } from '../../api/index';

var timeCount = 1;
const delay = 400;
const { width, height } = Dimensions.get('window');

class AuthLoadingScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            progress: 0
        }
    }

    componentDidMount() {
        StatusBar.setHidden(true, 'none');
        this.timer = setInterval(this.updateProgress, delay);
    }

    componentWillUnmount() {
        clearInterval(this.timer);
    }

    // Fetch the token from storage then navigate to our appropriate place
    _bootstrapAsync = async () => {
        // This will checking network for loading
        const connectionInfo = await NetInfo.getConnectionInfo();
        if ((connectionInfo.type == 'none' && connectionInfo.type == 'unknown')) {
            this.props.navigation.navigate('App');
        }
        const username = await AsyncStorage.getItem('username');
        const password = await AsyncStorage.getItem('password');
        if (username && password) {
            AUTH_API.login(username, password).then(logged => {
                if (logged) {
                    this.fetchDetail();
                } else {
                    Alert.alert(
                        'ไม่สามารถเข้าสู่ระบบได้',
                        'ชื่อผู้ใช้หรือรหัสผ่านไม่ถูกต้อง!',
                        [
                            { text: 'ตกลง', onPress: () => console.log('OK Pressed'), style: 'cancel' },
                        ],
                        { cancelable: false }
                    )
                    this.props.navigation.navigate('Auth');
                }
            });
        } else {
            this.props.navigation.navigate('Auth');
        }
    };

    updateProgress = () => {
        const { progress } = this.state;
        if (progress === 1) {
            clearInterval(this.timer);
            setTimeout(this.onLoaded, delay);
        } else {
            const randProgress = progress + (Math.random() * 0.5);
            this.setState({ progress: randProgress > 1 ? 1 : randProgress });
        }
    };

    fetchDetail = async () => {
        const user = await AUTH_API.detail();
        const notify_counts = await NOTIFICATION_API.count();
        let updateCount = {
            index: 0,
            routeName: 'Filter',
            title: `ข้อมูลการคัดกรอง`,
            icon: 'tags',
            countType: notify_counts ?.find(obj => obj.type === "PROCESS_PLAN_COMPLETED").countType || 0
        };
        this.props.setUser({
            ...user,
            name: user.fullName
        });
        this.props.updateNotifyCounts("PROCESS_PLAN_COMPLETED", updateCount);
        this.props.navigation.navigate('App');
        // setInterval(async () => {
        //     const { notifyCounts } = this.props;
        //     const notify_counts = await NOTIFICATION_API.count();
        //     let updateCount = {
        //         index: 0,
        //         routeName: 'Filter',
        //         title: `ข้อมูลการคัดกรอง`,
        //         icon: 'tags',
        //         countType: notify_counts?.find(obj => obj.type === "PROCESS_PLAN_COMPLETED").countType || 0
        //     };
        //     this.props.updateNotifyCounts("PROCESS_PLAN_COMPLETED", updateCount);
        // }, 5000);
    }

    onLoaded = () => {
        this._bootstrapAsync();
    }

    // Render any loading content that you like here
    render() {
        const uri = require("../../assets/images/logo.png");
        return (
            <View style={{
                flex: 1,
                // width, height,
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#00569B'
            }}>
                <Thumbnail resizeMode={'contain'} style={{
                    width: width - 100,
                    height: 150,
                    position: 'absolute', top: 100
                }} source={uri} />
                <Text style={{
                    fontSize: 28,
                    marginTop: -36,
                    color: 'white',
                    textAlign: 'center',
                    width: '100%'
                }}>ระบบปฎิบัติการ</Text>
                <ProgressBarAndroid
                    style={{ width: width - 150, position: 'absolute', bottom: 50 }}
                    styleAttr="Horizontal"
                    indeterminate={this.state.progress == 1}
                    progress={this.state.progress}
                />
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        notifyCounts: state.notifyCounts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        setUser: user => dispatch(USER.setUser(user)),
        setNotifyCounts: (typeNotify, notify) => dispatch(NOTIFY.setNotifyCounts(typeNotify, notify)),
        updateNotifyCounts: (typeNotify, notify) => dispatch(NOTIFY.updateNotifyCounts(typeNotify, notify)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(AuthLoadingScreen); 