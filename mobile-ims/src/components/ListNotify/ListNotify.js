import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { List, ListItem, Left, Body, Right, Text, Button, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { _Date, Digit } from '../../utils/index';

class ListNotify extends Component {
    linkTo = (index, list, lists, routeName, navigation) => {
        navigation.navigate(routeName, {
            index: index, id: list.id, ref: list.referenceId, lists: lists
        })
    }
    render() {
        const { notifyDetails, keyName, routeName = '', navigation } = this.props;
        let lists = [];
        for (let key in notifyDetails) {
            if (keyName === key) {
                lists = notifyDetails[key];
            }
        }
        return (
            <Grid>
                {lists.map((list, index) => {
                    const date = new Date(list.createdDate);
                    return (
                        <Row  style={list.viewStatus === 'Y' ? styles.ListItemActive : styles.ListItem} key={index}>
                            <Col>
                                <TouchableHighlight underlayColor="#dff1ff">
                                    <Col onPress={() => this.linkTo(index, list, lists, routeName, navigation)}>
                                        <Row>
                                            <Col style={styles.Date}>
                                                <Text style={list.viewStatus === 'Y' ? styles.DateTextActive : styles.DateText}>
                                                    {`${date.getDay()} ${_Date.DATE.MONTH[date.getMonth()]} ${_Date.EnYearToThYear(date.getFullYear().toString()).substring(2, 4)}`}
                                                </Text>
                                            </Col>
                                            <Col style={styles.Time}>
                                                <Text style={list.viewStatus === 'Y' ? styles.TimeTextActive : styles.TimeText}>
                                                    {`${Digit.digit(date.getHours())}:${Digit.digit(date.getMinutes())} น.`}
                                                </Text>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={styles.Icon}>
                                                <Icon style={list.viewStatus === 'Y' ? styles.IconTextActive : styles.IconText} name='tag' />
                                            </Col>
                                            <Col style={list.viewStatus === 'Y' ? styles.NumberActive : styles.Number}>
                                                <Text style={list.viewStatus === 'Y' ? styles.NumberTextTopActive : styles.NumberTextTop}>หมายเลขคัดกรอง</Text>
                                                <Text style={list.viewStatus === 'Y' ? styles.NumberTextBottomActive : styles.NumberTextBottom}>{list.referenceId}</Text>
                                            </Col>
                                        </Row>
                                        <Row>
                                            <Col style={styles.Created}>
                                                <Text style={list.viewStatus === 'Y' ? styles.CreatedTextActive : styles.CreatedText}>ผู้คัดกรอง: {list.createdBy}</Text>
                                            </Col>
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
        notifyDetails: state.notifyDetails
    }
}

export default connect(mapStateToProps, null)(ListNotify);
const paddingBadge = 6;
const styles = StyleSheet.create({
    ListItem: {
        padding: 5,
        borderColor: '#00569B',
        borderWidth: 1,
        marginBottom: 10
    },
    Date: { flex: 1, alignItems: 'flex-start' },
    Time: { flex: 1, alignItems: 'flex-end' },
    Icon: { flex: 1, alignItems: 'center', justifyContent: 'center' },
    Number: {
        flex: 7,
        alignItems: 'flex-start',
        borderLeftColor: '#00569B',
        borderLeftWidth: 1,
        paddingLeft: 10
    },
    Created: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
    DateText: { fontSize: 17, color: '#00569B' },
    TimeText: { fontSize: 16, color: '#00569B' },
    IconText: { fontSize: 36, color: '#00569B' },
    NumberTextTop: { fontSize: 17, color: '#00569B' },
    NumberTextBottom: { fontSize: 20, color: '#ec5326' },
    CreatedText: { fontSize: 17, color: '#00569B' },

    // Active
    ListItemActive: {
        padding: 5,
        borderColor: 'darkgrey',
        borderWidth: 1,
        marginBottom: 10
    },
    NumberActive: {
        flex: 7,
        alignItems: 'flex-start',
        borderLeftColor: '#363636',
        borderLeftWidth: 1,
        paddingLeft: 10
    },
    CreatedTextActive: { fontSize: 17, color: '#363636' },
    CreatedActive: { flex: 1, alignItems: 'flex-end', justifyContent: 'center' },
    DateTextActive: { fontSize: 17, color: '#363636' },
    TimeTextActive: { fontSize: 16, color: '#363636' },
    IconTextActive: { fontSize: 36, color: '#363636' },
    NumberTextTopActive: { fontSize: 17, color: '#363636' },
    NumberTextBottomActive: { fontSize: 20, color: '#363636' },
    CreatedTextActive: { fontSize: 17, color: '#363636' }
});