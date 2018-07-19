import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Time } from '../../node_modules/@angular/common';
import { NotifierService } from 'angular-notifier';
import { DatabaseService, userInterface } from './database.service';
import { Observable } from 'rxjs';
import { timeout } from 'rxjs/operators';

declare var EventSource;

export interface variableResponse {
	cmd: string;
	coreInfo: {
		deviceID: string;
		connected: boolean;
		last_app: string;
		last_handshake_at: Time;
		last_heard: Time;
		product_id: number;
	};
	name: string;
	result: string;
}

interface functionResponse {
	id: string;
	connected: boolean;
	last_app: string;
	return_value: number;
}

interface eventResponse {
    event: string;
    data: {
        data: string;
        ttl: number;
        published_at: Time;
        coreid: string;
    }
}

@Injectable({
  providedIn: 'root'
})

export class PhotonService {

	private readonly notifier: NotifierService;

    public user;

  	constructor(private http: HttpClient, notifierService: NotifierService, private db: DatabaseService) {
		this.notifier = notifierService;
        this.user = db.getUser<userInterface>();
      }
    
	// Handle Errors
	throwError(error, notifyTitle="") {
		if (notifyTitle != "") {
			this.notifier.notify("error", notifyTitle + " Failed :(");
		}
		console.log('An error occurred while performing: ', error);
		throw error;
	}

	// Get variable values from function
  	getVariable(variable) {
		this.http.get<variableResponse>(this.user["photonApiUrl"] + variable + this.user["photonAccessString"])
		.subscribe(
			data => {
				return data.result;
			},
			error => {
				this.throwError(error);
			}
		  )
		}
  	callFunction(functionName, functionArg, notifyTitle="") {
        this.notifier.notify("default", "Connecting...")
        // Set longer timeout for debugs
        var timeoutLength = 10000;
        if (functionArg.includes('in', 'out', 'inout', 'load') || functionName == 'auger') {
            timeoutLength = 30000;
        }
		if (functionName == 'auger'){
			// Disable auger buttons
		}
		this.http.post<functionResponse>(
			this.user["photonApiUrl"] + functionName + this.user["photonAccessString"], // URL
			{"arg": functionArg} // Data
        )
        .pipe(timeout(10000))
        .subscribe(
		data => {
			if (data.return_value == 1) {
				console.log(functionName + ' performed successfully: ' + functionArg);
				if (notifyTitle != "") {
					this.notifier.notify("success", notifyTitle + " Success!");
				} else {
					this.throwError(data, notifyTitle);
				}
			// Remove auger disable class
			}
		}, 
		error => {
			this.throwError(error)
		}
    )}
    // Server-Sent Event Listeners/Observers
    watchStatus(url: string): Observable<eventResponse> {
        return new Observable<eventResponse>(obs => {
            const source = new EventSource(url);
            source.addEventListener('status', (event) => {
                obs.next(JSON.parse(event.data).data);
            });
            return () => source.close();
        });
    }
    watchActivity(url: string): Observable<eventResponse> {
        return new Observable<eventResponse>(obs => {
            const source = new EventSource(url);
            source.addEventListener('activity', (event) => {
                obs.next(JSON.parse(event.data).data);
            });
            return () => source.close();
        });
    }
}
