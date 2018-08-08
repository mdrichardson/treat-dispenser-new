import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';
import { Router } from '@angular/router';

class User {
    constructor(
        public username:string = '',
        public password:string = ''
    ) {}
}

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss']
})
export class LoginComponent implements OnInit {

    public user: User = new User();
    public invalidLogin: boolean = false;

    constructor(private db: DatabaseService, private router: Router) { }

    ngOnInit() {
    
    }

    // Log in using the Express API, then set the token in LocalStorage and navigate home
    loginUser() {
        this.db.login(this.user)
        .subscribe(
            res => {
                localStorage.setItem('token', res.token);
                this.router.navigate(['/']);
                this.invalidLogin = false;
            },
            // Display invalid user/pass error as applicable
            err => {
                console.log(err);
                this.invalidLogin = true;
                }
        )
    }
}
