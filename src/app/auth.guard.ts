import { Injectable } from '@angular/core';
import { CanActivate, Router, NavigationStart } from '@angular/router';
import { DatabaseService } from './database.service';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

    public currentUrl = new Subject();
  
    constructor(private db: DatabaseService, private router: Router) { }

    canActivate(): boolean {
        // Check to see if we're logged in with a valid token using DatabaseService 
        if (this.db.loggedIn()) {
            // Once we're logged in, start tracking current route so we can activate/highlight menu items
            this.router.events.subscribe((_: NavigationStart) => this.currentUrl.next(_.url));
            return true
        } else {
            // Remove token and navigate to login page if not authorized
            localStorage.removeItem('token')
            this.router.navigate(['/login']);
            this.currentUrl.next('/login');
            return false
        }
    }
}
