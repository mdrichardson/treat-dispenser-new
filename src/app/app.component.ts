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

    ngOnInit() {
        
    }
}