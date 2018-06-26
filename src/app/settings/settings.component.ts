import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IUserProfile } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../api';

@Component({
  selector: 'app-settings',
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.css']
})
export class SettingsComponent implements OnInit {

  public user: IUserProfile;

  constructor(
    public dataService: DataService,
    public snackBar: MatSnackBar,
  ) { }

  ngOnInit() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.user = user;
    });
  }

  /** Logout and show a snackbar */
  logout() {
    return this.dataService.FireGET(API.Logout).subscribe(() => {
      this.dataService.PostLogout();
      this.snackBar.open('Logged Out successfully', 'Dismiss', {
        duration: 2000,
      });
    });
  }

}
