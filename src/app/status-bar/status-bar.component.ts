import { PhotonService } from '../photon.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService, userInterface } from '../database.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit, OnDestroy {

    public user: userInterface;
    private statusSource: Subscription;
    public status: string = 'Connecting...';
    private activitySource: Subscription;
    public activity: string = 'Idle';
    public last: string = '?';

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
        setInterval((() => 
        {
            this.photon.getVariable('last')
            .subscribe(data => this.last = data.toString())
            })(), 20000); // () makes it call immediately, then every 20 seconds
    }

    ngOnDestroy() {
        this.statusSource.unsubscribe();
        this.activitySource.unsubscribe();
    }
}
