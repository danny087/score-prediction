import React, { Component } from 'react'
import { Route, Switch,Link } from "react-router-dom";
import firebase from "../firebase"
import 'firebase/auth'
import { withStyles } from '@material-ui/core';


const styles = {
button:{
  
 
  display: 'inline',
  marginBottom:'15%',
  marginLeft:'20%',
  fontSize:'2.5vw',
  color:'white',
  fontFamily:'Maven Pro',
  
 
},
inline:{
  display: 'inlineBlock'
}
}

 class Logout extends Component {

    handleClick(){
firebase.auth().signOut()
    }
  render() {
    return (
      <span className={this.props.classes.inline}>
       <h1 className={this.props.classes.button} onClick={() => this.handleClick()}>logout</h1>
      </span>
    )
  }
}


export default withStyles(styles)(Logout)