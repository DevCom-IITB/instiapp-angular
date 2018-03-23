import { Component, OnInit, Input } from '@angular/core';
import { IUserProfile } from '../interfaces';

@Component({
  selector: 'app-user-card',
  templateUrl: './user-card.component.html',
  styleUrls: ['./user-card.component.css']
})
export class UserCardComponent implements OnInit {

  @Input() profile: IUserProfile;
  @Input() role: string;

  constructor() { }

  ngOnInit() {
  }

}
