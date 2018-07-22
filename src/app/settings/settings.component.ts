import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {

    public intervalStartDefault: Date = new Date(2018, 1, 1, 0, 0, 0);

    constructor() { }

    ngOnInit() {
    }

}
