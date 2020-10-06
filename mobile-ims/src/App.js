import React, { Component } from 'react';
import { Root } from 'native-base';
import AppNav from './configs/routes';

export default class App extends Component {
  render() {
    return (
      <Root>
        <AppNav />
      </Root>
    );
  }
}