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
        if (this.db.loggedIn()) {
            this.router.events.subscribe((_: NavigationStart) => this.currentUrl.next(_.url));
            return true
        } else {
            this.router.navigate(['/login']);
            this.currentUrl.next('/login');
            return false
        }
    }
}
