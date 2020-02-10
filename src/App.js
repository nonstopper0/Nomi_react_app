import React from 'react';
import {Form, FormInput, Segment, Button, Modal, FormField, Grid, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './base.css'
import APICall from './APIcall.js'
import DisplayStocks from './DisplayStocks.js'


class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      connection: '',
      userStocks: []
    };
  }
  getUserStocks = () => {
    const stocks = APICall.stockAPIcall("AAPL")
    console.log(stocks)
  }
  getPresetStocks = () => {

  }
  addStock = (stockData) => {
      this.setState=({
          userStocks: [...stockData]
      })
  }
  render() {
    return (
      <React.Fragment>
      <Header>
        Yes
      </Header>
      <APICall addStock={this.addStock}/>
      </React.Fragment>
    )
  }
  
}
export default App;
