import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IUserProfile } from '../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../api';
import { MatSlideToggleChange } from '@angular/material';

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
    this.dataService.setTitle('Settings');
    if (this.dataService.isLoggedIn()) {
      this.user = this.dataService.getCurrentUser();
    }
  }

  /** Logout and show a snackbar */
  logout() {
    return this.dataService.FireGET(API.Logout).subscribe(() => {
      this.dataService.PostLogout();
      this.snackBar.open('Logged out successfully', 'Dismiss', {
        duration: 2000,
      });
    });
  }

  /** Toggle show contact number */
  toggleContact(e: MatSlideToggleChange) {
    e.source.setDisabledState(true);
    this.dataService.FirePATCH(API.UserMe, {
      show_contact_no: e.checked
    }).subscribe((profile: IUserProfile) => {
      this.user = profile;
      this.dataService.updateUser(profile);
      e.source.setDisabledState(false);
    }, () => {
      this.snackBar.open('Updating preferences failed!', 'Dismiss', {
        duration: 2000,
      });
      e.source.checked = this.user.show_contact_no;
      e.source.setDisabledState(false);
    });
  }

}
