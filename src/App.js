import React from 'react';
import { Menu, Segment, Grid, Modal, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './base.css'
import DisplayStocks from './DisplayStocks.js'
import LogRegister from './LogRegister'
import DisplayMarket from './DisplayMarket'
import DisplayHistory from './DisplayHistory'
require('dotenv')


class App extends React.Component {

  // declare initial variables within state
  constructor() {
    super();
    this.state = { 
      logged: false,
      loggedID: 0, 
      money: 0,
      loadeddata: false
    };
  }

  // this function is called from props passed down to the LogRegister component, it makes sure our entire app scope knows who we are, and if we are logged in.
  login = (id, money) => {
    this.setState({
      logged: true,
      loggedID: id,
      money: money
    })
  }

  // updating money on the front end (back-end money is still persisnt no matter what number is shown here) so that the user can see what they have left
  updateMoney = (subtract, money) => {
    if (subtract == 'subtract') {
      this.setState({
        money: this.state.money - money
      })
    } else {
      this.setState({
        money: this.state.money + money
      })
    }
  }

  // this function is called from the menu listed downbelow, it logs us out on both the front and back-end.
  logout = async(e) => {
    localStorage.removeItem('nomi-id')
    localStorage.removeItem('nomi-code')
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
  // we use this as a middle man between the update stocks and update history components. we do not want the history to load before the stock data is on the page
  updateHistory = (e) => {
    this.setState({
      loadeddata: true
    })
  }

  // render all components for our app
  render() {
    const style= {
      'backgroundColor': 'rgb(48, 48, 48)',
    }
    const pstyle = {
      'color':'white',
      'fontSize': '16px'
    }
    return (
        <React.Fragment>

          <div className="deprecated">
              <p>As of 06/10/20 this website has been deprecated. If you see any bugs please know that it is due to the nature of ever changing apis. Thank you for visiting!</p>
          </div>

        { /* 
        wrap our whole app within the logged ternary operator. providing zero access to the website without a state as logged  
        UPDATE 2021: This is a pretty poor idea and logical way of doing this even though it works.
         */ }
        { this.state.logged ?

        <div>
            <Menu inverted size="small" pointing secondary style={{'fontSize': '17px', 'backgroundColor': 'rgb(38,38,38)', 'paddingRight': '20px'}}>
              <Menu.Item name="NOMI" style={{'padding': '0px', 'color':'darkorange', 'left': '20px', 'top': '-8px', 'fontWeight': 'bold', 'fontSize': '25px'}}></Menu.Item>
              <Menu.Item style={{'color':'#72F03C'}} icon="money" position="right" name={this.state.money.toFixed(0).toString()}/>
              <Menu.Item icon="log out" name="Logout" onClick = {this.logout}></Menu.Item>
              <Modal trigger={ <Menu.Item icon="help" name="Help"></Menu.Item>} style={{'maxWidth': '300px'}}>
                  <Segment style={{'backgroundColor': 'rgb(48,48,48)', 'width': '400px'}}>
                    <Header as="h1" textAlign="center" style={{'color':'white'}}>Welcome to <span style={{"color": "orange"}}>Nomi</span></Header>
                    <Segment style={{'backgroundColor':'rgb(38,38,38)', 'color': 'orange'}}>
                      <p style={pstyle}>
                      <br></br>
                      Nomi is a mock-trading app based on real data pulled from wall-steet</p><br></br>
                      <h3>Watch-List</h3>
                      <br></br>
                      <p style={pstyle}>
                      The use is simple, To add stocks to your watchlist (maximum of 5 at one time). Simply click the green addition button at the top of your page. If you would like to stop watching a stock, Simply click the 'stop watching' button.</p><br></br><br></br>
                      <h3>Buying and selling</h3>
                      <br></br>
                      <p style={pstyle}>
                      You can buy and sell stocks based off the open price of the stock each day. this is not a live trading app. it is meant for long term trading gains instead of quick trades. to view your currently owned stocks simply look at the left panel to see all the data related to stocks owned. You can buy stocks off of your watchlist then remove from watchlist without affecting your ownership etc... </p><br></br><br></br>
                      <h3>Have any suggestions or bugs?</h3>
                      <br></br>
                      <p style={pstyle}>
                      Please contact the owner at: Nathanielredmon@gmail.com
                      </p>
                    </Segment>
                  </Segment>
              </Modal>
            </Menu>
          {/* where all components are displayed */}
          <div style={{'display': 'flex', 'width': 'fit-content', 'margin': '0 auto'}} columns={3}>
            <div style={{'width': 'fit-content', 'marginRight': 30}}>
              { this.state.loadeddata ? 
              <DisplayHistory add={this.updateMoney} loggedID={this.state.loggedID}/>
              :
              null
              }
            </div>

            { /* we dont want to try and render our stocks if the user hasnt logged in and we dont have access to the UserID */ }
            { this.state.logged ? 
            <div style={{'width': 'fit-content', 'marginRight': 30}}>
                <Segment style={style}>
                  <DisplayStocks updateHistory={this.updateHistory} subtract={this.updateMoney} loggedID={this.state.loggedID}/>
                </Segment>
            </div>
            :
            null }
            <div style={{'width':'fit-content', 'margin': '0 auto'}}>
                <DisplayMarket />
            </div>
          </div>
        </div>

        :
        <LogRegister login={this.login}/> 
        }

        </React.Fragment>
    )
  }
  
}
export default App;
