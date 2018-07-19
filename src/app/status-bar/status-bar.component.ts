import { Component, OnInit } from '@angular/core';
import { PhotonService, variableResponse } from '../photon.service';
import { DatabaseService } from '../database.service';

@Component({
  selector: 'app-status-bar',
  templateUrl: './status-bar.component.html',
  styleUrls: ['./status-bar.component.scss']
})
export class StatusBarComponent implements OnInit {

    public last:any = '?';

    constructor(private photon: PhotonService, private db:DatabaseService) { }

    ngOnInit() {
        this.photon.getVariable('last').subscribe(
			data => this.last = data )}
}
