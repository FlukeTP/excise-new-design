import React, { Component } from 'react';
import { Title, H1, Tabs, Tab, Content, ScrollableTab } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';

// Custom Components
import { Layout, ListCount, ListNotify } from '../../../components/index';

// Store
import { connect } from 'react-redux';
import { NOTIFY } from '../../../store/actions/index';

// APIs
import { NOTIFICATION_API } from '../../../api/index';

// Tabs
import { Tab01, Tab02, Tab03, Tab04, Tab05, Tab06, Tab07, Tab08 } from './Tabs';

class CheckoutDetailScreen extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        return (
            <Layout
                back
                tabs
                mainStack="Checkout"
                {...this.props}
                headerBody={(
                    <Title>รายละเอียดการออกตรวจ</Title>
                )}
                headContent={(
                    <Tabs renderTabBar={() => <ScrollableTab style={{ backgroundColor: '#00569B' }} />}>
                        <Tab heading="รายละเอียดผู้ประกอบการ"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab01 />
                            </Content>
                        </Tab>
                        <Tab heading="แบบ Solvent 01"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab02 />
                            </Content>
                        </Tab>
                        <Tab heading="ข้อมูลภาพรวม"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab03 />
                            </Content>
                        </Tab>
                        <Tab heading="การเปรียบเทียบ"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab04 />
                            </Content>
                        </Tab>
                        <Tab heading="การตรวจสอบบัญชี - งบเดือน"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab05 />
                            </Content>
                        </Tab>
                        <Tab heading="การสุ่มตรวจ (ตัวแทน)"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab06 />
                            </Content>
                        </Tab>
                        <Tab heading="กรรมวิธีในการผลิต"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab07 />
                            </Content>
                        </Tab>
                        <Tab heading="การสุ่มตรวจ (ผู้ใช้)"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Tab08 />
                            </Content>
                        </Tab>
                    </Tabs>
                )} />
        )
    }
}

const mapStateToProps = state => {
    return {
        notifyCounts: state.notifyCounts
    }
}

const mapDispatchToProps = dispatch => {
    return {
        updateNotifyDetails: (type, data) => dispatch(NOTIFY.updateNotifyDetails(type, data)),
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutDetailScreen);