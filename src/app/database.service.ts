import { Injectable } from '@angular/core';

export interface userInterface {
	photonDeviceId: string;
	photonAccessToken: string;
	videoUrl: URL;
	videoAuthToken: string;
	photonApiUrl: URL;
	photonAccessString: string;
}

@Injectable({
  providedIn: 'root'
})
export class DatabaseService {

     constructor() { }

    getUser<user>() {
        // Remove these after implementing database authentication
        const photonDeviceId_tmp = "380043000d47343432313031";
        const photonAccessToken_tmp = "60d3db642ac254b2374d2282877a25f1553a2350";
        const videoUrl_tmp = "https://localhost:8100/live/0?authToken=";
        const videoAuthToken_tmp = "45cc4607-3024-44bf-85d4-e6ac879deaa5";
        const photonApiUrl_tmp = "https://api.particle.io/v1/devices/" + photonDeviceId_tmp + "/";
		const photonAccessString_tmp = "?access_token=" + photonAccessToken_tmp;
		return {
            photonDeviceId: photonAccessString_tmp,
            photonAccessToken: photonAccessToken_tmp,
            videoUrl: videoUrl_tmp,
            videoAuthToken: videoAuthToken_tmp,
            photonApiUrl: photonApiUrl_tmp,
            photonAccessString: photonAccessString_tmp
        }
	}
}
