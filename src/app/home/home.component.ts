import { Component, OnInit } from '@angular/core';
import { DatabaseService, userInterface } from '../database.service';
import { PhotonService } from '../photon.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})

export class HomeComponent implements OnInit {

    user: userInterface;
    video: string;

    constructor(private db: DatabaseService, private photon: PhotonService) {
        this.user = db.getUser<userInterface>();
        this.video = this.user.videoUrl + this.user.videoAuthToken;
    }

    treat = () =>this.photon.callFunction('auger', 'treat', 'Treat');
    meal = () => this.photon.callFunction('auger', 'meal', 'Meal');

    ngOnInit() {

    }

}
