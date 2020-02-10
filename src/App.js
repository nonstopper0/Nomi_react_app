import React from 'react';
import {Form, Icon, Menu, Segment, Button, Modal, FormField, Grid, Dropdown} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './base.css'
import APICall from './APIcall.js'
import DisplayStocks from './DisplayStocks.js'


class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      connection: '',
    };
  }
  // addStock = (stockData) => {
  //   let stockName = stockData.match(/("symbol"):"(.*?)"/)[2]
  //     this.setState({
  //         userStocks: [...this.state.userStocks, stockData],
  //         notifications: [this.state.notifications, `Added New stock: ${stockName}`]
  //     });
  // }
  render() {
    return (
        <React.Fragment>
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item position="right" name='home'/>
            <Menu.Item name='friends'/>
          </Menu>
        </Segment>
        <APICall addStock={this.addStock}/>
        </React.Fragment>
    )
  }
  
}
export default App;
