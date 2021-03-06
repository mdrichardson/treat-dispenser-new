import { Component, OnInit, AfterViewInit } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PhotonService } from '../photon.service';
import * as moment from 'moment';
import { staggerItems } from '../animations/stagger';

interface scheduleInterface {
    on: boolean,
    times: [
        {t1: {
            on: boolean,
            time: Date,
            size: string // 0 for treat, 1 for meal
        }},
        {t2: {
            on: boolean,
            time: Date,
            size: string
        }},
        {t3: {
            on: boolean,
            time: Date,
            size: string
        }}
    ]
    days: {
        sun: boolean,
        mon: boolean,
        tue: boolean,
        wed: boolean,
        thu: boolean,
        fri: boolean,
        sat: boolean,
    }
}

@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
  styleUrls: ['./schedule.component.scss'],
  animations: [staggerItems]
})

export class ScheduleTimesComponent implements OnInit, AfterViewInit {

    public schedule = <scheduleInterface>{ times:[], days:{}}; // Must be initiated with child keys

    public scheduleWarning:boolean = false; // Whether or not to display invalid schedule warning in DOM

    constructor(private photon: PhotonService) { }

    // Get Schedule values from Photon
    getSchedule = () => {
        forkJoin([
            this.photon.getVariable('scheduleInfo'),
            this.photon.getVariable('scheduleDays')
        ]).subscribe(response => {
            let info = JSON.parse(response['0'].toString());
            let days = JSON.parse(response['1'].toString());
            // Deal with 24-hour time format from Photon
            let t1_time = info.t1.toString().length == 3 
                                    ? `0${info.t1.toString()}` 
                                    : info.t1.toString();
            let t2_time = info.t2.toString().length == 3 
                                    ? `0${info.t2.toString()}` 
                                    : info.t2.toString();
            let t3_time = info.t3.toString().length == 3 
                                    ? `0${info.t3.toString()}` 
                                    : info.t3.toString();
            // Input all data into this.schedule
            this.schedule = {
                on: info.on.toString() == "1" ? true : false,
                times: [
                    {t1: {
                        on: info.t1on.toString() == "1" ? true : false,
                        size: info.t1s, 
                        time: new Date(2018, 0, 1, 
                            parseInt(t1_time.slice(0, 2)), // Hours
                            parseInt(t1_time.slice(2, 4))), //Minutes
                    }},
                    {t2: {
                        on: info.t2on.toString() == "1" ? true : false,
                        size: info.t2s,
                        time: new Date(2018, 0, 1, 
                            parseInt(t2_time.slice(0, 2)), // Hours
                            parseInt(t2_time.slice(2, 4))), //Minutes
                    }},
                    {t3: {
                        on: info.t3on.toString() == "1" ? true : false,
                        size: info.t3s,
                        time: new Date(2018, 0, 1, 
                            parseInt(t3_time.slice(0, 2)), // Hours
                            parseInt(t3_time.slice(2, 4))), //Minutes
                    }},
                ],
                days: {
                    sun: days.sun.toString() == "1" ? true : false,
                    mon: days.mon.toString() == "1" ? true : false,
                    tue: days.tue.toString() == "1" ? true : false,
                    wed: days.wed.toString() == "1" ? true : false,
                    thu: days.thu.toString() == "1" ? true : false,
                    fri: days.fri.toString() == "1" ? true : false,
                    sat: days.sat.toString() == "1" ? true : false,
                }
            }
        }) 
    }

    // Set schedule values on the Photon
    setSchedule = (commandName: string, commandValue: string='', notifyTitle: string='') => {
        var functionArg;
        switch(commandName) {
            // Handle changing of schedule times
            case 't1':
            case 't2':
            case 't3':
                if (commandValue != '0' && commandValue != '1') {
                    let hours = parseInt(moment(this.schedule.times[Number(commandName.slice(1)) - 1][commandName].time).format('HH'));
                    let minutes = moment(this.schedule.times[Number(commandName.slice(1)) - 1][commandName].time).format('mm');
                    notifyTitle = notifyTitle + hours.toString() + minutes;
                    commandValue = `${hours}${minutes}`;
                }
                break;
            // Handle whether schedule, each time, and each day is on
            case 'on':
                switch(commandValue) {
                    case 'schedule':
                        commandValue = this.schedule.on ? '0' : '1'; // Toggle the schedule
                        notifyTitle = this.schedule.on ? notifyTitle + 'Off' : notifyTitle + 'On';
                        break;
                    case 't1':
                    case 't2':
                    case 't3':
                        commandName = commandValue + 'on';
                        notifyTitle = this.schedule.times[Number(commandValue.slice(1)) - 1][commandValue].on ? notifyTitle + commandValue.slice(1) +' Off' : notifyTitle + commandValue.slice(1) + ' On';
                        commandValue = this.schedule.times[Number(commandValue.slice(1)) - 1][commandValue].on ? '0' : '1'; // Toggle time1, etc
                        break;
                    default: // For days
                        commandName = commandValue;
                        notifyTitle = this.schedule.days[commandValue] ? notifyTitle + 'Off' : notifyTitle + 'On';
                        commandValue = this.schedule.days[commandValue] ? '0' : '1'; // Toggle day on/off
                        console.log(this.schedule.days[commandName], commandValue)
                        break;
                }
        }
        // Make sure time 1, time 2, and/or time 3 aren't equal to each other. Display warning and don't execute if so
        let time1 = moment(this.schedule.times[0].t1.time).format('HHmm');
        let time2 = moment(this.schedule.times[1].t2.time).format('HHmm');
        let time3 = moment(this.schedule.times[2].t3.time).format('HHmm');
        if (time1 == time2 || time1 == time3 || time2 == time3) {
                this.scheduleWarning = true;
            } else {
                functionArg = `${commandName},${commandValue}`;
                this.scheduleWarning = false;
                this.photon.callFunction("setSchedule", functionArg, notifyTitle)
                    .subscribe(() => this.getSchedule()) // Make sure we're working with correct data by getting variables again
            }
    }

    ngOnInit() {
        
  }

    ngAfterViewInit() {
        this.getSchedule();
    }

}
