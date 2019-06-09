import React, { Component } from 'react'
import firebase from "../firebase";
import { Route, Switch,Link } from "react-router-dom";




export default class CreateLeague extends Component {
state ={
    createdLeague:false,
    userId:this.props.uid
}
    handleSubmit(e){
        
        e.preventDefault()
        let uid = this.state.userId
        
        let leagues = firebase.firestore().collection('leagues')
        
        leagues.add({
            leagueName:this.state.leagueName,
            createdBy:uid,
            members:[uid]
            
        }).then(response => {
            uid = this.state.userId
         
            firebase.firestore().collection('leagues').where('createdBy', '==',uid).get().then((snapshot) => {
                
               
                let userLeuages = snapshot.docs.map(leauge => {
                    
                  
                  return leauge.id
                })
               
              
            
                userLeuages.filter(league => {
                   
                    return league === toString(uid) 
                })
                
                let users = firebase.firestore().collection('users')
                
                uid = this.state.userId
            users.doc(uid).get().then((snapshot) => {
               
               uid = this.state.userId
                users.doc(uid).update({
                    leagues:[...userLeuages]
                })
                this.setState({
                    createdLeague:true,
                    
                })
            })
            })
     
            

            
        })
    }
    handleChange(e){
       
        this.setState({
            leagueName:e.target.value
        })
    }
  render() {
    
      return (
        
      <div>
          {this.state.createdLeague !== true ?
              <form onSubmit={(e) => this.handleSubmit(e)}>
        <h1>league name</h1>
        <input onChange={(e) => this.handleChange(e)} type="text" name="leaugeName" ></input>
        <button>Create League</button>
        </form>
       :<div><h1>League has been created</h1>
       <Link to={`/league/${this.state.leagueName.replace(/\s+/g, '-')}`}><button>Go to leauge</button></Link>
       </div>}
      </div>
    )
      
  }
}
