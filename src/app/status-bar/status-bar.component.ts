import { Component, OnInit } from '@angular/core';
import { PhotonService } from '../photon.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {

    public last: string = '?';

    constructor(private photon: PhotonService) { }

    ngOnInit() {
        setInterval((() => 
        {
            this.photon.getVariable('last')
            .subscribe(data => this.last = data)
            })(), 20000); // () makes it call immediately, then every 20 seconds
    }
}
