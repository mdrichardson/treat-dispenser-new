import { Component, OnInit, OnDestroy } from '@angular/core';
import { PhotonService } from '../photon.service';
import { DatabaseService, userInterface } from '../database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit, OnDestroy {

    public user: userInterface;
    private statusSource: Subscription;
    public status: string = 'Connecting...';
    private activitySource: Subscription;
    public activity: string = 'Idle';


    constructor(private photon: PhotonService, private db: DatabaseService) {
        this.user = db.getUser<userInterface>();
    }


    ngOnInit() {
        let eventsURL = `${this.user['photonApiUrl']}events/${this.user['photonAccessString']}`;

        this.statusSource = this.photon.watchStatus(eventsURL)
                            .subscribe(event => {
                                this.status = event.toString();
                            });
        this.activitySource = this.photon.watchActivity(eventsURL)
                            .subscribe(event => {
                                this.activity = event.toString();
                            });
    }

    ngOnDestroy() {
        this.statusSource.unsubscribe();
        this.activitySource.unsubscribe();
    }
}