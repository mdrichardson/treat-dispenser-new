import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { PhotonService } from '../photon.service';
import * as moment from 'moment';

declare type PropType = 'none' | 'treat' | 'meal';

export interface intervalsInterface {
    on?: boolean,
    SEon?: boolean,
    start?: Date,
    end?: Date,
    hours?: string,
    minutes?: string,
    immediate?: boolean
}

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})

export class SettingsComponent implements OnInit, AfterViewInit {

    public treatSize: string;
    public mealSize: string;

    public intervals: intervalsInterface = {};
    private intervalsWarning: boolean;

    @ViewChildren('treatProportion') treatProportions: QueryList<any>;
    @ViewChildren('mealProportion') mealProportions: QueryList<any>;
    

    constructor(private renderer: Renderer2, private photon: PhotonService) { }

    // Get Proportion variables from Photon
    getProportions = () => {
        this.photon.getVariable('sizes')
        .subscribe(response => {
            let sizes = JSON.parse(response.toString());
            this.treatSize = sizes.treat;
            this.mealSize = sizes.meal;
            this.setProportions(this.treatProportions,this.treatSize, 'none');
            this.setProportions(this.mealProportions,this.mealSize, 'none');
        });
    }
    
    // Set active badge in DOM and set proportion variables on Photon if needed
    setProportions = (proportionList: QueryList<any>, activeId: string, propType: PropType='none', notifyTitle:string ='') => {
        proportionList.forEach(proportion => {
            if (proportion.nativeElement.id == activeId) {
                this.renderer.addClass(proportion.nativeElement, 'active');
                if (propType != 'none') {this.photon.callFunction('setSizes', `${propType},${proportion.nativeElement.id}`, notifyTitle).subscribe()}
            } else {
                this.renderer.removeClass(proportion.nativeElement, 'active')
            } 
        })
    }

    // Get interval values from Photon
    getIntervals = () => {
        this.photon.getVariable('intervals')
        .subscribe(response => {
            let resp_intervals = JSON.parse(response.toString());
            this.intervals.on = resp_intervals.on.toString() == "1" ? true : false;
            this.intervals.SEon = resp_intervals.SE.toString() == "1" ? true : false;
            this.intervals.minutes = resp_intervals.min.toString();
            this.intervals.hours = resp_intervals.hr.toString();
            this.intervals.immediate = resp_intervals.imm.toString() == "1" ? true : false
            // Deal with 24-hour time format from Photon
            let intervalStart_tmp = resp_intervals.start.toString().length == 3 
                                    ? `0${resp_intervals.start.toString()}` 
                                    : resp_intervals.start.toString();
            let intervalEnd_tmp = resp_intervals.end.toString().length == 3 
                                    ? `0${resp_intervals.end.toString()}` // For '0*00' hours
                                    : resp_intervals.end.toString();
            this.intervals.start = new Date(2018, 0, 1, 
                                    parseInt(intervalStart_tmp.slice(0, 2)), // Hours
                                    parseInt(intervalStart_tmp.slice(2, 4))); //Minutes
            this.intervals.end = new Date(2018, 0, 1, 
                                    parseInt(intervalEnd_tmp.slice(0, 2)), // Hours
                                    parseInt(intervalEnd_tmp.slice(2, 4))); // Minutes
        })
    }

    setIntervals = (commandName: string, commandValue: string, notifyTitle: string='') => {
        var functionArg;
        var hours;
        var minutes;
        switch(commandName) {
            case 'start':
                hours = parseInt(moment(this.intervals.start).format('HH'));
                minutes = moment(this.intervals.start).format('mm');
                functionArg = `${commandName},${hours}${minutes}`;
                break;
            case 'end':
                hours = moment(this.intervals.end).format('HH');
                minutes = moment(this.intervals.end).format('mm');
                functionArg = `${commandName},${hours}${minutes}`;
                break;
            case 'on':
                switch(commandValue) {
                    case 'intervals':
                    commandValue = this.intervals.on ? '0' : '1' // Toggle the intervals
                    notifyTitle = this.intervals.on ? notifyTitle + 'Off' : notifyTitle + 'On'
                }
                break;
            case 'immediate':
                commandValue = this.intervals.immediate ? '0' : '1' // Toggle immediate dispensing
                notifyTitle = this.intervals.immediate ? notifyTitle + 'Off' : notifyTitle + 'On'
            default:
                functionArg = `${commandName},${commandValue}`;
                break;
        }
        // Make sure Start occurs before End
        let dateCompare = moment(new Date(2018, 0, 1, hours, minutes));
        if (moment(this.intervals.end) <= dateCompare && moment(this.intervals.start) >= dateCompare) {
            this.intervalsWarning = true;
        } else {
            this.intervalsWarning = false;
            this.photon.callFunction("setInterval", functionArg, notifyTitle)
                .subscribe(() => this.getIntervals()) // Make sure we're working with correct data by getting variables again
        }
    }

    test = () => console.log("test worked")

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getProportions();
        this.getIntervals();
    }
}
