import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { JwtHelperService } from '@auth0/angular-jwt';
import { BehaviorSubject } from 'rxjs';

export interface userInterface {
    username: string;
    role: string;
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

    private loginUrl = 'https://treat.mdrichardson.net:3000/api/login'; // Be sure to change once deployed live
    public user: userInterface;
    private token: string;
    // Create observable for whether user is logged in or not
    private userLoggedInSource = new BehaviorSubject(false);
    public userLoggedIn = this.userLoggedInSource.asObservable();

    constructor(private http: HttpClient, public jwt: JwtHelperService) {
    }
    
    // Log user in via Mongoose API
    login = (user) => this.http.post<any>(this.loginUrl, user);

    // Verify that user is logged in AND that their JWT is valid
    loggedIn = () => {
        const token: string = this.jwt.tokenGetter()
        if (!token) {
            this.userLoggedInSource.next(false);
            return false
        }
        const tokenExpired: boolean = this.jwt.isTokenExpired(token)
        if (!tokenExpired) {
            this.getUser();
            this.userLoggedInSource.next(true);
        }
        return !tokenExpired
    }

    // Fetch user's token from localStorage
    getToken(): string {
        if (!this.token) {
          this.token = localStorage.getItem('token');
        }
        return this.token;
      }

    // Decode user's information from JWT and set to this.user
    getUser = <userInterface>() => {
        const token = this.getToken();
        if (token) {
            let decoded = this.jwt.decodeToken(token);
            this.user = {
                username: decoded.username,
                role: decoded.role,
                photonDeviceId: decoded.photonDeviceId,
                photonAccessToken: decoded.photonAccessToken,
                videoUrl: decoded.videoUrl,
                videoAuthToken: decoded.videoAuthToken,
                photonApiUrl: decoded.photonApiUrl,
                photonAccessString: decoded.photonAccessString,
            }
            return this.user
        }
        return null
    }
}