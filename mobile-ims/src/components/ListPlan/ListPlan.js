import React, { Component } from 'react';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { Card, CardItem, Body, Text, Icon, Right } from 'native-base';
export default class ListPlan extends Component {

    redirectTo = () => {
        const { item, navigation } = this.props;
        navigation.navigate('PlanDetail', { exciseId: item.exciseId });
    }

    render() {
        const { item, index } = this.props;
        return (
            <TouchableHighlight onPress={() => this.redirectTo()} underlayColor="#dff1ff">
                <Card>
                    <CardItem>
                        <Body style={{ flex: 9 }}>
                            <Text numberOfLines={1} style={{ flex: 1, textAlign: "left" }}>{item.exciseId}</Text>
                            <Text numberOfLines={1} style={{ flex: 1, textAlign: "left" }}>{item.name}</Text>
                        </Body>
                        <Right style={{ flex: 1 }}>
                            <Icon name="arrow-forward" />
                        </Right>
                    </CardItem>
                </Card>
            </TouchableHighlight>
        );
    }
}