import { PhotonService } from '../photon.service';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { DatabaseService, userInterface } from '../database.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit, OnDestroy {

    // For halting fetching of photon variables until after user is logged in and we have API parameters
    public userLoggedIn:boolean = false;
    private userLoggedInSource;

    // Define some observers and set some initial values
    public user: userInterface;
    private statusSource;
    public status: string = 'Connecting...';
    private activitySource;
    public activity: string = 'Idle';
    public last: string = '?';

    constructor(private photon: PhotonService, private db: DatabaseService) {
        this.userLoggedInSource = this.db.userLoggedIn;
    }

    ngOnInit() {
        // On component init, wait until user is logged in before executing
        this.userLoggedInSource
            .subscribe(value => {
                if (value === true) { // If user is logged in, get user details
                    this.user = this.db.getUser<userInterface>();
                    let eventsURL = `${this.user['photonApiUrl']}events/${this.user['photonAccessString']}`;
                    
                    // Subscribe to photon events for status and activity
                    this.statusSource = this.photon.watchStatus(eventsURL)
                                        .subscribe(event => {
                                            this.status = event.toString();
                                        });
                    this.activitySource = this.photon.watchActivity(eventsURL)
                                        .subscribe(event => {
                                            this.activity = event.toString();
                                        });
                    // Frequently check to update when last dispense occurred
                    setInterval((() => 
                    {
                        this.photon.getVariable('last')
                        .subscribe(data => this.last = data.toString())
                        })(), 20000); // () makes it call immediately, then every 20 seconds
                }
            })
    }

    ngOnDestroy() {
        // Unsubscribe if the status bar ever disappears--probably not needed, but best to play it safe
        this.statusSource.unsubscribe();
        this.activitySource.unsubscribe();
    }
}
