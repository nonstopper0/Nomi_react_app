import React from 'react';
import APICall from './APIcall.js'
import DisplayStocks from './DisplayStocks.js'
import {AppBar, Toolbar, Paper, IconButton, Typography, Button, Grid, DialogActions} from '@material-ui/core'
import { ThemeProvider } from '@material-ui/styles';
import { createMuiTheme } from '@material-ui/core/styles';

const theme = createMuiTheme({
  palette: {
    primary: {
      light: '#5a7c8d',
      main: '#2d5060',
      dark: '#002836',
      contrastText: '#fff',
    },
    secondary: {
      light: '#80e27e',
      main: '#4caf50',
      dark: '#087f23',
      contrastText: '#000',
    },
  },
});

class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      connection: '',
      data: ''
    };
  }
  getUserStocks = () => {
    const stocks = APICall.stockAPIcall("AAPL")
    console.log(stocks)
  }
  getPresetStocks = () => {

  }
  render() {
    return (
      <ThemeProvider theme={theme}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6">
              Nomi Stocks
            </Typography>
          </Toolbar>
        </AppBar>
        <Grid justify="center" container spacing={10}>
          <Grid item color="primary">
              <Paper color="primary" style={{padding: '10%', textAlign: 'center'}}><APICall/></Paper>
          </Grid>
        </Grid>
        <Button onClick={this.getUserStocks}>Stonks</Button>
        <DisplayStocks/>
      </ThemeProvider>
    )
  }
  
}
export default App;
