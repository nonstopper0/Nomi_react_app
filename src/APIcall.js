import React from 'react'
import { Button, Grid, TextField, Dialog, Container, DialogActions, Input, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
let request = require('request')
require('dotenv')

class APICall extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            message: '',
            messageDialog: false
        }
    }
    stockAPIcall = (symb) => {
        request({
          method: 'GET',
          url: 'https://finnhub-realtime-stock-price.p.rapidapi.com/stock/earnings',
          qs: {symbol: `${symb}`},
          headers: {
            'x-rapidapi-host': 'finnhub-realtime-stock-price.p.rapidapi.com',
            'x-rapidapi-key': '6461bb41c1msh86bceafee083e46p1bfd19jsn6d8e0e473984'
          }
        },
        (err, res, body) => {
        if(err) {
            console.log(err)
        } else {
        console.log('finished grabbing data ', symb)
        const parsedResponse = res.toJSON()
        if (parsedResponse.statusCode === 200) {
            console.log(parsedResponse.body)
            console.log(parsedResponse.body.length)
            if(parsedResponse.body.length > 2) {
                this.setState({
                    message: 'Succesfully added stock',
                    messageDialog: true
              })
            } else {
                this.setState({
                    message: 'Please enter a Valid Stock',
                    messageDialog: true
                })
            }
        }
    }})
    }
   
    handleChange = (e) => {
        this.setState({
        [e.target.name]: [e.target.value]
        })
    }
    handleSubmit = async(e) => {
        e.preventDefault()
        const stockName = (this.state.name).toString().toUpperCase()
        console.log(stockName)
        await this.stockAPIcall(stockName)
    }
    handleDialogClose = (e) => {
        this.setState({
            messageDialog: false
        })
    }
    render() {
        return (
            <div>
                <Container maxWidth="sm">
                <Dialog onClose={this.handleDialogClose} open={this.state.messageDialog}>
                    <DialogTitle>{this.state.message}</DialogTitle>
                    <DialogActions>
                        <Button variant="outlined" color="primary" onClick={this.handleDialogClose}>Close</Button>
                    </DialogActions>
                </Dialog>
                <form onSubmit={this.handleSubmit}>
                    <TextField
                        placeholder="Stock"
                        value={this.state.name}
                        margin="normal"
                        name="name"
                        color="primary"
                        fullWidth
                        variant="standard"
                        onChange={this.handleChange}
                        type="string"
                        required={true}
                    />
                    <Button variant="contained" color="primary" type="submit">SUBMIT</Button>
                </form>
                </Container>
            </div>
        )
    }
}

export default APICall;