import React from 'react';
import './App.css';
require('dotenv')

class App extends React.Component {
  constructor() {
    super();
    this.state = { 
      connection: ''
    };
}

callAPI = async(e) => {
  console.log('fetching')
    const response = await fetch(`${process.env.REACT_APP_API_URL}/`)
    const parsed = await response.json()
    console.log(parsed)
    console.log(response.status)
}

componentDidMount() {
    this.callAPI();
}
  render() {
    return (
      <p className="App-intro">{this.state.connection}</p>
    )
  }
  
}
export default App;
