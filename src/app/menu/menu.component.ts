import { Component, OnInit } from '@angular/core';
import { AuthGuard } from '../auth.guard';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss']
})

export class MenuComponent implements OnInit {

    currentUrl: string;

    // Sets currentUrl via AuthGuard in order to highlight/activate menu items
    constructor(private auth: AuthGuard) {
        auth.currentUrl.subscribe((url: any) => {
            this.currentUrl = url;
        }
        );
    }

    ngOnInit() {
        
    }
}