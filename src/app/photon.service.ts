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

    // For ensuring we don't try running things until user is logged in and we have API info
    public userLoggedIn:boolean = false;
    private userLoggedInSource;

  	constructor(private http: HttpClient, private notifierService: NotifierService, private db: DatabaseService) {
        this.notifier = notifierService;
        // Once we're logged in, load the user info
        this.userLoggedInSource = this.db.userLoggedIn;
        this.userLoggedInSource
            .subscribe(value => {
                if (value === true) {
                    this.user = this.db.getUser<userInterface>();
                }
            })
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
                map((data: variableResponse) =>
                (variable != 'last' || data.result == '?')
                    ? data.result
                    : moment.unix(parseInt(data.result)).fromNow() // return '* seconds ago'   
            ),
                catchError((error):any => { // catch errors here so we don't have to individually
                    error => {
                        this.throwError(error);
                        return error;
                    }})
                )
               

    // Call functions on the Photon.
  	callFunction(functionName, functionArg, notifyTitle='') {
        if (notifyTitle) {
            this.notifier.notify('default', `Sending ${notifyTitle} command...`);
        } else {
            this.notifier.notify('default', `Sending ${functionArg ? functionName + ' ' + functionArg : functionName} command...`);        
        }
        // Set longer timeout for debugs
        var TimeoutLength = (functionArg.includes('in', 'out', 'inout', 'load') || functionName == 'auger') ? 30000 : 10000;
		if (functionName == 'auger'){
			// Disable auger buttons
		}
		return this.http.post<functionResponse>(
			this.user['photonApiUrl'] + functionName + this.user['photonAccessString'], // URL
			{'arg': functionArg} // Data
        )
        .pipe(
            // timeout(TimeoutLength),
            map((data: functionResponse) => {
                if (data.return_value == 1) {
                    console.log(`${functionName} performed successfully: ${functionArg}`);
                    if (notifyTitle) {
                        this.notifier.notify('success', `${notifyTitle} Success!`);
                    } 
                } else {
                    this.throwError(data, notifyTitle);
                }
                // enable auger buttons
            }),
            catchError((error):any => { // catch errors here so we don't have to individually
                error => {
                    this.throwError(error, notifyTitle);
                    return error;
                }}),
            timeout(TimeoutLength))
        }
    // Server-Sent Event Listeners/Observers for status and activity in status bar
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
