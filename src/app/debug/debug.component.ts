import { Component, OnInit } from '@angular/core';
import { PhotonService } from '../photon.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

    constructor(private photon: PhotonService) { }
    
        load = () =>this.photon.callFunction('auger', 'load', 'Load');
        in = () => this.photon.callFunction('auger', 'in', 'Pull');
        out = () => this.photon.callFunction('auger', 'out', 'Push');
        inout = () => this.photon.callFunction('auger', 'inout', 'In/Out');
        stop = () => this.photon.callFunction('auger', 'stop', 'Stop');
        test = () => this.photon.callFunction('test', 'auger', 'Test');
        tone = () => this.photon.callFunction('test', 'tone', 'Tone');

    ngOnInit() {
    }

}
