import React, { Component } from 'react';
import { Content, Text, Card, CardItem, Body, List, ListItem, Item, Left, Right, Button } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';

class Documents extends Component {
    render() {
        return (
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text style={{ color: '#00569B' }}>ตรวจเอกสารใบคำขอ</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            <List>
                                <ListItem thumbnail>
                                    <Left>
                                        <Icon name="check-circle" size={28} />
                                    </Left>
                                    <Body>
                                        <Text>ตรวจสอบ ใบอนุญาติ สค.01,02</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent>
                                            <Text>ดู</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                                <ListItem thumbnail>
                                    <Left>
                                        <Icon name="check-circle" size={28} />
                                    </Left>
                                    <Body>
                                        <Text>ตรวจสอบ ใบกำกับการขนส่ง</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent>
                                            <Text>ดู</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                                <ListItem thumbnail>
                                    <Left>
                                        <Icon name="check-circle" size={28} />
                                    </Left>
                                    <Body>
                                        <Text>ตรวจสอบ บัญชีประจำวัน แสดงรายรับ - รายจ่าย</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent>
                                            <Text>ดู</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                                <ListItem thumbnail>
                                    <Left>
                                        <Icon name="check-circle" size={28} />
                                    </Left>
                                    <Body>
                                        <Text>ตรวจสอบ งบเดือน แสดงรายรับ - รายจ่าย</Text>
                                    </Body>
                                    <Right>
                                        <Button transparent>
                                            <Text>ดู</Text>
                                        </Button>
                                    </Right>
                                </ListItem>
                            </List>
                        </Content>
                    </CardItem>
                </Card>
            </Content>
        )
    }
}

export default Documents;