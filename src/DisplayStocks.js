import React from 'react'
import { Button, Header, Segment, Form, Modal, Icon} from 'semantic-ui-react'
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
            width: 500,
            numToBuy: 1,
            addStockMessage: ''
        }
    }

    // get stock data from user with a fetch using our loggedID. Then take that data, format it by initalizing it as our own object, then send it through our format data function below.
    updateStocks = async(e) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/all/${this.props.loggedID}`, {
            method: 'GET'
        })
        // reset state before adding again
        this.setState({
            formattedData: []
        })
        const parsedResponse = await response.json()
        if (parsedResponse.status === 200) {
            this.setState({
                formattedData: parsedResponse.data,
                isLoaded: true
            })
            this.props.updateHistory()
        } else {
            console.log(parsedResponse.data)
        }
    }

    componentDidMount = () => {
        this.updateStocks()
    }

    // remove stock from users list through the un-watch button
    removeStock = async(name) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/${name}/${this.props.loggedID}`, {
            method: 'DELETE'
        })
        const newData = this.state.formattedData.filter((data) => data.name !== name)
        this.setState({
            formattedData: newData
        })
    }

    buyStock = async(name) => {
        console.log('buying stock')
        let stockName = name
        let numberToBuy = this.state.numToBuy
        this.setState({
            numToBuy: 1
        })
        let data = {
            num: numberToBuy,
            user: this.props.loggedID
        }
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/buy/${stockName}`, {
            method: 'POST',
            body: JSON.stringify(data),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const parsedResponse = await response.json()
        if (parsedResponse.status === 400) {
            this.setState({
                addStockMessage: parsedResponse.data
            })
        } else if (parsedResponse.status === 200) {
            console.log(parsedResponse)
            let finalPrice = parseFloat(parsedResponse.data[0]*parsedResponse.data[1]).toFixed(2)
            this.props.subtract('subtract', finalPrice)
            this.setState({
                addStockMessage: `Congrats, you have succesfully purchased ${parsedResponse.data[1]} of ${parsedResponse.data[2]} for ${finalPrice}`
            })
        }
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/add/${stockName}/${this.props.loggedID}`, {
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
                                            style={{'backgroundColor': 'rgb(38,38,38', 'color': 'white', 'marginBottom':'10px'}}
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
                { this.state.addStockMessage ? 
                <Modal open style={{'maxWidth': '600px'}}>
                    <Segment style={style}>
                        <Segment textAlign="center" style={{'backgroundColor': 'rgb(38,38,38)'}}>
                        <Header style={{'color':'white'}}>{this.state.addStockMessage}</Header>
                        <Button color="red" icon="x" onClick={()=> {this.setState({addStockMessage: ''})}}></Button>
                        </Segment>
                    </Segment>
                </Modal> 
                : null }

                {/* once our data is confirmed loaded through the apicall setting the loading status to done within state we map through our state to display each stock on the page through ReChart using the new formatted data */}
                { this.state.isLoaded ? 
                       this.state.formattedData.map((data) => {
                        const indexOfLast = data.data.length-1
                        const compared = (data.data[indexOfLast].open - (data.data[indexOfLast-1].open)).toFixed(2)

                        // find the average number for each stock so i can properly calculate the graphs max height and width properties
                        let numarray = []
                        data.data.forEach((data)=> {
                            numarray.push(Math.floor(data.close))
                        })
                        let average = 0
                        for (let i = 0; i < numarray.length; i ++) {
                            average += numarray[i]
                        }
                        average = average/100
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
                                    <Header color={Math.sign(compared) === -1 ? 'red' : 'green'} textAlign='center'>{Math.sign(compared) === -1 ? 'Down': 'Up'} from last market day Open: {compared}</Header>

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
                                        <YAxis interval={1} allowDataOverflow type="number" domain={[`dataMin - ${average/2}`, `dataMax + ${average}`]}/>
                                        <Tooltip labelStyle={{'color':'black'}}/>
                                        <Legend formatter={(value, entry) => { 
                                            entry['color'] = 'rgb(120,120,120)'
                                        const { color } = entry; 
                                        return <span style={{color}}>{value}</span>}}/>
                                        <Brush  fill="rgb(58,58,58)"/>
                                        <Bar type="monotone" barSize={15} dataKey="open" fill="rgb(160,160,160)" fillOpacity={.6} />
                                        <Bar type="monotone" barSize={15} dataKey="close" fill="rgb(90,90,90)" fillOpacity={.6} />
                                        <Line dot={false} type="monotone" strokeWidth={1.5} dataKey="high" stroke="rgb(200,200,200)"></Line>
                                        <Line dot={false} type="montone" strokeWidth={1} dataKey="low" stroke="gray"></Line>
                                    </ComposedChart>
                                </Segment>
                                {/* buttons for buying stocks */}
                                <Button color="orange" icon="minus" onClick={()=> this.state.numToBuy > 0 ? this.setState({numToBuy: this.state.numToBuy-1}) : null}></Button>
                                <Button color="grey" onClick={()=> this.buyStock(data.name)} content={`buy ${this.state.numToBuy} of ${data.name} for ${(data.data[99].open * this.state.numToBuy).toFixed(2)}`}></Button>
                                <Button color="orange" icon="add" onClick={()=> this.setState({numToBuy: this.state.numToBuy+1})}></Button>
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