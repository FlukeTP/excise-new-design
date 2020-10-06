import React, { Component } from 'react';
import { Title, Form, Item, Picker, Label, Text } from 'native-base';
import Icon from 'react-native-vector-icons/FontAwesome';
import _ from 'lodash';

// Custom Components
import { Layout, ListPlan } from '../../components/index';

// Store
import { connect } from 'react-redux';
import { NOTIFY } from '../../store/actions/index';

// APIs
import { NOTIFICATION_API } from '../../api/index';

// MockData
import { data } from './Data';

class PlanScreen extends Component {
    constructor(props) {
        super(props);
        this.state = {
            year: "2561",
            month: "10/2560"
        }
    }
    onYearChange = (value: string) => {
        this.setState({
            year: value
        });
    }
    onMonthChange = (value: string) => {
        this.setState({
            month: value
        });
    }
    render() {
        return (
            <Layout
                back
                padder
                {...this.props}
                headerBody={(
                    <Title>แผนประจำปี</Title>
                )}
                headContent={(
                    <Form>
                        <Item picker inlineLabel>
                            <Label>ปีงบประมาณ</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="เลือกปีงบประมาณ"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.year}
                                onValueChange={this.onYearChange}>
                                {years.map((obj, index) => {
                                    return <Picker.Item label={obj.label} value={obj.value} key={index} />
                                })}
                            </Picker>
                        </Item>
                        <Item picker inlineLabel>
                            <Label>เดือน</Label>
                            <Picker
                                mode="dropdown"
                                iosIcon={<Icon name="arrow-down" />}
                                style={{ width: undefined }}
                                placeholder="เลือกเดือน"
                                placeholderStyle={{ color: "#bfc6ea" }}
                                placeholderIconColor="#007aff"
                                selectedValue={this.state.month}
                                onValueChange={this.onMonthChange}>
                                {months(this.state.year).map((obj, index) => {
                                    return <Picker.Item label={obj.label} value={obj.value} key={index} />
                                })}
                            </Picker>
                        </Item>
                    </Form>
                )}>
                {lists(this.state.year, this.state.month) ?.map((obj, index) => <ListPlan index={index} navigation={this.props.navigation} item={obj} key={index} />)}
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

export default connect(mapStateToProps, mapDispatchToProps)(PlanScreen);


// Data Mock
const years = [
    { label: "2561", value: "2561" }
];
const months = year => {
    return [
        { label: `ตุลาคม ${parseInt(year) - 1}`, value: `10/${parseInt(year) - 1}` },
        { label: `พฤศจิกายน ${parseInt(year) - 1}`, value: `11/${parseInt(year) - 1}` },
        { label: `ธันวาคม ${parseInt(year) - 1}`, value: `12/${parseInt(year) - 1}` },
        { label: `มกราคม ${year}`, value: `01/${year}` },
        { label: `กุมภาพันธ์ ${year}`, value: `02/${year}` },
        { label: `มีนาคม ${year}`, value: `03/${year}` },
        { label: `เมษายน ${year}`, value: `04/${year}` },
        { label: `พฤษภาคม ${year}`, value: `05/${year}` },
        { label: `มิถุนายน ${year}`, value: `06/${year}` },
        { label: `กรกฎาคม ${year}`, value: `07/${year}` },
        { label: `สิงหาคม ${year}`, value: `08/${year}` },
        { label: `กันยายน ${year}`, value: `09/${year}` },
    ]
}

const lists = (year, month) => {
    if (year && month) {
        return _.filter(data, obj => (obj.year == year && obj.month == month));
    } else if (year) {
        return _.filter(data, obj => obj.year == year);
    } else if (month) {
        return _.filter(data, obj => obj.month == month);
    } else {
        return [];
    }
}