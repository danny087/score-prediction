import React, { Component } from 'react';
import { Route, Switch,Link } from "react-router-dom";
import LandingPage from './components/LandingPage'

import firebase from "./firebase";

import 'firebase/firestore'
import 'firebase/auth'




import CreateLeague from './components/CreateLeague'
import CreatedLeague from './components/CreatedLeague'
import './App.css';
import {getMatches} from './Api'
import MatchDayList from './components/MatchDayList'
import Matches from './components/Matches'
import Navbar from './components/Navbar';
import Table from './components/Table'
import Logout from './components/Logout'
const { database } = firebase;



export default class App extends Component {



  state={
   
    userUid:null,
    matchDay:'',
    matches:[{}]
  }
  componentWillMount(){


    let auth = firebase.auth()
    auth.onAuthStateChanged(user => {
     
      if(user){
        
        this.setState({
          userUid:user.uid
        })

      } else {
       this.setState({
        userUid:null
       })
      }
    })
  }
  componentDidUpdate(){
    if(this.state.userUid === null) {
      return null
    }
    else{
    getMatches().then(matches => {
      let uid = this.state.userUid
      
      let finalResults = []
      matches.data.matches.map(status => {
     

        if(status.status === 'FINISHED'){
          
       
          finalResults=[...finalResults,{
            matchId:{HomeTeamResult:status.score.fullTime.homeTeam,
              AwayTeamResult:status.score.fullTime.awayTeam,id:status.id,HomeTeamName:status.homeTeam.name,
          AwayTeamName:status.awayTeam.name,matchDay:status.matchday}}]

          
        }
       

      })
      
      
      let arr = []
      let weeklyScore = []
      let users = firebase.firestore().collection('users')
    
     
      users.doc(uid).get().then((snapshot) => {
     
    
       snapshot.data().predictedResults.map(prediction => {
        
return arr.push(prediction)
      }) 
      }).then(predicitonArr => {
       
        let predicitonAndFinal = finalResults.concat(arr)
      
        let predicitonAndFinalMergeObject =  predicitonAndFinal.reduce((acc,curVal) => {
          
          if(!acc[curVal.matchId.id]){
            
acc[curVal.matchId.id] = curVal.matchId;
          }
          else{
         
           acc[curVal.matchId.id] = {...acc[curVal.matchId.id],...curVal.matchId}
          }
return acc
        },[])
      
        let newArr = []

        predicitonAndFinalMergeObject.filter(match => {
  
  if(match.HomeTeamResult){
    
    newArr.push(match)
  }
})


      




let sortMatchWeek= newArr.reduce((acc,curVal) => {

  let found = acc.find(match => match.matchDay === curVal.matchDay)
  const value = { AwayTeamPrediction: curVal.AwayTeamPrediction,
     AwayTeamResult: curVal.AwayTeamResult
     ,HomeTeamPrediction:curVal.HomeTeamPrediction,
     id:curVal.id,
     HomeTeamName:curVal.HomeTeamName,
     AwayTeamName:curVal.AwayTeamName,
     HomeTeamResult:curVal.HomeTeamResult,matchDay: curVal.matchDay,score:0}


if(!found){
         acc.push({matchDay:curVal.matchDay,data:[value],score:0})
        
}
else{
  found.data.push(value)
}

return acc

        },[])


        let week = []
        sortMatchWeek.map(match => {
          return match.data.map(match => {
          
           week.push(match)
       
          
          })
        })
        
        let data = []
        let win = 0
       let scoreTally = week.reduce((acc,curVal,i) => {
         
            let homePrediction = curVal.HomeTeamPrediction
          let awayPrediction = curVal.AwayTeamPrediction
          let homeScore = curVal.HomeTeamResult
          let awayScore = curVal.AwayTeamResult
          let matchday = curVal.matchDay
        
          let value
          
          if(Number(homePrediction) ==  homeScore  && Number(awayPrediction) == awayScore && homePrediction){
          
            curVal.score = 5
            acc.push(curVal)
            return acc
          }
          if( homePrediction > awayPrediction && homeScore > awayScore && homePrediction ) {
            

            
            
            curVal.score = 3
            
            acc.push(curVal)
           
            
               
   
                     
          
                    }
                    if(homePrediction === undefined){
                      
                      acc.push(curVal)
                    }
                    if(homePrediction > awayPrediction && homeScore < awayScore && homePrediction){
                      curVal.score = 0
                      acc.push(curVal)
                    }
                    if(homePrediction < awayPrediction && homeScore > awayScore && homePrediction){
                      curVal.score = 0
                      acc.push(curVal)
                    }
                    if(homePrediction == awayPrediction && homeScore > awayScore && homePrediction){
                      curVal.score = 0
                      acc.push(curVal)
                    }
                    if(homePrediction == awayPrediction && homeScore < awayScore && homePrediction){
                      curVal.score = 0
                      acc.push(curVal)
                    }
                    if(homePrediction > awayPrediction && homeScore == awayScore && homePrediction){
                      curVal.score = 0
                      acc.push(curVal)
                    }
                    if(homePrediction < awayPrediction && homeScore == awayScore && homePrediction){
                      curVal.score = 0
                      acc.push(curVal)
                    }
                    
                    

                     return acc
        },[])
    
let scoreArr = []


let getGameScore = scoreTally.filter((game) => {
return game.AwayTeamPrediction !== undefined
},[])




    let finals =  scoreTally.reduce((acc,curVal,i) => {
      
   if(!acc[curVal.matchDay] && !undefined ){
    
     acc[curVal.matchDay] = {['score']:curVal.score,matchDay:curVal.matchDay}
   }
   else if(curVal.HomeTeamPrediction !== undefined){
    
     acc[curVal.matchDay].score += 3
    
   }
         return acc
     

       
      

       


       
     },[])
     console.log(finals)
     var res = finals.filter(val => (val!==undefined) && (val!==null))
     console.log(res)
    
     const totalScore = res.reduce((acc,curVal) => {

acc += curVal.score
return acc
     },0)
    
     let users = firebase.firestore().collection('users')
     users.doc(uid).get().then(snapshot => {
      
       users.doc(uid).update({weekscore:res,
      gameScore: getGameScore,
    totalScore:totalScore})
     })
     






        
        
        
      })
      
      })
    }
    }
 



  render() {
   
    return (
     
      <div className="App">
      <div>
      {!this.state.userUid && <LandingPage/>} 
      </div>
      {this.state.userUid ? <div>
        <Navbar/>
        
        <Switch>
      
        <Route exact path="/"  render={(routeProps) => (
          <MatchDayList {...routeProps} uid={this.state.userUid}/>
        )}
        />

        <Route path="/matches/:id"
        render={(routeProps) => (
<Matches {...routeProps} uid={this.state.userUid}/>
    )}
    />
        
        <Route path="/leagues"
        render={(routeProps) => (
          <Table {...routeProps} uid={this.state.userUid}/>
        )}
        />

        <Route path="/home"
        render={(routeProps) => (
          <MatchDayList {...routeProps} uid={this.state.userUid}/>
        )}
        />

        <Route path="/createleague"
        render={(routeProps) => (
<CreateLeague {...routeProps} uid={this.state.userUid}/>
        )}
         />

        <Route path="/league/:id" 
        render={(routeProps) => (
          <CreatedLeague {...routeProps} uid={this.state.userUid}/>
        )}
        />

        </Switch>
      </div> : null}
      </div>
      
    );
  }
}


