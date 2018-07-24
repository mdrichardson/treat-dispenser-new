import { Injectable } from '@angular/core';

export interface userInterface {
	photonDeviceId: string;
	photonAccessToken: string;
	videoUrl: string;
	videoAuthToken: string;
	photonApiUrl: string;
	photonAccessString: string;
}

@Injectable({
  providedIn: 'root'
})

export class DatabaseService {
     constructor() { }

    getUser = <userInterface>() => ({
            photonDeviceId: '380043000d47343432313031',
            photonAccessToken: '60d3db642ac254b2374d2282877a25f1553a2350',
            videoUrl: 'https://localhost:8100/live/0?authToken=',
            videoAuthToken: '45cc4607-3024-44bf-85d4-e6ac879deaa5',
            key_creator: function() {
                this.photonApiUrl = `https://api.particle.io/v1/devices/${this.photonDeviceId}/`;
                this.photonAccessString = `?access_token=${this.photonAccessToken}`;
                delete this.api_holder;
                return this;
            }   
        }).key_creator();
}