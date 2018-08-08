import { Component, OnInit } from '@angular/core';
import { faGithub, faLinkedin } from '@fortawesome/free-brands-svg-icons';
import { faEnvelope } from '@fortawesome/free-regular-svg-icons';
import { staggerItems } from '../animations/stagger';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.scss'],
  animations: [staggerItems]
})
export class ContactComponent implements OnInit {

    faGithub = faGithub;
    faLinkedin = faLinkedin;
    faEnvelope = faEnvelope;

    constructor() { }

    ngOnInit() {
    }

}
