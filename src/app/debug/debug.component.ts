import { Component, OnInit } from '@angular/core';
import { PhotonService } from '../photon.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'app-debug',
  templateUrl: './debug.component.html',
  styleUrls: ['./debug.component.scss']
})
export class DebugComponent implements OnInit {

    constructor(private photon: PhotonService) { }
        load() {
            return this.photon.callFunction("auger","load");
        }
        in() {
            return this.photon.callFunction("auger","in");
        }
        out() {
            return this.photon.callFunction("auger","out");
        }
        inout() {
            return this.photon.callFunction("auger","inout");
        }
        stop() {
            return this.photon.callFunction("auger","stop");
        }
        test() {
            return this.photon.callFunction("test","auger");
        }
        tone() {
            return this.photon.callFunction("test","tone");
        }
    ngOnInit() {
    }

}
