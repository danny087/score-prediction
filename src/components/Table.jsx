import React, { Component } from 'react'
import firebase from "../firebase";
import { Route, Switch,Link } from "react-router-dom";
import { findFieldsThatChangedTypeOnInputObjectTypes } from 'graphql/utilities/findBreakingChanges';
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
    text:{
        fontFamily:'Maven Pro',
        fontSize:'1.7em',
        marginTop:'5%'
        
      },
      Button:{
   
    
        padding:'1%',
        marginBottom:'5%'
        
        
      },
}
class Table extends Component {

    state={
        userScores:null,
leagues:null,
leagueInfo:null,
inputValue:null,
userId:this.props.uid
    }
    

    componentWillMount() {
        let uid = this.state.userId
      
        let users = firebase.firestore().collection('users')
        users.get().then((snapshot) => {
           return snapshot.docs.map(user => {
                return user.data()
            })
            }).then(userScores => {
               this.setState({
                   userScores:userScores,
                   
               })

                
            })
        let userLeagues = firebase.firestore().collection('users')
       
        userLeagues.doc(uid).get().then((snapshot) => {
            
            let arr = []
            return snapshot.data().leagues.map(league => {
                return league
            })
            

       
        }).then(response => {
         
            if(response.length > 0){
                this.setState({
                    leagues:response
                })
            }
        }).then(response => {
           
            let leagues = firebase.firestore().collection('leagues')
            let newArr = []
            leagues.get().then(response => {
             
                let leagues = response.docs.map(league => {
                   return league.data().members.filter(member => {
                        if(member === uid){
                            
                           newArr.push(league.data())

                        }
                    })
                  
                    
                })
               
               
             this.setState({
                 leagueInfo:newArr
             })
                
            })
        })
       
    }

    handleChange(e){
        const value = e.target.value
        this.setState({
            inputValue:value
        })
        
    }


 
  render() {
      
    return (
      <div>
       
        <div>
        <div>

        {this.state.leagues === null ?<h1 className={this.props.classes.text}>you are not in any leagues create one or find an existing one</h1>:null}
        <div>
            <h1 className={this.props.classes.text}>search for existing league</h1>
            <div>
        <input type="text" name="HomeTeamPrediction" onChange={(e) => this.handleChange(e)} placeholder='Find league' data-cy="input"/> 
       
        {this.state.inputValue !== null ? <Link to={`/league/${this.state.inputValue.replace(/\s+/g, '')}`}><button data-cy="findleague">search</button></Link>:null}
        </div>
        </div>
        <h1 className={this.props.classes.text}>create your own leauge</h1>
        <div>
        <Link to={`/createleague`}><Button variant="contained" color="primary" className={this.props.classes.Button}>create leauge</Button></Link>
        <h1 className={this.props.classes.text}>Your Leagues</h1>
        {this.state.leagueInfo !== null ? this.state.leagueInfo.map(league => {
           
            return (
                <Link to={`/league/${league.leagueName.replace(/\s+/g, '-')}`}><Button variant="contained" color="primary" className={this.props.classes.Button}>{league.leagueName}</Button></Link>
            )
        }):null}
        </div>
        </div>
    </div>

      </div>
    )
  }
}


export default withStyles(styles)(Table)