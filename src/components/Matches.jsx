import React, { Component } from 'react'
import {getMatches} from '../Api'
import { timingSafeEqual } from 'crypto';
import {gql} from 'apollo-boost'
import{graphql,compose} from 'react-apollo'
import { undefinedVarMessage } from 'graphql/validation/rules/NoUndefinedVariables';
import firebase from "../firebase";
import { withStyles } from "@material-ui/core/styles";
import {
 Grid,
 Card,
 CardContent,
 CardMedia,
 Button,
 Paper
} from "@material-ui/core";

import 'firebase/firestore'
import { combinator } from 'postcss-selector-parser';
import { Object } from 'core-js';
import { throwServerError } from 'apollo-link-http-common';


const styles = {
 changeButton:{
 
  
   padding:'1%',
   marginBottom:'5%'
  
  
 },
 card : {
   marginTop:'2%',
   marginBottom:'2%',
  marginLeft: '20%',
  marginRight:'20%',
  paddingTop:'-5%',
  paddingBottom:'-5%',
 
 
 },
 text:{
   fontFamily:'Maven Pro',
   fontSize:'1.5em',
   marginTop:'5%'
  
 },
 input:{
   border: '0',
   borderBottom: '2px solid blue',
   height: '48px',
   width: '5%',
   margin:'3.5%',
   fontWeight: '500',
   fontSize: '1.3em',
   textAlign: 'center',
  
 },
 greenCard:{
  backgroundColor:'gold',
  marginTop:'2%',
  marginBottom:'2%',
 marginLeft: '25%',
 marginRight:'25%',
 paddingTop:'-5%',
 paddingBottom:'-5%'
},
yellowCard:{
  backgroundColor:'lightGreen',
  marginTop:'2%',
  marginBottom:'2%',
 marginLeft: '25%',
 marginRight:'25%',
 paddingTop:'-5%',
 paddingBottom:'-5%'
},
redCard:{
  backgroundColor:'pink',
  marginTop:'2%',
  marginBottom:'2%',
 marginLeft: '25%',
 marginRight:'25%',
 paddingTop:'-5%',
 paddingBottom:'-5%'
},

}


 
  





class Matches extends Component {

   state={
       
       scheduledDate:'',
       matchDay:[],
       matches:[{}],
       clikedMatchDay : '',
       predictedResults:[],
       errors: [],
      allreadyPredicted:[],
     buttonRender:[],
     changePrediction:{changePress:false,matchId:null},
     finalResults:[],
     finalResultChange:false,
     userId:this.props.uid,
     changePredictionButton:true,
     gameScore:[],
     weekScore:null



      
     }
    
