import React, { Component } from 'react'
import firebase from "../firebase"
import 'firebase/auth'
import { withStyles } from "@material-ui/core/styles";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper
} from "@material-ui/core";


const styles={
  card:{
marginLeft:'25%',
marginRight:'25%',
marginTop:'5%',
paddingBottom:'2%'
  }
}

class LandingPage extends Component {
state={
  email:null,
  password:null,
  username:null,
  loginEmail:null,
  loginPassword:null
}

  handleChange(e){
     
    let values = e.target.value

    this.setState({
      [e.target.name]:values
    })
  }

  handleRegistration(e){
    e.preventDefault()

    firebase.auth().createUserWithEmailAndPassword(this.state.email,this.state.password)
    .then(cred => {
      if(!cred){
        
      }

return firebase.firestore().collection('users').doc(cred.user.uid).set({
  
  username:this.state.username,
  predictedResults:[],
  leagues:[],
  totalScore:0,
  weekScore:0,
  rightPredictionCount:null
})
    })
    .catch((err) => {

alert(err.message)
    })
    
    

  }

  handleLogin(e){
    e.preventDefault()
    firebase.auth().signInWithEmailAndPassword(this.state.loginEmail,this.state.loginPassword)
    .then(cred => {
      
    })
    .catch(err => {
      alert(err.message)
    })
  }
  render() {
   
    return (
      <div>
       
        <Card className={this.props.classes.card}>
        <form onSubmit={(e) => this.handleRegistration(e)}>
          <h1>sign up</h1>
          <p>email</p>
          <input onChange={(e) => this.handleChange(e)} type='email' name='email' required></input>
          <p>password</p>
          <input onChange={(e) => this.handleChange(e)} type='password' name='password' required></input>
          <p>username</p>
          <input onChange={(e) => this.handleChange(e)} name='username' required></input>
          <button>sign up</button>
        </form>
        </Card>
        <Card className={this.props.classes.card}>
        <form onSubmit={(e) => this.handleLogin(e)}>
          <h1>login</h1>
        <p>email</p>
          <input onChange={(e) => this.handleChange(e)}  type='email' name='loginEmail' required></input>
          <p>password</p>
          <input onChange={(e) => this.handleChange(e)} type='password' name='loginPassword' required></input>
          <button>login in</button>
          </form>
          </Card>
      </div>
    )
  }
}


export default withStyles(styles)(LandingPage);