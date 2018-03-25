import { Component, OnInit } from '@angular/core';
import { IBodyRole, IBody } from '../interfaces';
import { DataService } from '../data.service';
import { API } from '../../api';

@Component({
  selector: 'app-my-events',
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.css']
})
export class MyEventsComponent implements OnInit {

  public roles: IBodyRole[];
  public selIndex = 0;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.FireGET(API.UserMeRoles).subscribe(result => {
      this.roles = result as IBodyRole[];
    });
  }

  /** Returns true if can add event for the given tabindex */
  canAdd(tabindex: number): boolean {
    if (tabindex === 0) { return false; }
    return this.roles[tabindex - 1].permissions.indexOf('AddE') !== -1;
  }

}
