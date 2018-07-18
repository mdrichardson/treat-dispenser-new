import { Component, OnInit } from '@angular/core';
import { PhotonService } from '../photon.service';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

    constructor(private photon: PhotonService) { }
        load() {
            return this.photon.callFunction("auger", "load", "Load");
        }
        in() {
            return this.photon.callFunction("auger", "in", "Pull");
        }
        out() {
            return this.photon.callFunction("auger", "out", "Push");
        }
        inout() {
            return this.photon.callFunction("auger", "inout", "In/Out");
        }
        stop() {
            return this.photon.callFunction("auger", "stop", "Stop");
        }
        test() {
            return this.photon.callFunction("test", "auger", "Test");
        }
        tone() {
            return this.photon.callFunction("test", "tone", "Tone");
        }
    ngOnInit() {
    }

}
