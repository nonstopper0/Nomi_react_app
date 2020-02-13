import React from 'react'
import { Button, Header, Segment, Form, Modal, Icon, Grid} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import {Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Brush, ComposedChart, Line} from 'recharts'

class DisplayStocks extends React.Component {

    // declare initial variables within state
    constructor() {
        super()
        this.state = {
            formattedData: [],
            isLoaded: false,
            name: '',
            message: '',
            height: 300,
            width: 550,
        }
    }

    // get stock data from user with a fetch using our loggedID. Then take that data, format it by initalizing it as our own object, then send it through our format data function below.
    updateStocks = async(e) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/all/${this.props.loggedID}`, {
            method: 'GET'
        })
        this.setState({
            formattedData: []
        })
        const parsedResponse = await response.json()
        for (let stock in parsedResponse.data) {
            try {
                let stockName = parsedResponse.data[stock]['Meta Data']['2. Symbol']
                let lastUpdated = parsedResponse.data[stock]['Meta Data']['3. Last Refreshed']
                let stockData = parsedResponse.data[stock]['Time Series (Daily)']
                const stockObject = {
                    name: stockName,
                    updated: lastUpdated,
                    data: await this.formatData(stockData)
                }
                this.setState({
                    formattedData: [...this.state.formattedData, stockObject]
                })
            } 
            catch(err) {
                console.log(err)
                console.log('you have reached the maxiumum api limit')
            }
        }
        this.setState({
            isLoaded: true
        })
    }

    componentDidMount = () => {
        this.updateStocks()
    }

    // turning the raw data that we recieve through our api call and getting it ready for ReChart. 
    formatData = (data) => {
        const newArray = []
        const objects = Object.entries(data)
        const formatted = objects.map((group) => {
            const split = group[0].split('-')
            const newDate = new Date(split[0], split[1], split[2])
            const open = group[1]["1. open"]
            const close = group[1]["4. close"]
            const high = group[1]["2. high"]
            const low = group[1]["3. low"]
            const newOjbect = {
                date: newDate,
                open: open,
                close: close,
                high: high,
                low: low
            }
            newArray.push(newOjbect)
        })
        newArray.sort((a, b) => a.date - b.date)
        newArray.filter((object) => {
            return object['date'] = `${object['date'].getMonth()}/${object['date'].getDate()}`
        })
        return newArray
    }

    // remove stock from users list through the un-watch button
    removeStock = async(name) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/${name}/${this.props.loggedID}`, {
            method: 'DELETE'
        })
        const newData = this.state.formattedData.filter((data) => data.name !== name)
        console.log(newData)
        this.setState({
            formattedData: newData
        })
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
        if (stockName.length < 6) {
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/${stockName}/${this.props.loggedID}`, {
                method: 'POST'
            })
            const parsedResponse = await response.json()
            if (parsedResponse.status === 200) {
                this.setState({
                    message: '',
                    name: ''
                })
                this.updateStocks()
            } else {
                this.setState({
                    message: parsedResponse.data,
                    name: ''
                })
            }
        // if stock is over 6 letters
        } else {
            this.setState({
                message: 'Please enter a valid stock'
            })
        }
    }

    render() {
        const style= {
            'backgroundColor': 'rgb(48,48,48',
            'color': 'white'
        }
        return (
            <div>

                {/* this is our modal used for adding stocks to our user and then re-rendering the page to update with that change */}
                { this.state.isLoaded ? 
                            <Modal trigger={<Segment style={{'backgroundColor': 'rgb(38,38,38)'}} textAlign='center'><Icon name="add" color="green"/></Segment>} style={{'maxWidth': '300px'}}>
                            <Segment style={style}>
                                <Header as="h1" textAlign="center" style={style}>
                                    Add Stock
                                </Header>
                                <Header textAlign="center">
                                    <span style={{'color': 'white'}}>{this.state.message}</span>
                                </Header>
                                <Form size="large" onSubmit={this.handleSubmit} required>
                                        <input
                                            style={{'background-color': 'rgb(38,38,38', 'color': 'white', 'marginBottom':'10px'}}
                                            placeholder='name'
                                            value={this.state.name}
                                            onChange={this.handleChange}
                                            name="name"
                                            required
                                        />
                                    <Button onClick={this.handleSubmit} color="linkedin" fluid size="large">
                                        Add
                                    </Button>
                                </Form>
                            </Segment>
                        </Modal>
                :
                null 
                }


                {/* once our data is confirmed loaded through the apicall setting the loading status to done within state we map through our state to display each stock on the page through ReChart using the new formatted data */}
                { this.state.isLoaded ? 
                       this.state.formattedData.map((data) => {
                           const indexOfLast = data.data.length-1
                           const compared = (data.data[indexOfLast].open - (data.data[indexOfLast-1].close)).toFixed(2)
                        return (
                            <Segment style={{'backgroundColor': 'rgb(48,48,48)'}} key={data.data[0].close}>

                                <Segment style={{'backgroundColor': 'rgb(38,38,38)', 'height': '64px'}}>
                                    <Button floated="left" color="grey" onClick={()=> this.removeStock(data.name)}>Stop Watching</Button>
                                    <Button floated="right" circular icon="zoom-in" color="orange" onClick={()=> {this.setState({height: this.state.height+10, width: this.state.width+40})}}></Button>
                                    <Button floated="right" circular icon="zoom-out" color="orange" onClick={()=> {this.setState({height: this.state.height-10, width: this.state.width-40})}}></Button>
                                </Segment>
                                <Segment style={{'backgroundColor': 'rgb(38,38,38)'}}>
                                    <Header as="h1" color="orange" textAlign="center">{data.name}</Header>
                                    <Header style={{'color': 'white'}} textAlign='center'>Todays Open: {data.data[indexOfLast].open}</Header>
                                    <Header color={Math.sign(compared) == -1 ? 'red' : 'green'} textAlign='center'>{Math.sign(compared) == -1 ? 'Down': 'Up'} from last market day close: {compared}</Header>

                                    <ComposedChart
                                        key={data.name}
                                        width={this.state.width}
                                        height={this.state.height}
                                        data={data.data}
                                        margin={{
                                        top: 5, right: 30, left: 20, bottom: 5,
                                        }}
                                    >
                                        <CartesianGrid fill="rgb(38,38,38)" />
                                        <XAxis dataKey="date" />
                                        <YAxis allowDataOverflow type="number" domain={[dataMin=> (data.data[0].close - data.data[0].close*.2), 'dataMax + 30']}/>
                                        <Tooltip labelStyle={{'color':'black'}}/>
                                        <Legend formatter={(value, entry) => { 
                                            entry['color'] = 'rgb(120,120,120)'
                                        const { color } = entry; 
                                        return <span style={{color}}>{value}</span>}}/>
                                        <Brush  fill="rgb(58,58,58)"/>
                                        <Bar type="monotone" barSize={10} dataKey="open" fill="orange"  />
                                        <Bar type="monotone" barSize={10} dataKey="close" fill="gray" />
                                        <Line dot={false} type="monotone" strokeWidth={2} dataKey="high" stroke="white"></Line>
                                        <Line dot={false} type="montone" strokeWidth={2} dataKey="low" stroke="gray"></Line>
                                    </ComposedChart>
                                </Segment>
                            </Segment>
                        )
                    })
                : 
                null 
                }
            </div>
        )
    }
}

export default DisplayStocks;