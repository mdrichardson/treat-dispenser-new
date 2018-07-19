import { Component, OnInit } from '@angular/core';
import { PhotonService } from '../photon.service';
import { DatabaseService } from '../database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})
export class MenuComponent implements OnInit {

    public user:Object;
    private statusSource: Subscription;
    public status:any = 'Connecting...';
    private activitySource: Subscription;
    public activity:any = 'Idle';


    constructor(private photon: PhotonService, private db: DatabaseService) {
        this.user = db.getUser();
    }


    ngOnInit() {
        this.statusSource = this.photon.watchStatus(this.user["photonApiUrl"] + 'events/' + this.user["photonAccessString"])
                            .subscribe(event => {
                                this.status = event;
                            });
        this.activitySource = this.photon.watchActivity(this.user["photonApiUrl"] + 'events/' + this.user["photonAccessString"])
                            .subscribe(event => {
                                this.activity = event;
                            });
    }
}