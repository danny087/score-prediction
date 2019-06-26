import React, { Component } from 'react'
import {getMatches} from '../Api'
import firebase from "../firebase";
import { withStyles } from "@material-ui/core/styles";
import { Route, Switch,Link } from "react-router-dom";
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  Paper
} from "@material-ui/core";

class MatchDayList extends Component {
    
    state={
    
        scheduledDate:'',
        matchDay:[],
        matches:[{}],
        clickedMatchDay : null,
        userId : this.props.uid,
        weekScore: [],
        borderLine:null,
        totalScore:0
      }

     
    
    
    componentWillMount() {
   this.setState({
     userId:this.props.uid
   })

        getMatches().then(match => {
        
          let arr = []
          let status = []
          match.data.matches.map(status => {
        
           
              arr.push({matchday:status.matchday,status:status.status})
              
           
            
    
            
          })
        
          let statusAndMatchday =[]
          let matchday = arr.reduce((acc,currVal) => {
          
            if(!acc.includes(currVal.matchday)){
              
              acc.push(currVal.matchday)
              statusAndMatchday.push(currVal.status)
            }
          
            
            
            return acc

            
  


          },[])
        
          
          let statusAndMatchdayObj = statusAndMatchday.map((arr,i) => {
            return {status:arr,matchday:matchday[i]}
          })
          let uid = this.state.userId
         
          let users = firebase.firestore().collection('users')
          
     users.doc(uid).get().then((snapshot) => {
      
      this.setState({
        weekScore:snapshot.data().weekscore,
        totalScore:snapshot.data().totalScore
      })
     })
          
          this.setState({ 
            matchDay:statusAndMatchdayObj
          
        
  
        })
        })
      }

      handleClick(e)  {
const value = e.target.name

this.setState({clickedMatchDay:value})

      }
  render() {

  const splitMatchDay = this.state.matchDay.length / 2
  const firstHalfMatchDay = this.state.matchDay.slice(0,splitMatchDay)
  const secondHalfMatchDay = this.state.matchDay.slice(splitMatchDay)
  const firstSchedule = firstHalfMatchDay.find((match,i) => {
  if(match.status === "SCHEDULED"){
    return match.matchday
  }
  
  
  
})
const secondSchedule = secondHalfMatchDay.find((match,i) => {
  if(match.status === "SCHEDULED"){
    return match.matchday
  }
})
  
  const borderStyle = {
    border: '10px solid pink'
  };
  
    return (
    
      <div className={this.props.classes.container}>
      <h1 className={this.props.classes.weekscore}>{`Total score ${this.state.totalScore}`}</h1>
          <Grid container spacing={2}>
          
          <Grid item md={6} className={this.props.classes.grid}>
          
        {this.state.match !== null ?  firstHalfMatchDay.map((match,i) => {
          
           
            
             return (
                <div>{match   ? 
                  <Card className={ firstSchedule.matchday !== match.matchday ? this.props.classes.card : this.props.classes.cardBorder}>
                  <h1 className={this.props.classes.weekscore}>{match.status !== "SCHEDULED" && this.state.weekScore !== undefined ? `${this.state.weekScore[i] === undefined 
                    ? 'no predictons': 'week score : ' + this.state.weekScore[i].score}`:firstSchedule.matchday === match.matchday ? 'Current Matchday': 'Upcoming'}</h1>
                  {/* <h1>{match.status !== "SCHEDULED" && this.state.weekScore !== undefined}</h1> */}
                <Button  name={match.matchday} >
                <Link className={this.props.classes.link} to={`/matches/${match.matchday}`}>{`Matchday ${match.matchday}`}</Link>
                </Button>
                </Card>
                 : null}</div>
            )}
        ): null}
       
        </Grid>
       
        
        <Grid item md={6} className={this.props.classes.grid}>
        {this.state.match !== null ? secondHalfMatchDay.map((match,i) => {
           
             return (
                <div>{match   ? 
                  <Card className={this.props.classes.card}>
                  <h1 className={this.props.classes.weekscore}>{match.status !== "SCHEDULED" && this.state.weekScore !== undefined ? `${this.state.weekScore[i] === undefined 
                    ? 'no predictons': 'week score : ' + this.state.weekScore[i].score}`:'Upcoming'}</h1>
                  
                <Button  name={match.matchday} >
                <Link className={this.props.classes.link} to={`/matches/${match.matchday}`}>{`Matchday ${match.matchday}`}</Link>
                </Button>
                </Card>
                 : null}</div>
            )}
        ): null}
          
          </Grid>  
          
                </Grid>
      </div>
    )
  }
}



const styles = {
grid:{

},
card:{
marginTop:'5%',
marginBotton:'5%',
paddingTop:'5%',
paddingBotton:'5%',
marginLeft:'5%',
marginRight:'5%'
},
cardBorder:{
  border: '5px solid green',
  marginTop:'5%',
marginBotton:'5%',
paddingTop:'5%',
paddingBotton:'5%',
marginLeft:'5%',
marginRight:'5%'
},
link:{
  textDecoration: 'none',
  fontFamily:'Maven Pro',
  fontSize:'1.4em'
},
container:{
  marginLeft:'10%',
marginRight:'10%'
},
weekscore:{
  fontFamily:'Maven Pro'
}
}

export default withStyles(styles)(MatchDayList);