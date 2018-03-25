import { Component, OnInit } from '@angular/core';
import { IBodyRole } from '../interfaces';
import { DataService } from '../data.service';
import { API } from '../../api';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  roles: IBodyRole[];

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.FireGET(API.UserMeRoles).subscribe(result => {
      this.roles = result as IBodyRole[];
    });
  }

}
