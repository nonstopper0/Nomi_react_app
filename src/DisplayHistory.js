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
            console.log(parsedResponse)
            this.setState({
                data: parsedResponse.data,
                isLoaded: true,
                loading: false
            })
        } catch(err) {
            console.log(err)
        }
    }

    componentDidMount = async(e) => {
        await this.getHistory()
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
                                            <List>
                                            <List.Item content={`quantity: ${action.quantity}`}></List.Item>
                                            <List.Item content={`purchased at: ${action.buy_price} on ${((action.buy_executed).toString()).substring(0, 10)}`}></List.Item>
                                            <List.Item content={`current price: ${action.current_price}`}></List.Item>
                                            </List>
                                        </Segment>
                                    )
                                }
                            })
                        :
                        null 
                        }
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