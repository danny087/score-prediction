import React, { Component } from 'react'
import { Route, Switch,Link } from "react-router-dom";
import Logout from './Logout'
import firebase from "../firebase"
import 'firebase/auth'
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper
} from "@material-ui/core";
import { withStyles } from "@material-ui/core/styles";

const styles = {
  container:{
    backgroundColor:'red',
    paddingBottom:'5%',
    paddingTop:'3%',
    
    
  },
  links:{
    textDecoration:'none',
    margin:'9%',
    fontSize:'1.7em',
    color:'white',
    fontFamily:'Maven Pro',
    marginTop:'50%',
    display: 'inlineBlock',
    minHeight: '50px',
    height: 'auto',
    width: '500px'
    
    
   
  },
  logout:{
    
    
    
  },
  inline:{
    display: 'inline',
   
  }
}

class Navbar extends Component {
handleClick(e){
  
  if(e.target.name === 'Logout'){
  firebase.auth().signOut()
  }
}
  
  render() {
    let navButtons = ['home','leagues']
    
    return (
      <div className={this.props.classes.container}>
        <span className={this.props.classes.inline}>{navButtons.map((button,i) => {
            return (
               <span className={this.props.classes.inline}>
                <Link className={this.props.classes.inline} name={button} onClick={(e) => this.handleClick(e)} className={this.props.classes.links} to ={`/${button}`}>{button}</Link> 
                {i === 1 ? <Logout className={this.props.classes.inline} />: null}
                </span>
            )
            })}  </span>
       
      </div>
    )
  }
}

export default withStyles(styles)(Navbar)
