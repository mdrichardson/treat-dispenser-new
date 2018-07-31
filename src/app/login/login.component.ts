import { Component, OnInit } from '@angular/core';
import { DatabaseService } from '../database.service';

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

    constructor(private db: DatabaseService) { }

    ngOnInit() {
    }

    loginUser() {
        this.db.login(this.user)
        .subscribe(
            res => {
                console.log(res);
                localStorage.setItem('token', res.token);
            },
            err => console.log(err)
        )
    }
}
