import React from 'react'
import { Button, Grid, Paper, TextField, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle} from '@material-ui/core'
import { mergeClasses, ThemeProvider } from '@material-ui/styles'

class APICall extends React.Component {
    constructor() {
        super()
        this.state = {
            name: '',
            message: '',
            messageDialog: false
        }
    }
    render() {
        return (
            <Grid  style={{'margin':'40px'}} container spacing={3}>
                <Grid item color="primary" xs={3}>
                    <Paper color="primary" style={{padding: '10%', textAlign: 'center'}}>Stock</Paper>
                </Grid>
            </Grid>
        )
    }
}

export default APICall;