import { Component, OnInit } from '@angular/core';
import { DatabaseService, userInterface } from '../database.service';
import { PhotonService } from '../photon.service';
import { staggerItems } from '../animations/stagger';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { HttpClient, HttpHeaders as Headers } from '@angular/common/http';
import { timeout, catchError, map } from 'rxjs/operators';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
  animations: [staggerItems]
})

export class HomeComponent implements OnInit {

    public userLoggedIn:boolean = false;
    private userLoggedInSource;
    
    private user: userInterface;
    public video: string;
    public videoSafe: SafeResourceUrl;
    public isDemo: boolean;
    public showDemoMessage: boolean = true;

    public augerDisabled:boolean = false;

    public isIEOrEdge;

    constructor(private db: DatabaseService, private photon: PhotonService, public sanitizer: DomSanitizer, private http: HttpClient) {
        this.userLoggedInSource = this.db.userLoggedIn;
    }

    // Functions that correlate to Photon's treat and meal dispense functions.
    // this.augerDisabled disables the buttons that run the auger. They are re-enabled by the Photon service
    treat = () => {
        this.augerDisabled = true;
        this.photon.callFunction('auger', 'treat', 'Treat').subscribe(() => this.augerDisabled = false)
    };
    meal = () => {
        this.augerDisabled = true;
        this.photon.callFunction('auger', 'meal', 'Meal').subscribe(() => this.augerDisabled = false);
    }
    // Check if video is online
    checkVideoAndReturnAppropriateURL = () => {
        // We can't use the regular this.video URL because browser prefetch blocks redirects
        this.http.get('https://syndac.no-ip.biz:8100')
            .pipe(
                timeout(1000),
                catchError(e => {
                    // e.status = 0 when netcam is up and returns a 401 error. There is no e.status when it is totally offline
                    if (e.status !== 0) {
                        this.video = '/assets/offline.png';
                        return null;
                    }
                }),
                map(
                    data => console.log('Data ', data)
                )
            ).subscribe();
        return this.video;
    }

    ngOnInit() {
        this.userLoggedInSource
            .subscribe(value => {
                if (value === true) {
                    this.user = this.db.getUser<userInterface>();
                    this.isDemo = this.user.role == 'demo' ? true : false;
                    // MJpeg doesn't work in IE/Edge, so use the slower OGG video stream if user is on IE/Edge
                    this.isIEOrEdge = /msie\s|trident\/|edge\//i.test(window.navigator.userAgent);
                    // It's okay to reload user data, but don't reload the video URL or it reverts to paused
                    if (!this.video) {
                        this.video = this.user.videoUrl + this.user.videoAuthToken;
                        this.video = this.isIEOrEdge ? this.video.replace('Mjpeg', 'live') : this.video;
                        // Add parameters for autoplay at the end if source if youtube and bypass security
                        this.video = this.video.includes('https://www.youtube.com/embed/') ? this.video + '?rel=0&autoplay=1&mute=1' : this.video;
                        this.videoSafe = this.sanitizer.bypassSecurityTrustResourceUrl(this.video);
                    }
                    // If the video is offline, change URL to offline image
                    this.video = this.checkVideoAndReturnAppropriateURL();
                }
            })
    }

}
