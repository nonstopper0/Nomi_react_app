import React from 'react';
import { Header, Menu, Segment} from 'semantic-ui-react'
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
      logged: true,
      loggedID: 0, 
      money: 0,
      notification: []
    };
  }
  // addStock = async(stockData) => {
  //   let stockName = stockData.match(/("symbol"):"(.*?)"/)[2]
  //     this.setState({
  //         notification: [`Added New stock: ${stockName}`]
  //     });
  // }
  login = (id, money) => {
    this.setState({
      logged: true,
      loggedID: id,
      money: money
    })
    console.log(this.state)
  }
  logout = async(e) => {
      const response = await fetch(`${process.env.REACT_APP_API_URL}/logout`, {
        method: 'GET'
    })
    const parsedResponse = await response.json()
    if (parsedResponse.status === 200) {
      this.setState({
        loggedID: 0,
        logged: false
      })
    }
  }
  render() {
    return (
        <React.Fragment>
        { this.state.logged ?
        <div>
          <Segment inverted>
            <Menu inverted pointing secondary>
              <Menu.Item color="green" name={this.state.money.toString()}/>
              <Menu.Item position="right" name="friends"/>
              <AddStock loggedID={this.state.loggedID} />
              <Menu.Item name="Logout" onClick = {this.logout}></Menu.Item>
            </Menu>
          </Segment>
          <Header>{this.state.notification}</Header>
          <DisplayStocks loggedID={this.state.loggedID}/>
        </div>
        :
        <LogRegister login={this.login}/> 
        }
        </React.Fragment>
    )
  }
  
}
export default App;
