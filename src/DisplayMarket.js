import React from 'react'
import {Segment, List, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
require('dotenv')


class DisplayMarket extends React.Component {
    constructor() {
        super()
        this.state = {
            isLoaded: false,
            weekMovements: [],
            dayMovements: [],
        }
    }
    getMovements = async() => {
        try {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/market`, {
            method: 'GET' 
            })
            const parsedResponse = await response.json()
            const weekObjects = Object.entries(parsedResponse.data["Rank C: 5 Day Performance"])
            const dayObjects = Object.entries(parsedResponse.data["Rank B: 1 Day Performance"])
            for (let data in weekObjects) {
                this.setState({
                    weekMovements: [...this.state.weekMovements, weekObjects[data]],
                })
            }
            for (let data in dayObjects) {
                this.setState({
                    dayMovements: [...this.state.dayMovements, dayObjects[data]]
                })
            }
            this.setState({
                isLoaded: true
            })
        }
        catch(err) {
            console.log(err)
        }
    }
    componentDidMount() {
        this.getMovements()
    }
    render() {
        const style = {
            'backgroundColor': 'rgb(48,48,48)',
            'color': 'white',
            'padding': '3px'
        }
        return (
            <div>
        <Segment style={{'backgroundColor': 'rgb(48,48,48)', 'width': '300px'}} textAlign="left">
            <Segment style={style}>
                <Segment style={{'backgroundColor': 'rgb(38,38,38)'}}>
                    <Header color="orange" as="h2">Today in the market</Header>
                </Segment>
                    <Segment style={{'backgroundColor': 'rgb(38,38,38)'}}>
                        { this.state.isLoaded ? 
                            this.state.dayMovements.map((movement) => {
                                return (
                                    <List.Item key={movement[0]}>{movement[0]}: <span style={{color: Math.sign(parseFloat(movement[1])) === -1 ? '#E93535' : '#72F03C', 'fontWeight': 700}}>{movement[1]}</span></List.Item>
                                )
                            })
                        :
                        null 
                        }
                </Segment>
            </Segment>
        </Segment>
        <Segment style={{'backgroundColor': 'rgb(48,48,48)', 'width': '300px'}} textAlign="left">
            <Segment style={style}>
                <Segment style={{'backgroundColor': 'rgb(38,38,38)'}}>
                    <Header color="orange" as="h2">This Week in the market</Header>
                </Segment>
                <Segment style={{'backgroundColor': 'rgb(38,38,38)'}}>
                    { this.state.isLoaded ? 
                        this.state.weekMovements.map((movement) => {
                            return (
                                <List.Item key={movement[0]}>{movement[0]}: <span style={{color: Math.sign(parseFloat(movement[1])) === -1 ? '#E93535' : '#72F03C', 'fontWeight': 700}}>{movement[1]}</span></List.Item>
                            )
                        })
                    :
                    null 
                    }
                    <br></br>
                    <p style={{'color': 'rgb(78,78,78)'}}>Have any questions about what to do? check out the help tab above</p>
                </Segment>
            </Segment>
        </Segment>
        </div>
        )
    }
}
            

export default DisplayMarket;