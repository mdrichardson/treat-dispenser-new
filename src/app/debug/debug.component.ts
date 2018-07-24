import { Component, OnInit } from '@angular/core';
import { PhotonService } from '../photon.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

    constructor(private photon: PhotonService) { }
   
    load = () => this.photon.callFunction('auger', 'load', 'Load').subscribe();
    in = () => this.photon.callFunction('auger', 'in', 'Pull').subscribe();
    out = () => this.photon.callFunction('auger', 'out', 'Push').subscribe();
    inout = () => this.photon.callFunction('auger', 'inout', 'In/Out').subscribe();
    stop = () => this.photon.callFunction('auger', 'stop', 'Stop').subscribe();
    test = () => this.photon.callFunction('test', 'auger', 'Test').subscribe();
    tone = () => this.photon.callFunction('test', 'tone', 'Tone').subscribe();

    ngOnInit() {
    }

}
