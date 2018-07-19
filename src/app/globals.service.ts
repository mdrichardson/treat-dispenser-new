import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class Globals {

    status: string;
    activity: string;

    constructor() { }
}
