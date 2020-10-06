import React, { Component } from 'react';
import { Content, Text, Card, CardItem, Body, Form, Item, Label, Input, ListItem, CheckBox, Picker, Icon } from 'native-base';

export default class Tab04 extends Component {
    constructor(props) {
        super(props);
        this.state = {
            employeeAll: '-',
            employee: '-',
            timeFrom: '-',
            timeTo: '-',
            monthRent: '-',
            typeCompany: '-',
            typeBuy: '-',
            typePayment: '-'
        }
    }
    onChange = (event, control) => {
        let obj = this.state;
        obj[control] = event;
        this.setState(obj);
    }
    render() {
        const {
            employee, employeeAll,
            timeFrom, timeTo,
            monthRent,
            typeCompany, typeBuy, typePayment
        } = this.state;
        return (
            <Content>
                <Card>
                    <CardItem header bordered>
                        <Text style={{ color: '#00569B' }}>แบบ Solvent 01</Text>
                    </CardItem>
                    <CardItem bordered>
                        <Content>
                            <Form>
                                <Item inlineLabel>
                                    <Label>จำนวนพนักงานทั้งหมด/คน: </Label>
                                    <Input style={{ color: '#00569B' }} value={employeeAll} onChange={event => { this.onChange(event, 'employeeAll') }} />
                                    <Label>พนักงานประจำ/คน: </Label>
                                    <Input style={{ color: '#00569B' }} value={employee} onChange={event => { this.onChange(event, 'employee') }} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>เวลาเริ่มปฏิบัติและสิ้นสุดงาน ตั้งแต่เวลา/น.: </Label>
                                    <Input style={{ color: '#00569B' }} value={timeFrom} onChange={event => { this.onChange(event, 'timeFrom') }} />
                                    <Label>ถึง/น. : </Label>
                                    <Input style={{ color: '#00569B' }} value={timeTo} onChange={event => { this.onChange(event, 'timeTo') }} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>เช่าเดือนละ : </Label>
                                    <Input style={{ color: '#00569B' }} value={monthRent} onChange={event => { this.onChange(event, 'monthRent') }} />
                                </Item>
                                <Item inlineLabel>
                                    <Label>ลักษณะสถานประกอบการ : </Label>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        placeholder="กรุณาเลือก"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        style={{ width: undefined }}
                                        selectedValue={typeCompany}
                                        onValueChange={event => { this.onChange(event, 'typeCompany') }}
                                    >
                                        <Picker.Item label="โรงงานผู้ผลิต" value="key0" />
                                        <Picker.Item label="นำเข้า" value="key1" />
                                    </Picker>
                                </Item>
                                <Item inlineLabel>
                                    <Label>วิธีสั่งซื้อสารละลายฯ : </Label>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        placeholder="กรุณาเลือก"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        style={{ width: undefined }}
                                        selectedValue={typeBuy}
                                        onValueChange={event => { this.onChange(event, 'typeBuy') }}
                                    >
                                        <Picker.Item label="โรงงานผู้ผลิต" value="key0" />
                                        <Picker.Item label="นำเข้า" value="key1" />
                                        <Picker.Item label="ผ่านตัวแทน" value="key2" />
                                    </Picker>
                                </Item>
                                <Item inlineLabel>
                                    <Label>วิธีการชำระเงิน : </Label>
                                    <Picker
                                        mode="dropdown"
                                        iosIcon={<Icon name="arrow-down" />}
                                        placeholder="กรุณาเลือก"
                                        placeholderStyle={{ color: "#bfc6ea" }}
                                        placeholderIconColor="#007aff"
                                        style={{ width: undefined }}
                                        selectedValue={typePayment}
                                        onValueChange={event => { this.onChange(event, 'typePayment') }}
                                    >
                                        <Picker.Item label="เงินสด" value="key0" />
                                        <Picker.Item label="เงินเชื่อ" value="key1" />
                                        <Picker.Item label="โอนเงินเข้าบัญชีธนาคารของผู้ขาย" value="key2" />
                                        <Picker.Item label="อื่น ๆ ระบุ" value="key3" />
                                    </Picker>
                                </Item>
                            </Form>
                        </Content>
                    </CardItem>
                </Card>
            </Content>
        );
    }
}