   componentWillMount() {
    
let uid = this.state.userId
     let users = firebase.firestore().collection('users')
     users.doc(uid).get().then((snapshot) => {
     
      
       const getMatchDayPredictions =
      
       snapshot.data().predictedResults !== undefined ? snapshot.data().predictedResults
       .filter(match => {
         return match.matchDay === Number(this.props.match.params.id)
       }) : []

       const getWeekScore =
      
       snapshot.data().weekscore.matchDay === Number(this.props.match.params.id) ? snapshot.data().weekscore
       .filter((match,i) => {
       
         if(match.matchDay === Number(this.props.match.params.id)){
           return match.score
         }
       })[0].score : []
       


     
       const getGameScore =
       snapshot.data().gameScore !== undefined ? snapshot.data().gameScore
       .filter(match => {
         return match.matchDay === Number(this.props.match.params.id)
       }) : []
       this.setState({
predictedResults:getMatchDayPredictions,
gameScore:getGameScore,
weekScore:getWeekScore

       })

      
     
      
      })




       getMatches().then(match => {
         let arr = []
         let finalResults = []
       
        
         match.data.matches.map(status => {
           if(status.status === 'SCHEDULED' && status.matchday == this.props.match.params.id){
            
            
            
              
             arr = [...arr,{scheduledHomeTeam:status.homeTeam.name,
               scheduledAwayTeam:status.awayTeam.name,
               matchId:{id:status.id,HomeTeamPrediction:null,AwayTeamPrediction:null},
               matchDay:status.matchday}]
             
         
           }

           if(status.status === 'FINISHED' && status.matchday == this.props.match.params.id){
            
            
             finalResults=[...finalResults,{
               matchId:{HomeTeamResult:status.score.fullTime.homeTeam,
                 AwayTeamResult:status.score.fullTime.awayTeam,id:status.id,HomeTeamName:status.homeTeam.name,
             AwayTeamName:status.awayTeam.name},matchDay:status.matchday}]

            
           }
         
  
          
         })
        
   
    
           
      
            
            
            
             let combine = {}

             let finalAndPrediction = finalResults.concat(this.state.predictedResults)
             finalAndPrediction.reduce((acc,curVal)=> {
              
                acc.push(combine[curVal.matchId]=curVal.matchId)
                return acc
               

             },[])
            
            
        

           let fullGame = finalResults.concat(this.state.predictedResults)
         

          let gameScores =  fullGame.reduce((acc,curVal) => {
            if(!acc[curVal.matchId.id]){
acc[curVal.matchId.id] = curVal.matchId;
            }
            else{
           
             acc[curVal.matchId.id] = {...acc[curVal.matchId.id],...curVal.matchId}
            }
return acc
          },{})
        
         
          let win = 0
          for(let key in gameScores){
            if(gameScores[key].HomeTeamPrediction !== undefined){
            let homePrediction = gameScores[key].HomeTeamPrediction
            let awayPrediction = gameScores[key].AwayTeamPrediction
            let homeScore = gameScores[key].HomeTeamResult
            let awayScore = gameScores[key].AwayTeamResult
            
            if( homePrediction === awayPrediction && homeScore > awayScore) {
                    win =+ 3
             //     }
            }
            if( homePrediction > awayPrediction && homeScore > awayScore) {
                   win += 3
                 }
                 if( awayPrediction > homePrediction && homeScore < awayPrediction) {
                       win += 3
                    }
           }
          }
          let users = firebase.firestore().collection('users')
          
           users.doc(uid).get().then(snapshot => {
            let weekScore = snapshot.data().weekscore.filter(week => {
            return week.matchDay === Number(this.props.match.params.id)
          })
          
            this.setState({
              weekScore:weekScore[0].score
            })
          })
       
        
        
      










            
         let finalIds=finalResults.map((id,i) => {
          
         
       
    
         })
        
     
    
        

         this.setState({
                   matches:arr,
                   finalResults:finalResults
                 
                 })
                 if(finalResults.length !== 0) {
                   this.setState({finalResultChange:true})
                 }
       })


       getMatches().then(data => {
        
         if(data.matchday === this.props.match.params.id) {
        
         }
       })
     }

  

     handleChange(e,id) {
    
       let value = e.target.value
       let homeOrAway = e.target.name
       let lol = id[e.target.name] = value
    
         this.setState({
           matches:[...this.state.matches]
        })
     }

     handleSubmit(e){
       e.preventDefault()
   
       const arr = []
      
            
       
       let uid = this.state.userId
       let users = firebase.firestore().collection('users')
       users.doc(uid).get().then((snapshot) => {
        
       users.doc(uid).update({
         predictedResults:[...this.state.matches,...snapshot.data().predictedResults]
       })
       users.doc(uid).get().then((snapshot) => {
         
        this.setState({
predictedResults:this.state.matches
        })
        
       })
     })

     
   }

     handleClick(e,state){

let homeChange = state.matchId.HomeTeamPrediction
let awayChange = state.matchId.AwayTeamPrediction
let ids = state.matchId.id


let users = firebase.firestore().collection('users')
   
    
    
     this.setState({changePrediction:{changePress:true,matchId:ids}})
     }

  

     predictionChange(e,match){
       
       let value = e.target.value
       let name = e.target.name
     

     this.setState({
       predictedResults:[...this.state.predictedResults],
       predictionSubmitButton : true,
       changePredictionButton:false
     })




  }

