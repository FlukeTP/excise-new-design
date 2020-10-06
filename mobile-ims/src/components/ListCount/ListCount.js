import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { List, ListItem, Left, Body, Right, Text, Button, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from 'react-native-easy-grid';

class ListCount extends Component {
    renderRight = countType => {
        if (countType && countType > 0) {
            return (
                <Col style={{ flex: 2, justifyContent: 'center', alignItems: 'center' }}>
                    <Text style={styles.NotifyBadge}>{countType}</Text>
                </Col>
            )
        }
    }
    render() {
        const { notifyCounts } = this.props;
        let lists = [];
        for (let key in notifyCounts) {
            lists.push(notifyCounts[key]);
        }
        return (
            <Grid>
                {lists.map((list, index) => {
                    return (
                        <Row style={styles.ListItem} key={index}>
                            <Col>
                                <TouchableHighlight underlayColor="#dff1ff">
                                    <Col>
                                        <Row  onPress={() => this.props.navigation.navigate(list.routeName)} thumbnail>
                                            <Col style={{ flex: 2, justifyContent: 'flex-start', alignItems: 'center' }}>
                                                <Icon size={30} style={{ color: '#00569B' }} name={list.icon} />
                                            </Col>
                                            <Col style={{ flex: list.countType && list.countType > 0 ? 9 : 10, justifyContent: 'center' }}>
                                                <Text style={styles.Text}>{list.title}</Text>
                                            </Col>
                                            {this.renderRight(list.countType)}
                                        </Row>
                                    </Col>
                                </TouchableHighlight>
                            </Col>
                        </Row>
                    )
                })}
            </Grid>
        )
    }
}

const mapStateToProps = state => {
    return {
        notifyCounts: state.notifyCounts
    }
}

export default connect(mapStateToProps, null)(ListCount);
const paddingBadge = 6;
const styles = StyleSheet.create({
    ListItem: {
        paddingTop: 17,
        paddingBottom: 17,
        borderBottomColor: '#9db7cd',
        borderBottomWidth: 1
    },
    Text: {
        color: '#00569B',
        fontSize: 22
    },
    NotifyBadge: {
        backgroundColor: 'red',
        color: 'white',
        fontSize: 16,
        paddingTop: paddingBadge,
        paddingRight: paddingBadge * 2,
        paddingBottom: paddingBadge,
        paddingLeft: paddingBadge * 2,
        borderRadius: paddingBadge * 3,
        textAlign: 'center'
    }
});