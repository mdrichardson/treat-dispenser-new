import { Component, OnInit, ViewChildren, QueryList, AfterViewInit, Renderer2 } from '@angular/core';
import { PhotonService } from '../photon.service';

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
                if (propType != 'none') {this.photon.callFunction('setSizes', `${propType},${proportion.nativeElement.id}`, notifyTitle)}
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
            let intervalStart_tmp = (resp_intervals.start.toString().length) == 3 ? `0${resp_intervals.start.toString()}` : resp_intervals.start.toString();
            let intervalEnd_tmp = (resp_intervals.end.toString().length) == 3 ? `0${resp_intervals.end.toString()}` : resp_intervals.end.toString();
            this.intervals.start = new Date(2018, 0, 1, parseInt(intervalStart_tmp.substring(0, 2)), parseInt(intervalStart_tmp.substring(2, 4)));
            this.intervals.end = new Date(2018, 0, 1, parseInt(intervalEnd_tmp.substring(0, 2)), parseInt(intervalEnd_tmp.substring(2, 4)));
        })
    }

    setIntervals = (command: string, notifyTitle: string='') => {
        this.photon.callFunction("setInterval", command, notifyTitle)
        .subscribe(response => {})

        this.getIntervals();
        console.log(this.intervals.SEon);
    }

    ngOnInit() {
    }

    ngAfterViewInit() {
        this.getProportions();
        this.getIntervals();
    }
}
