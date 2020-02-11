import React from 'react'
import {Form, Segment, Icon, Button, Modal, Header, Menu} from 'semantic-ui-react'
import 'semantic-ui-css/semantic.min.css'
require('dotenv')

class AddStock extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            message: '',
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
            const response = await fetch(`${process.env.REACT_APP_API_URL}/stock/${stockName}/${this.props.loggedID}`, {
                method: 'POST'
            })
            const parsedResponse = await response.json()
            if (parsedResponse.status === 200) {
                this.setState({
                    message: '',
                    name: ''
                })
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
        return (
            <div>
            <Modal trigger={<Menu.Item  name="add"></Menu.Item>} style={{'maxWidth': '300px'}}>
                <Segment inverted>
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

export default AddStock;