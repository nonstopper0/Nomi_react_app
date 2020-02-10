import React from 'react';
import {Form, Header, Icon, Menu, Segment, Button, Modal, FormField, Grid, Dropdown} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './base.css'
import AddStock from './AddStock.js'
import DisplayStocks from './DisplayStocks.js'
import LogRegister from './LogRegister'
require('dotenv')


class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      logged: false,
      loggedID: 0, 
      notification: []
    };
  }
  // addStock = async(stockData) => {
  //   let stockName = stockData.match(/("symbol"):"(.*?)"/)[2]
  //     this.setState({
  //         notification: [`Added New stock: ${stockName}`]
  //     });
  // }
  login = (id) => {
    this.setState({
      logged: true,
      loggedID: id
    })
    console.log(this.state)
  }
  render() {
    return (
        <React.Fragment>
          { this.state.logged ?
          <div>
        <Segment inverted>
          <Menu inverted pointing secondary>
            <Menu.Item position="right" name='home'/>
            <Menu.Item name='friends'/>
          </Menu>
        </Segment>
        <Header>{this.state.notification}</Header>
        <AddStock loggedID={this.state.loggedID} />
        </div>
        :
        <LogRegister login={this.login}/> 
        }
        </React.Fragment>
    )
  }
  
}
export default App;
