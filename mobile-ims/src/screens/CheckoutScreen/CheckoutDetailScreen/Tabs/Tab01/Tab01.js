import React, { Component } from 'react';
import { Content, Text, Card, CardItem, Body, Form, Item, Label, Input } from 'native-base';

export default class Tab01 extends Component {
    constructor(props) {
        super(props);
    }
    render() {
        const item = {
            name: "",
            exciseId: "",
            building: "",
            roomNumber: "",
            level: ""
        }
        return (
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text style={{ color: '#00569B' }}>รายละเอียดผู้ประกอบการ</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            <Form>
                                <Item stackedLabel>
                                    <Label>ชื่อผู้ประกอบอุตสาหกรรม</Label>
                                    <Input style={{ color: '#00569B' }} value={item.name} />
                                </Item>
                                <Item stackedLabel>
                                    <Label>ทะเบียนสรรพสามิตเลขที่</Label>
                                    <Input style={{ color: '#00569B' }} value={item.exciseId} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>ชื่ออาคาร</Label>
                                    <Input style={{ color: '#00569B' }} value={item.building} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>ห้องเลขที่</Label>
                                    <Input style={{ color: '#00569B' }} value={item.roomNumber} />
                                    <Label>ชั้นที่</Label>
                                    <Input style={{ color: '#00569B' }} value={item.level} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>หมู่บ้าน</Label>
                                    <Input style={{ color: '#00569B' }} value={'-'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>เลขที่</Label>
                                    <Input style={{ color: '#00569B' }} value={item.roomNumber} />
                                    <Label>หมู่ที่</Label>
                                    <Input style={{ color: '#00569B' }} value={item.level} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>ตรอก/ซอย</Label>
                                    <Input style={{ color: '#00569B' }} value={'-'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>ถนน</Label>
                                    <Input style={{ color: '#00569B' }} value={'-'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>ตำบล/แขวง</Label>
                                    <Input style={{ color: '#00569B' }} value={'ห้วยขวาง'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>อำเภอ/เขต</Label>
                                    <Input style={{ color: '#00569B' }} value={'ห้วยขวาง'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>จังหวัด</Label>
                                    <Input style={{ color: '#00569B' }} value={'กรุงเทพมหานครฯ'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>รหัสไปรษณีย์</Label>
                                    <Input style={{ color: '#00569B' }} value={'10310'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>โทรศัพท์</Label>
                                    <Input style={{ color: '#00569B' }} value={'093-1244-3322'} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>Email</Label>
                                    <Input style={{ color: '#00569B' }} value={'sawatdeekrub@email.com'} />
                                </Item>
                            </Form>
                        </Content>
                    </CardItem>
                </Card>
            </Content>
        );
    }
}