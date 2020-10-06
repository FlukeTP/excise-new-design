import React, { Component } from 'react';
import { Title, Toast } from 'native-base';
import { View, Text } from 'react-native';

// Custom Components
import { Layout, ListCount } from '../../components/index';

// Store
import { connect } from 'react-redux';
import { NOTIFY } from '../../store/actions/index';

// APIs
import { NOTIFICATION_API } from '../../api/index';

class HomeScreen extends Component {
    constructor(props) {
        super(props);
    }
    async componentDidUpdate(prevProps) {
        const prevCount = prevProps.notifyCounts["PROCESS_PLAN_COMPLETED"].countType;
        const currCount = this.props.notifyCounts["PROCESS_PLAN_COMPLETED"].countType;
        if (prevCount < currCount) {
            Toast.show({
                text: "คุณมีการแจ้งเตือนใหม่!",
                buttonText: "ตกลง",
                position: "top",
                duration: 2500
            });
            const type = 'PROCESS_PLAN_COMPLETED';
            const notify = await NOTIFICATION_API.simple(type);
            this.props.updateNotifyDetails(type, notify);
        }
    }
    render() {
        return (
            <Layout
                {...this.props}
                headerBody={(
                    <Title>การแจ้งเตือน</Title>
                )}>
                <ListCount navigation={this.props.navigation} />
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
        updateNotifyDetails: (type, data) => dispatch(NOTIFY.updateNotifyDetails(type, data))
    }
}

export default connect(mapStateToProps, mapDispatchToProps)(HomeScreen);