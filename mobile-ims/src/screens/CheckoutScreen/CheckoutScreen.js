import React, { Component } from 'react';
import { Title, H1 } from 'native-base';
import { View, Text, StyleSheet } from 'react-native';

// Custom Components
import { Layout, ListCount, ListNotify } from '../../components/index';

// Store
import { connect } from 'react-redux';
import { NOTIFY } from '../../store/actions/index';

// APIs
import { NOTIFICATION_API } from '../../api/index';

class CheckoutScreen extends Component {
    constructor(props) {
        super(props);
    }
    componentWillMount() {
        const dataMock = [
            {
                createdBy: "admin",
                createdDate: "2018-12-25T02:55:00",
                detailMessage: "สร้างหมายเลขออกตรวจ : 25611225-01-04853",
                id: 106,
                isDeleted: "N",
                referenceId: "25611225-01-04853",
                status: "N",
                subject: "ข้อมูลการออกตรวจ",
                type: "PROCESS_CHECKOUT",
                updatedBy: null,
                updatedDate: null,
                version: 1,
                viewDate: "2019-01-24T12:00:47",
                viewStatus: "Y"
            }
        ];
        this.props.updateNotifyDetails("PROCESS_CHECKOUT", dataMock);
    }
    render() {
        return (
            <Layout
                back
                padder
                {...this.props}
                headerBody={(
                    <Title>ออกตรวจ</Title>
                )}
                headContent={(
                    <View style={styles.headContent}>
                        <H1 style={styles.headText}>รายการล่าสุด</H1>
                    </View>
                )}>
                <ListNotify routeName="CheckoutDetail" navigation={this.props.navigation} keyName='PROCESS_CHECKOUT' />
            </Layout>
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

export default connect(mapStateToProps, mapDispatchToProps)(CheckoutScreen);

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