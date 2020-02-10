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
      userStocks: [],
      notifications: ['Testing input', 'Hey buddy']
    };
  }
  addStock = (stockData) => {
    console.log(stockData.find(/symbol/))
      this.setState({
          userStocks: [...this.state.userStocks, stockData],
          notifications: [this.state.notifications, 'Added New stock']
      });
  }
  render() {
    return (
        <React.Fragment>
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item position="right" name='home'/>
            <Menu.Item name='notifications'>
              <Icon name="bell"></Icon>
              <Dropdown>
                <Dropdown.Menu >
                </Dropdown.Menu>
              </Dropdown>
            </Menu.Item>
            <Menu.Item name='friends'/>
          </Menu>
        </Segment>
        <APICall addStock={this.addStock}/>
        </React.Fragment>
    )
  }
  
}
export default App;
