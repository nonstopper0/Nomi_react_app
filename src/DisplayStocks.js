import React from 'react'
import { Button} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
import StockRender from './StockRender.js'

class DisplayStocks extends React.Component {
    constructor() {
        super()
        this.state = {
            formattedData: []
        }
    }
    //get stock data from user
    updateStocks = async(e) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/all/${this.props.loggedID}`, {
            method: 'GET'
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
                console.log(stockObject)
                this.setState({
                    formattedData: [...this.state.formattedData, stockObject]
                })
            } 
            catch(err) {
                console.log(err)
                console.log('you have reached the maxiumum api limit')
            }
            console.log(this.state.formattedData)
        }
    }

    componentDidMount = async() => {
        await this.updateStocks()
    }

    formatData = (data) => {
        const newArray = []
        let num = 0
        const objects = Object.entries(data)
        const formatted = objects.map((group) => {
            num++
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
 
    render() {
          
        return (
            <div>
                <Button color="green" onClick={this.updateStocks}>Update</Button>
                <Button color="red" onClick={this.formatMethod}>Test</Button>
                {/* <StockRender formattedData={this.state.formattedData}/> */}
            </div>
        )
    }
}

export default DisplayStocks;