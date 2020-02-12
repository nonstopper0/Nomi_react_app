import React from 'react'
import { Button, Header, Segment, Form, Menu, Modal, Icon, Input} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import {Area, XAxis, YAxis, CartesianGrid, Tooltip, Legend, AreaChart, Brush, ResponsiveContainer} from 'recharts'

class DisplayStocks extends React.Component {
    constructor() {
        super()
        this.state = {
            formattedData: [],
            isLoaded: false,
            name: '',
            message: '',
        }
    }
    //get stock data from user
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

    formatData = (data) => {
        const newArray = []
        const objects = Object.entries(data)
        const formatted = objects.map((group) => {
            const split = group[0].split('-')
            const newDate = new Date(split[0], split[1], split[2])
            const high = group[1]["2. high"]
            const low = group[1]["3. low"]
            const newOjbect = {
                date: newDate,
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

    //unwatch the stock
    removeStock = async(name) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/${name}/${this.props.loggedID}`, {
            method: 'DELETE'
        })
        const newData = this.state.formattedData.filter((data) => data.name != name)
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
                    message: 'Succesfully Added Stock',
                    name: ''
                })
                this.updateStocks()
            } else {
                this.setState({
                    message: parsedResponse.data,
                    name: ''
                })
            }
            console.log(parsedResponse)
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
                { this.state.isLoaded ? 
                            <Modal trigger={<Segment style={{'background-color': 'rgb(38,38,38)'}} textAlign='center'><Icon name="add" color="green"/></Segment>} style={{'maxWidth': '300px'}}>
                            <Segment style={style}>
                                <Header as="h1" textAlign="center" style={style}>
                                    Add Stock
                                </Header>
                                <Header textAlign="center">
                                    <span style={{'color': 'white'}}>{this.state.message}</span>
                                </Header>
                                <Form size="large" onSubmit={this.handleSubmit} required>
                                        <input
                                            fluid
                                            style={{'background-color': 'rgb(38,38,38', 'color': 'white', 'marginBottom':'10px'}}
                                            icon="money"
                                            iconPosition='left'
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
                { this.state.isLoaded ? 
                       this.state.formattedData.map((data) => {
                           const indexOfLast = data.data.length-1
                           const compared = (data.data[indexOfLast].high - (data.data[indexOfLast-1].high)).toFixed(2)
                        return (
                        <Segment style={{'background-color': 'rgb(38,38,38)'}} key={data.data[0].high}>
                            <Button style={{'position': 'absolute', 'left': '73%'}}color="grey" onClick={()=> this.removeStock(data.name)}>Stop Watching</Button>
                            <Header as="h1" color="orange" textAlign="center">{data.name}</Header>
                            <Header style={{'color': 'white'}} textAlign='center'>Todays High: {data.data[indexOfLast].high}</Header>
                            <Header color={Math.sign(compared) == '-' ? 'red' : 'green'} textAlign='center'>Difference from last market day high: <span color="green">{compared}</span></Header>
                            <AreaChart
                                key={data.name}
                                width={500}
                                height={300}
                                data={data.data}
                                margin={{
                                top: 5, right: 30, left: 20, bottom: 5,
                                }}
                            >
                                <CartesianGrid fill="rgb(48,48,48)" />
                                <XAxis dataKey="date" />
                                <YAxis allowDataOverflow type="number" domain={[dataMin=> (data.data[0].low - data.data[0].low*.2), 'dataMax + 30']}/>
                                <Tooltip labelStyle={{'color':'black'}}/>
                                <Legend formatter={(value, entry) => { 
                                    entry['color'] = 'rgb(120,120,120)'
                                const { color } = entry; 
                                return <span style={{color}}>{value}</span>}}/>
                                <Brush fill="rgb(58,58,58)"/>
                                <Area type="monotone" dataKey="high" stroke="gray" fill="none" />
                                <Area type="monotone" dataKey="low" stroke="gray" fill="green"/>
                            </AreaChart>
                        </Segment>
                        )
                    }): null }
            </div>
        )
    }
}

export default DisplayStocks;