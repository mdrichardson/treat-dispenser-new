import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Time } from '../../node_modules/@angular/common';

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

  constructor(private http: HttpClient, private data: PhotonService) { }
  
	// Remove these after implementing database authentication
	userProfile = {
		photonDeviceId: "380043000d47343432313031",
		photonAccessToken: "60d3db642ac254b2374d2282877a25f1553a2350",
		videoUrl: "https://localhost:8100/live/0?authToken=",
		videoAuthToken: "45cc4607-3024-44bf-85d4-e6ac879deaa5"
	}

	photonApiUrl: string = "https://api.particle.io/v1/devices/" + this.userProfile.photonDeviceId + "/"; 
	photonAccessString: string =   "?access_token=" + this.userProfile.photonAccessToken

	// Handle Errors
	throwError(error) {
		console.log('An error occurred while performing: ', error);
		throw error;
	}

	// Get variable values from function
  	getVariable(variable) {
		this.http.get<variableResponse>(this.photonApiUrl + variable + this.photonAccessString)
		.subscribe(
			data => {
				return data.result;
			},
			error => {
				this.throwError(error);
			}
		  )
		}
  	callFunction(functionName, functionArg) {
		if (functionName == 'auger'){
			// Disable auger buttons
		}
		this.http.post<functionResponse>(
			this.photonApiUrl + functionName + this.photonAccessString, // URL
			{"arg": functionArg} // Data
		).subscribe(
		data => {
			if (data.return_value == 1) {
				console.log(functionName + ' performed successfully: ' + functionArg);
			} else {
				this.throwError(data);
			}
			// Remove auger disable class
		}, 
		error => {
			this.throwError(error)
		}
	)
}
}
