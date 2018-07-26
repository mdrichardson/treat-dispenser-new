import { Component, OnInit } from '@angular/core';
import { PhotonService } from '../photon.service';
import { staggerItems } from '../animations/stagger';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss'],
  animations: [staggerItems]
})
export class DebugComponent implements OnInit {

    constructor(private photon: PhotonService) { }

    public augerDisabled:boolean = false;
   
    load = () => {
        this.augerDisabled = true;
        this.photon.callFunction('auger', 'load', 'Load').subscribe(() => this.augerDisabled = false);
    }
    in = () => {
        this.augerDisabled = true;
        this.photon.callFunction('auger', 'in', 'Pull').subscribe(() => this.augerDisabled = false);
    }
    out = () => {
        this.augerDisabled = true;
        this.photon.callFunction('auger', 'out', 'Push').subscribe(() => this.augerDisabled = false);
    }
    inout = () => {
        this.augerDisabled = true;
        this.photon.callFunction('auger', 'inout', 'In/Out').subscribe(() => this.augerDisabled = false);
    }
    stop = () => this.photon.callFunction('auger', 'stop', 'Stop').subscribe();
    test = () => this.photon.callFunction('test', 'auger', 'Test').subscribe();
    tone = () => this.photon.callFunction('test', 'tone', 'Tone').subscribe();

    ngOnInit() {
    }

}
