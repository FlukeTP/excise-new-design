import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Title, Form, Item, Picker, Label, Text, View } from 'native-base';
import { Container, Header, Content, Tab, Tabs, ScrollableTab } from 'native-base';
import _ from 'lodash';

import Details from './Tabs/Details';
import Documents from './Tabs/Documents';
import Addons from './Tabs/Addons';
import { Layout } from '../../../components';

// Mock Data
import { data } from '../Data';

class PlanDetailScreen extends Component {
    render() {
        const exciseId = this.props.navigation.getParam('exciseId');
        const item = _.find(data, obj => obj.exciseId === exciseId);
        console.log(item);
        return (
            <Layout
                back
                tabs
                mainStack="Plan"
                {...this.props}
                headerBody={(
                    <Title>รายละเอียดผู้ประกอบการ</Title>
                )}
                headContent={(
                    <Tabs>
                        {/* <Tabs renderTabBar={() => <ScrollableTab style={{ backgroundColor: '#00569B' }} />}> */}
                        <Tab heading="รายละเอียดผู้ประกอบการ"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Details item={item} />
                            </Content>
                        </Tab>
                        <Tab heading="ตรวจเอกสารใบคำขอ"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Content padder>
                                <Documents />
                            </Content>
                        </Tab>
                        <Tab heading="รูป/สถานที่/ไฟล์"
                            tabStyle={{ backgroundColor: '#00569B' }}
                            textStyle={{ color: '#fff' }}
                            activeTabStyle={{ backgroundColor: '#00569B' }}
                            activeTextStyle={{ color: '#fff', fontWeight: 'normal' }}>
                            <Addons />
                        </Tab>
                    </Tabs>
                )} />
        );
    }
}

export default connect()(PlanDetailScreen);