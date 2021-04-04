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
            message: '',
            loading: false
        }
    }

    componentDidMount = (e) => {
        let id = localStorage.getItem('nomi-id')
        let code = localStorage.getItem('nomi-code')

        if (code && id) {
            this.login({
                username: id,
                password: code
            }, true)
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

        if (parsedRegisterResponse.status !== 200) {
            this.setState({
                message: 'Register failed, Username or email already taken'
            })
            return
        }

        this.storeData()
        this.props.login(parsedRegisterResponse.data, parsedRegisterResponse.money)
    }

    login = async (info, cache) => {
        const response = await fetch(`${process.env.REACT_APP_API_URL}/login`, {
            method: 'POST',
            body: JSON.stringify(info),
            headers: {
                'Content-Type': 'application/json'
            }
        })

        const parsedLoginResponse = await response.json()

        if (parsedLoginResponse.status !== 200) {
            this.setState({
                message: 'Login failed, Wrong username or password',
            })
            return
        }

        if (!cache) {
            this.storeData()
        }
        
        this.props.login(parsedLoginResponse.data, parsedLoginResponse.money)
    }

    storeData = async() => {
        localStorage.setItem('nomi-id', this.state.username.toLowerCase())
        localStorage.setItem('nomi-code', this.state.password)
    }

    guest = async() => {
        this.setState({
            loading: true
        })
        const response = await fetch(`${process.env.REACT_APP_API_URL}/guest`, {
            method: 'POST',
            body: JSON.stringify({"username": "guest", "password": "guest"}),
            headers: {
                'Content-Type': 'application/json'
            }
        })
        const parsedGuestResponse = await response.json()
        console.log(parsedGuestResponse)
        this.props.login(parsedGuestResponse.data, parsedGuestResponse.money)
        this.setState({
            loading: false
        })
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
            'backgroundColor': 'rgb(38, 38, 38)',
            'color': 'white',
            'textAlign': 'center',
            'margin': '0'
          }
        const inputstyle = {
            'backgroundColor': 'rgb(28, 28, 28)',
            'color': 'white',
            'marginBottom': '10px', 
        }
        return(
            <Modal open={true} style={{'maxWidth': '400px', 'backgroundColor': 'rgb(48,48,48)', 'borderRadius': 30, 'textAlign': 'center'}}>
                    <Header as="h1" textAlign="center" style={style}>
                        <span style={{"color": "orange"}}>Nomi</span> {this.state.action ==="login" ? "Login" : "Register" }
                    </Header>
                    { this.state.message ? <Header style={style} textAlign='center'>{this.state.message}</Header> : null}
                    <Segment  style={style}>
                        <Button
                            style={{'width': '370px', 'marginBottom': '10px', 'backgroundColor': 'rgb(59,59,59)', 'color': 'white'}}
                            onClick={this.changeAction}> {this.state.action === "login" ? "Not a user? Register here" : "Already a User? Login here" } 
                        </Button>
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
                        <Button onClick={()=>this.guest()} fluid color="grey" style={{'marginTop': 20, 'backgroundColor': 'rgb(38,38,38)', 'color': 'grey'}}>
                            Login with Guest account?
                        </Button>
                    </Segment>
            </Modal>
        )
    }
}

export default LogRegister;