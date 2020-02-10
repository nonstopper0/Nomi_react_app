import React from 'react';
import { Button, Form, Grid, Header, Message, Segment, Dropdown} from 'semantic-ui-react'

class LogRegister extends React.Component {
    constructor() {
        super()
        this.state = {
            username: '',
            password: '',
            email: '',
            action: 'login',
            message: ''
        }
    }
    handleChange = (e) => {
        this.setState({
            [e.target.name]: e.target.value
        })
    }
    handleSubmit = (e) => {
        e.preventDefault()
        if (this.state.action === 'login') {
            this.login({
                username: this.state.username.toLowerCase(),
                password: this.state.password,
            })
        } else if (this.state.action === "register") {
            this.register({
                username: this.state.username.toLowerCase(),
                password: this.state.password,
                email: this.state.email.toLowerCase(),
            })
        }
    }
    register = async (info) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/register`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        }) 
        const parsedRegisterResponse = await response.json() 
        if (parsedRegisterResponse.status === 200) {
            this.props.login(parsedRegisterResponse.data)
        } else {
            this.setState({
                message: 'Register failed, Username or email already taken'
            })
        }
    }
    login = async (info) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const parsedLoginResponse = await response.json()
        if (parsedLoginResponse.status === 200) {
            this.props.login(parsedLoginResponse.data)
        } else {
            this.setState({
                message: 'Login failed, Wrong username or password'
            })
        }
    }
    changeAction = (e) => {
        if (this.state.action === "login") {
            this.setState({
                action: "register",
                message: ''
            })
        } else {
            this.setState({
                action: "login",
                message: ''
            })
        }
    }
    render(){
        return(
            <Grid textAlign="center">
                <Grid.Column style={{ maxWidth: 400, margin: 40}} verticalAlign="middle">
                    <Header as="h1" textAlign="center">
                        <span style={{"color": "orange"}}>Nomi</span> {this.state.action ==="login" ? "Login" : "Register" }
                    </Header>
                    <Header>
                        {this.state.message}
                    </Header>
                    <Button 
                        fluid size="large" 
                        onClick={this.changeAction}> {this.state.action === "login" ? "Not a user? Register here" : "Already a User? Login here" } 
                    </Button>
                    <Segment>
                        <Form inverted size="large" onSubmit={this.handleSubmit} required>
                        { this.state.action === "register" ? 
                            <Form.Input 
                            fluid
                            required
                            icon="mail"
                            iconPosition="left"
                            placeholder="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            name="email"
                            />
                            : null }
                            <Form.Input    
                                fluid
                                icon='user'
                                iconPosition='left'
                                placeholder='username'
                                value={this.state.username}
                                onChange={this.handleChange}
                                name="username"
                                required
                            />
                            <Form.Input 
                                fluid
                                icon='lock'
                                type="password"
                                iconPosition='left'
                                placeholder='password'
                                value={this.state.password}
                                onChange={this.handleChange}
                                name="password"
                                required 
                            />
                        {/* Check if minimum fields have been info */}
                        <Button onClick={this.handleSubmit} color="orange" fluid size="large">
                            {this.state.action === "login" ? "Login" : "Register"}
                        </Button>
                        </Form>
                    </Segment>
                </Grid.Column>
            </Grid>
        )
    }
}

export default LogRegister;