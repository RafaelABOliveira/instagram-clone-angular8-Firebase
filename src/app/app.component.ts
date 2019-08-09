import { Component, OnInit } from '@angular/core';
import * as firebase from 'firebase';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';

  ngOnInit(): void {

    var config = {
      apiKey: "AIzaSyBCMUn5s0Pb2CAGn-v02dt_fVbMoYkSR6M",
      authDomain: "jta-isntagram-clone.firebaseapp.com",
      databaseURL: "https://jta-isntagram-clone.firebaseio.com",
      projectId: "jta-isntagram-clone",
      storageBucket: "gs://jta-isntagram-clone.appspot.com/",
      messagingSenderId: "1018112800707",
      appId: "1:1018112800707:web:88044df7537d8fa2"
    };
    
    firebase.initializeApp(config)
  }
}