     submitChangedPrediction(e, prediction) {
      
       let uid = this.state.userId
       let users = firebase.firestore().collection('users').doc(uid)
let predictionChange = users.get().then((snapshot) => {
  let takeOutOldPrediction = snapshot.data().predictedResults.filter(game =>  game.matchId.id !== prediction.matchId.id)
 let replacePrediction = [...takeOutOldPrediction, prediction]
  return users.update({'predictedResults':replacePrediction}).then((data) => {
    
    this.setState({predictedResults:this.state.predictedResults,
       predictionSubmitButton : false,
       changePrediction:{changePress:false},
       changePredictionButton:true

     })
   })
  
   
})
     }

   


    
 render() {
   
   return (
     <div>
     {this.state.predictedResults.length < 1 ?
      
       <form onSubmit={(e) => this.handleSubmit(e)}>
    {
     
      this.state.matches.map(match => {
     
      return (
    
     
     <div>{match.matchDay == this.props.match.params.id ?
      
      <Card className={this.props.classes.card}>
       
      {match.scheduledHomeTeam}<input className={this.props.classes.input} onChange={(e) =>this.handleChange(e,match.matchId)} type="text" name="HomeTeamPrediction" required/>
      {match.scheduledAwayTeam}<input className={this.props.classes.input} onChange={(e) =>this.handleChange(e,match.matchId)} type="text" name="AwayTeamPrediction"matchid="@" required/>
      </Card>
     
      :null}</div>
      )
    })
   
    }
    <button >submit predictions</button>
    </form>
       :
this.state.finalResults.length < 1 ?
      <div>
        <h1>My Predictions</h1>
       <div>{this.state.predictedResults.map(prediction => {
   return (
     <div>
    
   <div>
  
  
  




   <Card className={this.props.classes.card}>
   <div>
   <h2 className={this.props.classes.text}>
   {this.state.changePrediction.changePress === true && Number(prediction.matchId.id) == Number(this.state.changePrediction.matchId) && this.state.finalResultChange !== true ?
   <input className={this.props.classes.input} onChange={(e) =>this.predictionChange(e,prediction)} type="text" name="HomeTeamPrediction" placeholder={prediction.matchId.HomeTeamPrediction !== undefined ? prediction.matchId.HomeTeamPrediction : null} required/>
   :null}{`${prediction.scheduledHomeTeam}  ${prediction.matchId.HomeTeamPrediction}
  
   vs
     ${prediction.matchId.AwayTeamPrediction} ${prediction.scheduledAwayTeam}` }{this.state.changePrediction.changePress === true && Number(prediction.matchId.id) == Number(this.state.changePrediction.matchId) ?
       <input className={this.props.classes.input} onChange={(e) =>this.predictionChange(e,prediction)} type="text" name="AwayTeamPrediction" placeholder={prediction.matchId.AwayTeamPrediction} required/>
      
       :null}
     </h2>
     
    
</div>


     {this.state.finalResultChange !== true && this.state.changePredictionButton !== false ?
     <Button className={this.props.classes.changeButton} variant="contained" color="primary"  onClick={(e) => this.handleClick(e,prediction)}>change prediction</Button>
     : null}
   




     {this.state.changePrediction.changePress === true && this.state.finalResultChange !== true
     && Number(prediction.matchId.id) == Number(this.state.changePrediction.matchId)
     && this.state.predictionSubmitButton === true ?
     <Button className={this.props.classes.changeButton} variant="contained" color="primary"  onClick={(e) =>this.submitChangedPrediction(e,prediction)}>submit new Result</Button>
     :null}
     </Card>
     </div>
     </div>
   )
   }) }</div></div>:null}
      
      
      
      
      
      
       {this.state.gameScore.length !== 0 ?
     <div>
      
      <h1>Final Results</h1>
     
      <h1>{`Week score : ${this.state.weekScore} points`}</h1>
       {this.state.gameScore.map(result => {
         
         return (
        
           <div>
           
           <Card className={this.props.classes.card}>
           <CardContent>
           <h1>Your Prediction</h1>
            <h2>{`${result.HomeTeamName} ${result.HomeTeamResult} vs ${result.AwayTeamName} ${result.AwayTeamResult}`}</h2>
           
            </CardContent>
             </Card>
             <Card className={result.score === 3 ? this.props.classes.yellowCard : result.score === 5 ? this.props.classes.greenCard: result.score === 0 ? this.props.classes.redCard: this.props.classes.card}>

             <CardContent>
             <h1>Final Result</h1>
             <h2>{`${result.HomeTeamName} ${result.HomeTeamPrediction} vs ${result.AwayTeamName} ${result.AwayTeamPrediction}`}</h2>
             <h1 >{`${result.score} points`}</h1>
             </CardContent>
             </Card>
             </div>
         )
       })
     }
     </div>
       :null}
    </div>
  
   )
 }

}


export default withStyles(styles)(Matches)


