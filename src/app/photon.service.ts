import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Time } from '../../node_modules/@angular/common';
import { NotifierService } from 'angular-notifier';
import { DatabaseService, userInterface } from './database.service';

interface variableResponse {
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

@Injectable({
  providedIn: 'root'
})

export class PhotonService {

	private readonly notifier: NotifierService;

	user: Object;

  	constructor(private http: HttpClient, private data: PhotonService, notifierService: NotifierService, private db: DatabaseService) {
		this.notifier = notifierService;
		this.user = db.getUser();
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
		if (functionName == 'auger'){
			// Disable auger buttons
		}
		this.http.post<functionResponse>(
			this.user["photonApiUrl"] + functionName + this.user["photonAccessString"], // URL
			{"arg": functionArg} // Data
		).subscribe(
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
}
