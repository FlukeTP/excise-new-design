import React, { Component } from 'react';
import {
    Header, Left, Body, Right
} from 'native-base';

class HeaderBar extends Component {
    render() {
        const { left, body, right } = this.props;
        return (
            <Header style={{ backgroundColor: '#00569B' }}>
                <Left style={{ flex: 1 }}>
                    {left}
                </Left>
                <Body style={{ flex: 6, alignItems: 'center' }}>
                    {body}
                </Body>
                <Right style={{ flex: 1 }}>
                    {right}
                </Right>
            </Header>
        )
    }
}

export default HeaderBar;