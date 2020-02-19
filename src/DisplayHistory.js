import React from 'react'
import {Segment, List, Header, Button, Icon} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
require('dotenv')



class DisplayHistory extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoaded: false,
            data: [],
            loading: true
        }
    }
    getHistory = async() => {
        try {
            this.setState({
                loading: true
            })
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/history/${this.props.loggedID}`, {
                method: 'GET' 
            })
            const parsedResponse = await response.json()
            this.setState({
                data: parsedResponse.data,
                isLoaded: true,
                loading: false
            })
        } catch(err) {
            console.log(err)
        }
    }
    sell = async(id) => {
        try {
            const data = {
                id: id
            }
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/sell`, {
                method: 'POST',
                body: JSON.stringify(data),
                headers: {
                    'Content-Type': 'application/json'
                }
            })
            const parsedResponse = await response.json()
            console.log(parsedResponse)
            if (parsedResponse.status === 200) {
                const newState = this.state.data.filter((data) => {
                    console.log(data)
                    console.log(id)
                    return data.id != id
                })
                this.props.add('add', parsedResponse.money)
                this.setState({
                    data: newState
                })
            }
        } catch(err) {
            console.log(err)
        }
    }
    componentDidMount() {
        this.getHistory()
    }
    render() {
        const style = {
            'backgroundColor': 'rgb(48,48,48)',
            'color': 'white',
            'padding': '3px'
        }
        return (
        <div>
            <Segment style={{'backgroundColor': 'rgb(48,48,48)', 'width': '400px'}} textAlign="left">
                <Segment style={style}>
                    <Segment style={{'backgroundColor': 'rgb(38,38,38)'}}>
                        <Button circular color="orange" style={{'position':'absolute', 'left': '85%'}}onClick={()=> {this.getHistory()}} icon="refresh"></Button>
                        <Header as="h2" style={{'margin': '0px'}} color="orange">Owned Stocks</Header>
                    </Segment>
                    { !this.state.loading ? 
                        <Segment style={{'backgroundColor': 'rgb(38,38,38)'}}>
                        { this.state.isLoaded ? 
                            this.state.data.map((action) => {
                                if (action.isOwned) {
                                    return (
                                        <Segment key={Math.random()} style={{'backgroundColor': 'rgb(48,48,48)'}}>
                                            <Header color="orange">{action.stock_name}</Header>
                                            <Button style={{'position':'absolute', 'left': '230px', 'top': '10px'}} icon={action.current_price > action.buy_price ? 'caret up' : 'caret down'} color={action.current_price > action.buy_price ? 'green' : 'red'} content={`%${(((action.current_price - action.buy_price) / action.buy_price)*100).toFixed(1)}`}></Button>
                                            <List>
                                            <List.Item content={`quantity: ${action.quantity}`}></List.Item>
                                            <List.Item content={`purchased at: ${action.buy_price} on ${((action.buy_executed).toString()).substring(0, 10)}`}></List.Item>
                                            <List.Item style={action.current_price > action.buy_price ? {'color':'#72F03C'} : {'color':'#E93535'}} content={`current price: ${action.current_price}`}></List.Item>
                                            </List>
                                            <Button onClick={() => {this.sell(action.id)}} color="grey" content={`sell ${action.quantity} of ${action.stock_name} for ${(action.quantity * action.current_price).toFixed(2)}`}></Button>
                                        </Segment>
                                    )
                                }
                            })
                        :
                        null 
                        }
                        <p style={{'color': 'rgb(78,78,78)'}}>Does a number look incorrect or the same? try adding the stock to your watchlist, our database might not be updated for that stock today yet!</p>
                    </Segment>
                    :
                    <Icon name="spinner" color="orange" circular></Icon>}
                </Segment>
            </Segment>
        </div>
        )
    }
}
            

export default DisplayHistory;