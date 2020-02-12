import React from 'react'
import {Segment, List, Header} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
require('dotenv')


function DisplayUserStocks(props) {
        return (
            <Segment textAlign="center" style={{'height': 'fit-content'}}>
                <List>
                <Header as="h3">Watched Stocks</Header>
                { 
                 props.data.map((object) => {
                     console.log(object)
                     return ( 
                         <List.Item key={object}>{object}</List.Item>
                     )
                 })
                }               
                </List>
            </Segment>
        )}
            

export default DisplayUserStocks;