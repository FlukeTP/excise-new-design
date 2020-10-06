import React, { Component } from 'react';
import { Title, H1 } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';

// Custom Components
import { Layout, ListNotify } from '../../components/index';

// Store
import { connect } from 'react-redux';
import { NOTIFY } from '../../store/actions/index';
import { NOTIFICATION_API } from '../../api/index';

class FilterScreen extends Component {
    constructor(props) {
        super(props);
        this.fetchNotify();
    }

    fetchNotify = async () => {
        const type = 'PROCESS_PLAN_COMPLETED';
        const notify = await NOTIFICATION_API.simple(type);
        this.props.updateNotifyDetails(type, notify);
    }

    render() {
        return (
            <Layout
                back
                padder
                {...this.props}
                headerBody={(
                    <Title>ข้อมูลการคัดกรอง</Title>
                )}
                headContent={(
                    <View style={styles.headContent}>
                        <H1 style={styles.headText}>รายการล่าสุด</H1>
                    </View>
                )}>
                <ListNotify routeName="FilterDetail" navigation={this.props.navigation} keyName='PROCESS_PLAN_COMPLETED' />
            </Layout>
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
        updateNotifyCounts: (type, updateCount) => dispatch(NOTIFY.updateNotifyCounts(type, updateCount)),
        updateNotifyDetails: (type, data) => dispatch(NOTIFY.updateNotifyDetails(type, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(FilterScreen);

const styles = StyleSheet.create({
    headContent: {
        paddingTop: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingLeft: 10,
        width: '100%',
        alignItems: 'flex-end',
        borderBottomWidth: 3,
        borderBottomColor: '#00569B'
    },
    headText: {
        color: '#00569B'
    }
});