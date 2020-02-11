import React from 'react'
import 'semantic-ui-css/semantic.min.css'
import {  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend} from 'recharts'

function StockRender(props) {
    console.log(props)
    return (
      <div>
        {this.props.formattedData.map((data) => {
            console.log(data.name)
            console.log(data.updated)
            console.log(data.data)
            return (
            <LineChart
                key={data.name}
                width={500}
                height={300}
                data={data.data}
                margin={{
                top: 5, right: 30, left: 20, bottom: 5,
                }}
            >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="date" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Line type="monotone" dataKey="high" stroke="green" activeDot={{ r: 5 }} />
                <Line type="montone" dataKey="low" stroke="red" activeDot={{ r: 5 }} />
            </LineChart>
            )
        })}
      </div>
    );
  }

  export default StockRender