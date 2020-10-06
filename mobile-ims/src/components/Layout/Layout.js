import React, { PureComponent } from 'react';
import { StatusBar } from 'react-native';
import { Container, Button, Badge, Text, Content } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { NavigationActions, StackActions } from 'react-navigation';

// Store
import { connect } from 'react-redux';
import { NOTIFICATION } from '../../store/actions/index';

// Custom Components
import HeaderBar from '../HeaderBar/HeaderBar';

class Layout extends PureComponent {
    constructor(props) {
        super(props);
        StatusBar.setHidden(true, 'none');
    }
    render() {
        const {
            mainStack = "",
            headContent, footContent,
            notifyCounts, // Reducer State
            navigation, back = false, children, padder = false, tabs = false,
            /*headerLeft,*/ headerBody/*, headerRight*/
        } = this.props;
        const count = notifyCounts["PROCESS_PLAN_COMPLETED"] ?.countType || 0;
        const resetTo = (routeName) => {
            if (mainStack != "") {
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({ routeName: mainStack })
                    ]
                });
                navigation.dispatch(resetAction);
            }
            const goHome = NavigationActions.navigate({
                routeName: routeName,
                params: {}
            });
            navigation.dispatch(goHome);
        }
        const notifyCount = () => {
            if (count && count > 0) {
                return (
                    <Badge style={{ zIndex: 99, marginRight: -20, marginTop: -10 }}>
                        <Text>{count || 0}</Text>
                    </Badge>
                );
            } else {
                return (<Text></Text>);
            }
        }
        const headerLeft = () => {
            if (back == true) {
                return (
                    <Button onPress={() => navigation.goBack(null)} transparent>
                        <Icon size={24} color="white" name="chevron-left" />
                    </Button>
                );
            } else {
                return (
                    <Button onPress={() => navigation.openDrawer()} transparent>
                        <Icon size={24} color="white" name="bars" />
                    </Button>
                );
            }
        }
        const headerRight = () => {
            return (
                <Button onPress={() => resetTo('Home')} badge={count} vertical={count} transparent>
                    {notifyCount()}
                    <Icon size={24} style={{ color: 'white' }} name='bell' />
                </Button>
            );
        }
        return (
            <Container>
                <HeaderBar
                    left={headerLeft()}
                    body={headerBody}
                    right={headerRight()}
                />
                {headContent}
                {tabs == false && <Content padder={padder}>{children}</Content>}
                {footContent}
            </Container>
        );
    }
}

const mapStateToProps = (state, ownProps) => {
    return {
        user: state.user,
        notifyCounts: state.notifyCounts
    }
}

export default connect(mapStateToProps)(Layout);