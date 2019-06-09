
import * as firebase from 'firebase/app';
import 'firebase/firestore'

  let config = {
    apiKey: "AIzaSyDr6tKboeqdfJTQMB5PTjzPYC56vbjeaN4",
    authDomain: "score-prediction-97432.firebaseapp.com",
    databaseURL: "https://score-prediction-97432.firebaseio.com",
    projectId: "score-prediction-97432",
    storageBucket: "score-prediction-97432.appspot.com",
    messagingSenderId: "1028404240639"
  };

firebase.initializeApp(config)

export default firebase;