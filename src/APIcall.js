import React from 'react'
import {Form, Segment, Icon, Button, Modal, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
let request = require('request')
require('dotenv')

class APICall extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            message: '',
            open: false
        }
    }
    // stockAPIcall = (symb) => {
    //     request({
    //       method: 'GET',
    //       url: 'https://finnhub-realtime-stock-price.p.rapidapi.com/stock/earnings',
    //       qs: {symbol: `${symb}`},
    //       headers: {
    //         'x-rapidapi-host': 'finnhub-realtime-stock-price.p.rapidapi.com',
    //         'x-rapidapi-key': '6461bb41c1msh86bceafee083e46p1bfd19jsn6d8e0e473984'
    //       }
    //     },
    //     (err, res, body) => {
    //     if(err) {
    //         console.log(err)
    //     } else {
    //     console.log('finished grabbing data ', symb)
    //     const parsedResponse = res.toJSON()
    //     if (parsedResponse.statusCode === 200) {
    //         console.log(parsedResponse.body)
    //         console.log(parsedResponse.body.length)
    //         if(parsedResponse.body.length > 2) {
    //             this.setState({
    //                 open: false,
    //                 name: ''
    //             })
    //             //lifting state
    //             this.props.addStock(parsedResponse.body)
    //         } else {
    //             this.setState({
    //                 message: 'Please enter a Valid Stock',
    //                 name: ''
    //             })
    //         }
    //     }
    // }})
    // }
   
    handleChange = (e) => {
        this.setState({
        [e.target.name]: [e.target.value]
        })
    }
    handleSubmit = async(e) => {
        e.preventDefault()
        const stockName = (this.state.name).toString().toUpperCase()
        console.log(stockName)
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/${stockName}`, {
            method: 'POST'
        })
        const parsedResponse = await response.json()
        if (parsedResponse.status === true) {
            this.setState({
                open: false
            })
        } else {
            this.setState({
                message: "Please Enter a Valid input"
            })
        }
        console.log(parsedResponse)
    }
    render() {
        return (
            <div>
            <Button color="green" onClick={() => this.setState({ open: true})}>
                Add Stock
            </Button>
            <Modal open={this.state.open} style={{'maxWidth': '300px'}}>
                <Segment inverted>
                    <Button color="red" style={{'left':'265px','top':'-15px', 'position': 'absolute'}}onClick={()=>{this.setState({open:false})}}>
                        <Icon fitted name="x" ></Icon>
                    </Button>
                    <Header as="h1" textAlign="center">
                        Add Stock
                    </Header>
                    <Header textAlign="center">
                        {this.state.message}
                    </Header>
                    <Form inverted size="large" onSubmit={this.handleSubmit} required>
                            <Form.Input 
                                fluid
                                icon="money"
                                iconPosition='left'
                                placeholder='name'
                                value={this.state.name}
                                onChange={this.handleChange}
                                name="name"
                                required
                            />
                        {/* Check if minimum fields have  */}
                        <Button onClick={this.handleSubmit} color="linkedin" fluid size="large">
                            Add
                        </Button>
                    </Form>
                </Segment>
            </Modal>
            </div>
        )
    }
}

export default APICall;