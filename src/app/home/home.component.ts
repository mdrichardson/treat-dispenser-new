import { Component, OnInit } from '@angular/core';
import { DatabaseService, userInterface } from '../database.service'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

    user: userInterface;
    video: string;

    constructor(private db: DatabaseService) {
        this.user = db.getUser<userInterface>();
        this.video = this.user.videoUrl + this.user.videoAuthToken;
    }

    ngOnInit() {

    }

}
