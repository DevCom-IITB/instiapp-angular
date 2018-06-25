import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IUserProfile } from '../interfaces';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public user: IUserProfile;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

}
