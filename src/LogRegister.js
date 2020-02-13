import React from 'react';
import { Button, Form, Header, Segment, Modal} from 'semantic-ui-react'

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
            this.props.login(parsedRegisterResponse.data, parsedRegisterResponse.money)
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
            this.props.login(parsedLoginResponse.data, parsedLoginResponse.money)
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
        const style= {
            'backgroundColor': 'rgb(48, 48, 48)',
            'color': 'white',
          }
        const inputstyle = {
            'backgroundColor': 'rgb(38, 38, 38)',
            'color': 'white',
            'marginBottom': '10px', 
        }
        return(
            <Modal open={true} style={{'maxWidth': '400px', 'backgroundColor': 'rgb(38,38,38)'}}>
                    <Header as="h1" textAlign="center" style={style}>
                        <span style={{"color": "orange"}}>Nomi</span> {this.state.action ==="login" ? "Login" : "Register" }
                    </Header>
                    { this.state.message ? <Header color="grey" textAlign='center'>{this.state.message}</Header> : null}
                    <Button 
                        color="grey"
                        fluid
                        size="large"
                        onClick={this.changeAction}> {this.state.action === "login" ? "Not a user? Register here" : "Already a User? Login here" } 
                    </Button>
                    <Segment  style={style}>
                        <Form style={style} size="small" onSubmit={this.handleSubmit} required>
                        { this.state.action === "register" ? 
                            <input 
                            style={inputstyle}
                            required
                            placeholder="email"
                            value={this.state.email}
                            onChange={this.handleChange}
                            name="email"
                            />
                            : null }
                            <input  
                                autoComplete="username"
                                style={inputstyle}
                                placeholder='username'
                                value={this.state.username}
                                onChange={this.handleChange}
                                name="username"
                                required
                            />
                            <input
                                autoComplete="current-password"
                                style={inputstyle}
                                type="password"
                                placeholder='password'
                                value={this.state.password}
                                onChange={this.handleChange}
                                name="password"
                            />
                        {/* Check if minimum fields have been info */}
                        { this.state.action === 'register' && this.state.email && this.state.password && this.state.username || this.state.action === 'login' && this.state.username && this.state.password ?
                        <Button onClick={this.handleSubmit} color="orange" fluid size="large">
                            {this.state.action === "login" ? "Login" : "Register"}
                        </Button>
                        : null }
                        </Form>
                    </Segment>
            </Modal>
        )
    }
}

export default LogRegister;