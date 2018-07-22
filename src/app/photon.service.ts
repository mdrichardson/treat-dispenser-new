import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { NotifierService } from 'angular-notifier';
import { DatabaseService, userInterface } from './database.service';
import { Observable } from 'rxjs';
import { timeout, catchError, map } from 'rxjs/operators';
import * as moment from 'moment';

declare var EventSource;

export interface variableResponse {
	cmd: string;
	coreInfo: {
		deviceID: string;
		connected: boolean;
		last_app: string;
		last_handshake_at: string;
		last_heard: string;
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
        published_at: string;
        coreid: string;
    }
}

@Injectable({
  providedIn: 'root'
})

export class PhotonService {

	private readonly notifier: NotifierService;

    public user: userInterface;

  	constructor(private http: HttpClient, private notifierService: NotifierService, private db: DatabaseService) {
		this.notifier = notifierService;
        this.user = db.getUser<userInterface>();
      }
    
    // Handle Errors
	throwError(error: any, notifyTitle: string='') {
		if (notifyTitle) {
			this.notifier.notify(error, `${notifyTitle} Failed :(`);
		}
		console.log(`An error occurred while performing: ${error}`);
		throw error;
	}

	// Get variable values from function. We can't use .subscribe here because it removes async when calling elsewhere
    getVariable = (variable: string) => 
            this.http.get<variableResponse>(this.user['photonApiUrl'] + variable + this.user['photonAccessString'])
            .pipe( // have to user pipe with rxjs operators
                catchError((error):any => { // catch errors here so we don't have to individually
                    error => {
                        this.throwError(error);
                        return error;
                    }}),
                map((data: variableResponse) =>
                    (variable != 'last') // if variable isn't 'last', return result
                        ? data.result
                        : (data.result != '?') // if variable is 'last', return '* seconds ago' or '? if it's unknown
                        ? moment.unix(parseInt(data.result)).fromNow()
                        : data.result)     
                )

    // Call functions on the Photon. We can .subscribe here because we don't need to handle results anywhere else
  	callFunction(functionName, functionArg, notifyTitle='') {
        this.notifier.notify('default', `Sending ${functionArg ? functionArg : functionName} command...`);        
        // Set longer timeout for debugs
        var TimeoutLength = (functionArg.includes('in', 'out', 'inout', 'load') || functionName == 'auger') ? 30000 : 10000;
		if (functionName == 'auger'){
			// Disable auger buttons
		}
		this.http.post<functionResponse>(
			this.user['photonApiUrl'] + functionName + this.user['photonAccessString'], // URL
			{'arg': functionArg} // Data
        )
        .pipe(timeout(TimeoutLength))
        .subscribe(
		data => {
			if (data.return_value == 1) {
                console.log(`${functionName} performed successfully: ${functionArg}`);
				if (notifyTitle) {
					this.notifier.notify('success', `${notifyTitle} Success!`);
				} 
			} else {
                this.throwError(data, notifyTitle);
            }
            // enable auger buttons
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
