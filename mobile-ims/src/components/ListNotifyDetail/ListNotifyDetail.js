import React, { Component } from 'react';
import { connect } from 'react-redux';
import { StyleSheet, TouchableHighlight } from 'react-native';
import { List, ListItem, Left, Body, Right, Text, Button, Thumbnail } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Col, Row, Grid } from 'react-native-easy-grid';
import { _Date, Digit } from '../../utils/index';

class ListNotifyDetail extends Component {
    render() {
        const { notifyDetailList } = this.props;
        let lists = notifyDetailList ?  notifyDetailList: [];
        return (
            <Grid>
                {lists.map((list, index) => {
                    const date = new Date(list.createdDate);
                    return (
                        <Row style={styles.ListItem} key={index}>
                            <Col>
                                <TouchableHighlight underlayColor="#dff1ff">
                                    <Col>
                                        <Row style={{ width: '100%' }}>
                                            <Col style={{
                                                flex: 2, justifyContent: 'flex-start',
                                                alignItems: 'center',
                                                paddingRight: 10
                                            }}>
                                                <Row>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>เงื่อนไขที่</Text>
                                                </Row>
                                                <Row>
                                                    <Text style={{ fontWeight: 'bold', fontSize: 18 }}>{index + 1}</Text>
                                                </Row>
                                            </Col>
                                            <Col style={{
                                                flex: 7, justifyContent: 'flex-start',
                                                borderLeftColor: 'black',
                                                borderLeftWidth: 1,
                                                paddingLeft: 10
                                            }}>
                                                <Row>
                                                    <Text style={{ fontWeight: '300', fontSize: 17 }}>จำนวนเดือนที่ชำระ ตั้งแต่ {list.monthMin} ถึง {list.monthMax} เดือน</Text>
                                                </Row>
                                                <Row>
                                                    <Text style={{ fontWeight: '300', fontSize: 17 }}>ช่วงร้อยละ ตั้งแต่ {list.percenTageFrom} ถึง {list.percenTageTo}</Text>
                                                </Row>
                                            </Col>
                                        </Row>
                                        <Row style={{ width: '100%', justifyContent: 'flex-end', alignItems: 'flex-end' }}>
                                            <Text style={{ fontWeight: 'bold', fontSize: 18 }}>จำนวน : <Text style={{ fontWeight: 'bold', fontSize: 18, color: '#ec5326' }}>{list.workSheetCount} ราย</Text></Text>
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
        notifyDetailList: state.notifyDetailList
    }
}

export default connect(mapStateToProps, null)(ListNotifyDetail);
const styles = StyleSheet.create({
    ListItem: {
        marginTop: 10,
        paddingTop: 5,
        paddingRight: 5,
        paddingBottom: 5,
        paddingLeft: 5,
        borderWidth: 1,
        borderColor: 'grey'
    }
});