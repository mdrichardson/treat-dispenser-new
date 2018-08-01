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

    user: User = new User();

    constructor(private db: DatabaseService, private router: Router) { }

    ngOnInit() {
    
    }

    loginUser() {
        this.db.login(this.user)
        .subscribe(
            res => {
                localStorage.setItem('token', res.token);
                this.router.navigate(['/']);
            },
            err => console.log(err)
        )
    }
}
