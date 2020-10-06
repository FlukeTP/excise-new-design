import React, { Component } from 'react';
import { Title } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';

// Custom Components
import { Layout, ListNotifyDetail } from '../../../components/index';

// Store
import { connect } from 'react-redux';
import { NOTIFY } from '../../../store/actions/index';
import { NOTIFICATION_API } from '../../../api/index';

// Utils
import { _Date, Digit } from '../../../utils';

class FilterDetailScreen extends Component {

    constructor(props) {
        super(props);
        this.state = {
            notifyDetail: null,
            profileDetail: null
        }
        const type = 'PROCESS_PLAN_COMPLETED';
        this.props.setNotifyDetailList([]);
        this.fetchNotifyDetail(type);
    }

    fetchNotifyDetail = async (type) => {
        const id = this.props.navigation.getParam('id');
        const ref = this.props.navigation.getParam('ref');
        const index = this.props.navigation.getParam('index');
        const notifyDetail = await NOTIFICATION_API.detailById(ref);
        const notifyDetailList = await NOTIFICATION_API.detail(id, ref);
        const notify_counts = await NOTIFICATION_API.count();
        let lists = this.props.navigation.getParam('lists');
        lists[index].viewStatus = 'Y';
        let updateCount = {
            index: 0,
            routeName: 'Filter',
            title: `ข้อมูลการคัดกรอง`,
            icon: 'tags',
            countType: notify_counts ?.find(obj => obj.type === type).countType || 0
        };
        this.props.updateNotifyCounts(type, updateCount);
        this.props.setNotifyDetailList(notifyDetailList);
        this.props.updateNotifyDetails(type, lists);
        this.setState({
            notifyDetail: notifyDetail,
            profileDetail: lists[index]
        });
    }

    render() {
        const { notifyDetail, profileDetail } = this.state;
        const date = notifyDetail ? new Date(notifyDetail.createdDate) :  new Date();
        const dateFrom = notifyDetail ? new Date(parseInt(notifyDetail.monthFrom.split('/')[1]), parseInt(notifyDetail.monthFrom.split('/')[0]), 1) : new Date();
        const dateTo = notifyDetail ? new Date(parseInt(notifyDetail.monthTo.split('/')[1]), parseInt(notifyDetail.monthTo.split('/')[0]), 1) : new Date();
        return (
            <Layout
                back
                padder
                mainStack="Filter"
                {...this.props}
                headerBody={(
                    <Title>ข้อมูลการคัดกรอง</Title>
                )}
                headContent={(
                    <View>
                        <View style={styles.headContent}>
                            <Text style={styles.headText}>หมายเลขคัดกรอง : <Text style={styles.ValueTextColor}>{notifyDetail ?.analysNumber || 'กำลังโหลด...'}</Text></Text>
                        </View>
                        <View style={styles.headContent2nd}>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-start' }}>
                                <Text style={styles.ValueText}>
                                    คัดกรองเมื่อ วันที่ {`${date.getDay()} ${_Date.DATE.MONTH[date.getMonth()] || '-'} ${_Date.EnYearToThYear(date.getFullYear().toString()).substring(2, 4) || '-'}`}
                                </Text>
                            </View>
                            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'flex-end' }}>
                                <Text style={styles.ValueText}>
                                    {notifyDetail ? `เวลา ${Digit.digit(date.getHours())}:${Digit.digit(date.getMinutes())} น.` : 'เวลา --:-- น.'}
                                </Text>
                            </View>
                            <View style={{ marginTop: 10, width: '100%', justifyContent: 'center' }}>
                                <Text style={styles.LabelText}>ผู้คัดกรอง : <Text style={styles.ValueText}>{notifyDetail ?.createdBy || 'กำลังโหลด...'}</Text></Text>
                                <Text style={styles.LabelText}>ตำแหน่ง : <Text style={styles.ValueText}>{notifyDetail ?.position || 'กำลังโหลด...'}</Text></Text>
                                <Text style={styles.LabelText}>ฝ่ายจัดการ : <Text style={styles.ValueText}>{notifyDetail ?.groupName || 'กำลังโหลด...'}</Text></Text>
                            </View>
                        </View>
                        <View style={styles.headContentLast}>
                            <Text style={styles.LabelText}>
                                ช่วงข้อมูล : ตั้งแต่
                                <Text style={styles.ValueTextColor}>
                                    &nbsp;&nbsp;
                                    {`${_Date.DATE.MONTH[dateFrom.getMonth()] || '-'} ${dateFrom.getFullYear().toString().substring(2, 4) || '-'}`}
                                    &nbsp;&nbsp;
                                </Text>
                                ถึง
                                 <Text style={styles.ValueTextColor}>
                                    &nbsp;&nbsp;
                                    {`${_Date.DATE.MONTH[dateTo.getMonth()] || '-'} ${dateTo.getFullYear().toString().substring(2, 4) || '-'}`}
                                    &nbsp;&nbsp;
                                </Text>
                            </Text>
                        </ View>
                    </ View>
                )
                }>
                <ListNotifyDetail />
            </Layout >
        )
    }
}

const mapStateToProps = state => {
    return {
        notifyDetails: state.notifyDetails
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateNotifyCounts: (type, data) => dispatch(NOTIFY.updateNotifyCounts(type, data)),
        updateNotifyDetails: (type, data) => dispatch(NOTIFY.updateNotifyDetails(type, data)),
        setNotifyDetailList: (data) => dispatch(NOTIFY.setNotifyDetailList(data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterDetailScreen);

const styles = StyleSheet.create({
    headContent: {
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        width: '100%',
        borderBottomWidth: 3,
        borderBottomColor: '#00569B'
    },
    headContent2nd: {
        paddingTop: 15,
        paddingRight: 10,
        paddingBottom: 10,
        paddingLeft: 10,
        width: '100%',
        borderBottomWidth: 3,
        borderBottomColor: '#00569B'
    },
    headContentLast: {
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        width: '100%'
    },
    headText: {
        color: '#00569B',
        fontSize: 20,
        fontWeight: 'bold'
    },
    LabelText: {
        fontSize: 19,
        fontWeight: 'bold',
        color: '#00569B'
    },
    ValueText: {
        fontSize: 18,
        fontWeight: '300',
        color: '#00569B'
    },
    ValueTextColor: {
        fontSize: 18,
        fontWeight: '300',
        color: '#ec5326'
    }
});