import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { forkJoin } from 'rxjs';
import { PhotonService } from '../photon.service';
import * as moment from 'moment';

interface scheduleInterface {
    time1: {
        on: boolean,
        time: string,
        size: string
    },
    time2: {
        on: boolean,
        time: string,
        size: string
    },
    time3: {
        on: boolean,
        time: string,
        size: string
    },
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
  selector: 'app-schedule-times',
  templateUrl: './schedule-times.component.html',
  styleUrls: ['./schedule-times.component.scss']
})

export class ScheduleTimesComponent implements OnInit, AfterViewInit {

    times:Array<number> = [1, 2, 3]
    public schedule = <scheduleInterface>{};

    constructor(private renderer: Renderer2, private photon: PhotonService) { }

    // Get Schedule values from Photon
    getSchedule = () => {
        forkJoin([
            this.photon.getVariable('scheduleInfo'),
            this.photon.getVariable('scheduleDays')
        ]).subscribe(response => {
            let info = JSON.parse(response['0'].toString());
            let days = JSON.parse(response['1'].toString());
            this.schedule = {
                time1: {
                    on: info.t1on,
                    time: info.t1,
                    size: info.t1s
                },
                time2: {
                    on: info.t2on,
                    time: info.t2,
                    size: info.t2s
                },
                time3: {
                    on: info.t3on,
                    time: info.t3,
                    size: info.t3s
                },
                days: {
                    sun: days.sun,
                    mon: days.mon,
                    tue: days.tue,
                    wed: days.wed,
                    thu: days.thu,
                    fri: days.fri,
                    sat: days.sat,
                }
            }
        })
}

    // Set schedule values on the Photon
    setSchedule = (commandName: string, commandValue: string, notifyTitle: string='') => {
        
    }

    ngOnInit() {
        
  }

    ngAfterViewInit() {
        this.getSchedule();
    }

}
