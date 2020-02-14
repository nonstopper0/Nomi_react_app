import React from 'react';
import { Menu, Segment, Grid} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import './base.css'
import DisplayStocks from './DisplayStocks.js'
import LogRegister from './LogRegister'
import DisplayMarket from './DisplayMarket'
require('dotenv')


class App extends React.Component {

  // declare initial variables within state
  constructor() {
    super();
    this.state = { 
      logged: false,
      loggedID: 0, 
      money: 0,
      notification: [],
      formattedData: [],
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

  // this function is called from the menu listed downbelow, it logs us out on both the front and back-end.
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

  // render all components for our app
  render() {
    const style= {
      'background-color': 'rgb(48, 48, 48)',
    }
    return (
        <React.Fragment>

        { /* wrap our whole app within the logged ternary operator. providing zero access to the website without a state as logged */ }
        { this.state.logged ?

        <div>
          <Segment style={style}>
            <Menu inverted pointing secondary style={{'fontSize': '15px'}}>
              <Menu.Item position="right" name={this.state.money.toString()}/>
              <Menu.Item name="Logout" onClick = {this.logout}></Menu.Item>
            </Menu>
          </Segment>

          <Grid textAlign="center">

            { /* we dont want to try and render our stocks if the user hasnt logged in and we dont have access to the UserID */ }
            { this.state.logged ? 
            <Grid.Column style={{'width': 'fit-content'}}>
                <Segment style={style}>
                  <DisplayStocks loggedID={this.state.loggedID}/>
                </Segment>
            </Grid.Column>
            :
            null }
            <Grid.Column>
                <DisplayMarket />
            </Grid.Column>

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
