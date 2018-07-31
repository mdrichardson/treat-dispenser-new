import { Injectable } from '@angular/core';
import { HttpInterceptor} from '@angular/common/http';
import { DatabaseService } from './database.service';

@Injectable({
  providedIn: 'root'
})
export class TokenInterceptorService implements HttpInterceptor {

    constructor(private db: DatabaseService) { }


    // Intercept all outgoing HTTP requests so we can add our JWT
    intercept(req, next) {
        // Ignore outgoing requests to particle
        if (req.url.indexOf('particle') === -1) {
            let tokenizedReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${this.db.getToken()}`
            }
        })
            return next.handle(tokenizedReq)
        } else {
            return next.handle(req)
        }
    }

}
