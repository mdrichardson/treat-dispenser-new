import { Component, OnInit } from '@angular/core';
import { DatabaseService, userInterface } from './database.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: [
      './app.component.scss']
})

export class AppComponent implements OnInit{

    user: Object;

    constructor(private db:DatabaseService) {
        this.user = db.getUser<userInterface>();
    }

    // source = new EventSource(this.user['photonApiUrl'] + "events" + this.user['photonAccessString']);
    // source.addEventListener('status', function(event) {
    //         event = JSON.parse(event['data']);
    //         console.log(event['data']);
    //         setStatus(event['data'])
    //     });
    //     source.addEventListener('activity', function(event) {
    //         event = JSON.parse(event['data']);
    // this.statusSource.subscribe(
    //     // data => this.setStatus(data)
    // )
    

    ngOnInit() {
        
    }
}