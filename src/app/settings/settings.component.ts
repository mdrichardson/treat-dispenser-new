import { Component, OnInit, AfterViewInit } from '@angular/core';
import { PhotonService } from '../photon.service';
import * as moment from 'moment';
import { staggerItems } from '../animations/stagger';

declare type PropType = 'none' | 'treat' | 'meal';

interface intervalsInterface {
    on: boolean,
    SEon: boolean,
    hours: string,
    minutes: string,
    immediate: boolean,
    start: Date,
    end: Date,
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
  animations: [staggerItems]
})

export class SettingsComponent implements OnInit, AfterViewInit {

    public treatSize: string;
    public mealSize: string;

    public intervals = <intervalsInterface>{};
    private intervalsWarning: boolean = false;
    private intervalsTimeWarning: boolean = false;

    constructor(private photon: PhotonService) { }

    // Get Proportion variables from Photon
    getProportions = () => {
        this.photon.getVariable('sizes')
        .subscribe(response => {
            let sizes = JSON.parse(response.toString());
            this.treatSize = sizes.treat;
            this.mealSize = sizes.meal;
        });
    }
    
    // Set active badge in DOM and set proportion variables on Photon if needed
    setProportions = (propType: PropType, propSize:string, notifyTitle:string ='') => {
        this.photon.callFunction('setSizes', `${propType},${propSize}`, notifyTitle).subscribe(() => this.getProportions())
    }

    // Get interval values from Photon
    getIntervals = () => {
        this.photon.getVariable('intervals')
        .subscribe(response => {
            let resp_intervals = JSON.parse(response.toString());
            // Deal with 24-hour time format from Photon
            let intervalStart_tmp = resp_intervals.start.toString().length == 3 
                                    ? `0${resp_intervals.start.toString()}` 
                                    : resp_intervals.start.toString();
            let intervalEnd_tmp = resp_intervals.end.toString().length == 3 
                                    ? `0${resp_intervals.end.toString()}` // For '0*00' hours
                                    : resp_intervals.end.toString();
            this.intervals = {
                on: resp_intervals.on.toString() == "1" ? true : false,
                SEon: resp_intervals.SE.toString() == "1" ? true : false,
                hours: resp_intervals.hr.toString(),
                minutes: resp_intervals.min.toString(),
                immediate: resp_intervals.imm.toString() == "1" ? true : false,
                start: new Date(2018, 0, 1, 
                        parseInt(intervalStart_tmp.slice(0, 2)), // Hours
                        parseInt(intervalStart_tmp.slice(2, 4))), //Minutes
                end: new Date(2018, 0, 1, 
                    parseInt(intervalEnd_tmp.slice(0, 2)), // Hours
                    parseInt(intervalEnd_tmp.slice(2, 4))), // Minutes
            }
        })
    }

    // Set Interval values on Photon
    setIntervals = (commandName: string, commandValue: string, notifyTitle: string='') => {
        var functionArg;
        var hours;
        var minutes;
        switch(commandName) {
            case 'start':
                hours = parseInt(moment(this.intervals['start']).format('HH'));
                minutes = moment(this.intervals.start).format('mm');
                functionArg = `${commandName},${hours}${minutes}`;
                break;
            case 'end':
                hours = moment(this.intervals.end).format('HH');
                minutes = moment(this.intervals.end).format('mm');
                functionArg = `${commandName},${hours}${minutes}`;
                break;
            case 'on':
                commandValue = this.intervals.on ? '0' : '1'; // Toggle the intervals
                notifyTitle = this.intervals.on ? (notifyTitle + 'Off') : (notifyTitle + 'On');
                functionArg = `${commandName},${commandValue}`;
                break;
            case 'immediate':
                commandValue = this.intervals.immediate ? '0' : '1'; // Toggle immediate dispensing
                notifyTitle = this.intervals.immediate ? notifyTitle + 'Off' : notifyTitle + 'On';
                functionArg = `${commandName},${commandValue}`;
                break;
            case 'hours':
            case 'minutes':
                functionArg = `${commandName},${commandValue}`;
                break;
        }
        // Make sure Start occurs before End
        let dateCompare = moment(new Date(2018, 0, 1, hours, minutes));
        if (moment(this.intervals.end) <= dateCompare && moment(this.intervals.start) >= dateCompare) {
            this.intervalsWarning = true;
        } else {
            this.intervalsWarning = false;
            // Make sure Hours and Minutes aren't both 0 or the photon will dispense continuously
            if (this.intervals.hours == '0' && this.intervals.minutes == '0') {
                this.intervalsTimeWarning = true;
            } else {
                this.intervalsTimeWarning = false;
                this.photon.callFunction("setInterval", functionArg, notifyTitle)
                .subscribe(() => this.getIntervals()) // Make sure we're working with correct data by getting variables again
            }
        }
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getProportions();
        this.getIntervals();
    }
}
