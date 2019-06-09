import React, { Component } from 'react'
import firebase from "../firebase";
import { makeStyles } from '@material-ui/core/styles';
import { withStyles } from "@material-ui/core/styles";
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import {
  Grid,
  Card,
  CardContent,
  CardMedia,
  Button,
  
} from "@material-ui/core";






const styles ={
table:{
  marginLeft:'25%',
  marginRight:'25%',
  marginTop:'5%'
}
}


class CreatedLeague extends Component {

  state = {
    userId:this.props.uid,
    userInfo:null,
    member:null,
    scoreCount : {}
  }
  componentWillMount(){
let uid = this.state.userId


let replaceHash = this.props.match.params.id.replace(/\-/g, ' ')


firebase.firestore().collection('leagues').where('leagueName', '==',this.props.match.params.id.replace(/\-/g, ' '))
.get().then(snapshot => {
 
  let leagueMembersArr = []
  let leagueMembers = snapshot.docs.map(leagues => {
    
      leagues.data().members.map(member => {
       
        leagueMembersArr.push(member)
      })
    
  })
 
 firebase.firestore().collection('users').get().then(snapshot => {
   
   let newArr = []
   return snapshot.docs.map(user => {
  
     if(leagueMembersArr.includes(user.id) === true) {
      

      
      
      return user.data()
     }
     else if(this.props.uid === user.id){
      
      this.setState({
        member : false
      })
      
     }
})
   }).then(response => {
  
  let users = response.filter(member => {
  
   return member !== undefined
    
  })
  
this.setState({
  userInfo:users,
  member:leagueMembersArr.includes(uid) ?  true : false
})

})

})
firebase.firestore().collection('users').get().then(snapshot => {
  let user = snapshot.docs.filter(user => {
    return user.id === uid
  })
 
  const scoreObj ={
    threePoints:0,
    fivePoints:0
  }
  const countScoresObj = user[0].data().gameScore.reduce((acc,curVal) => {

if(!acc[curVal.score]){
acc[curVal.score] = 1
}
else{
acc[curVal.score]  += 1
}
return acc
},{})

firebase.firestore().collection('users')
      .doc(uid).update({rightPredictionCount:countScoresObj})
      firebase.firestore().collection('users')
      .doc(uid).get().then(snapshot => {

this.setState({
  rightPredictionCount:snapshot.data().rightPredictionCount
})
      })


})
  }

  

  
  
  handleClick(e){
    let uid = this.state.userId
    let urlParam = this.props.match.params.id.replace(/\-/g, ' ')
    firebase.firestore().collection('leagues')
    .where('leagueName', '==',urlParam).get().then(snapshot => {
      let league = snapshot.docs.map(league => {
        
        return league.data()
      })

      league[0].members.push(uid)
      

      let leagueId = snapshot.docs[0].id
      
      firebase.firestore().collection('users')
      .doc(uid).update({leagues:[snapshot.docs[0].id]})
      
      firebase.firestore().collection('leagues')
      .doc(snapshot.docs[0].id).update({members:league[0].members})
      
      

      firebase.firestore().collection('users').get().then(snapshot => {
        return snapshot.docs.map(user =>{
         return user.data()
            
         
        })
      }).then(response => {
       
let userArr = []
        response.map(user => {
          
          if(user.leagues.includes(leagueId)){
            userArr.push(user)
          }
        })
        this.setState({
          userInfo:userArr,
          member : true
        })
      })
   })
  }


  leaveLeague(e){
    let uid = this.state.userId
    let urlParam = this.props.match.params.id.replace(/\-/g, ' ')
   
    firebase.firestore().collection('leagues')
    .where('leagueName', '==',urlParam).get().then(snapshot => {
      
      this.setState({leagueId : snapshot.docs[0].id})
      let league = snapshot.docs.map(league => {
        
        return league.data()
      })
      let deleteUser = league[0].members.filter(userId => {
        
        return userId !== uid
      })
     
      firebase.firestore().collection('leagues').doc(snapshot.docs[0].id).update({members:deleteUser})
      firebase.firestore().collection('users').doc(uid).get().then(snapshot => {
        
        let removeId = snapshot.data().leagues.filter(leagueId => {
         
          return leagueId !== this.state.leagueId
        })
        

        firebase.firestore().collection('users')
        .doc(uid).update({leagues:removeId})
       
        return firebase.firestore().collection('leagues').doc(this.state.leagueId).get().then(snapshot=> {
          
          if(snapshot.data().members.length === 0){
            
          
          
          
            this.setState({
              member:false,
             userInfo:[]
              
            })
          
          
           

            return null
        
          }
         else{
          return snapshot.data().members
         }
        }).then(response => {
       
          return response !== null ? firebase.firestore().collection('users').get().then(snapshot => {
          
  let userInfo = snapshot.docs.filter(user => {

    if(response.includes(user.id) === true){
      
  return user.data()
    }
  })
  
  this.setState({
    member:false,
   userInfo:[userInfo[0].data()]
    
  })
          }):null
        })
        
        
      })
      
  })
}




  
  
  
  
  render() {
   
   
    const createData = (score) => {
      return score;
    }

    const rows = this.state.userInfo !== null ? this.state.userInfo.map(user => {
     
      return [user.totalScore,user.username,user.rightPredictionCount['3'],user.rightPredictionCount['5']]
      
    }) : null
  
    
    return (
      <div>
        {this.state.userInfo !== null ? 
        
        
          <Paper className={this.props.classes.table}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>UserName</TableCell>
                  <TableCell align="right">Right Result</TableCell>
                  <TableCell align="right">Right Score</TableCell>
                  <TableCell align="right">Total Score</TableCell>
                  
                </TableRow>
              </TableHead>
              <TableBody>
                {rows.map(row => (
                  
                  <TableRow >
                    
                    <TableCell component="th" scope="row">
                    {console.log(row)}
                    {row[1]}
                    </TableCell>
                    <TableCell align="right">{row[2]}</TableCell>
                    <TableCell align="right">{ row[3] === undefined ? 0 : row[3]}</TableCell>
                    <TableCell align="right">{row[0]}</TableCell>
                    
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </Paper>
        : null}
      {this.state.member === false ?
      <button onClick={(e) => this.handleClick(e)}>join</button>
      : this.state.member === true ? 
    <Button variant="contained" color="primary" onClick={(e) =>this.leaveLeague(e)}>leave league</Button>
    :null}
      </div>
    )
    
  }
}

export default withStyles(styles)(CreatedLeague);