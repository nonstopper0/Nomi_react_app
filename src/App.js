import React from 'react';
import { Header, Menu, Segment, Grid, Card} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './base.css'
import DisplayStocks from './DisplayStocks.js'
import LogRegister from './LogRegister'
import DisplayUserStocks from './DisplayUserStocks'
require('dotenv')


class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      logged: true,
      loggedID: 0, 
      money: 0,
      notification: [],
      formattedData: [],
      loadeddata: false
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
    const style= {
      'background-color': 'rgb(48, 48, 48)'
    }
    return (
        <React.Fragment>
        { this.state.logged ?
        <div>
          <Segment inverted>
            <Menu inverted pointing secondary style={{'fontSize': '15px'}}>
              <Menu.Item position="right" name={this.state.money.toString()}/>
              <Menu.Item name="Logout" onClick = {this.logout}></Menu.Item>
            </Menu>
          </Segment>
          <Grid textAlign="center">
            { this.state.logged ? 
            <Segment style={style}>
              <DisplayStocks loggedID={this.state.loggedID}/>
            </Segment>
            :
            null }
          </Grid>
        </div>
        :
        <LogRegister login={this.login}/> 
        }
        </React.Fragment>
    )
  }
  
}
export default App;
