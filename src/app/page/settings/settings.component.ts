import { Component, OnInit } from '@angular/core';
import { DataService } from '../../data.service';
import { IUserProfile, INotification } from '../../interfaces';
import { MatSnackBar } from '@angular/material/snack-bar';
import { API } from '../../../api';
import { MatSlideToggleChange } from '@angular/material/slide-toggle';
// import { applySourceSpanToStatementIfNeeded } from '@angular/compiler/src/output/output_ast';

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

  testnotify() {
    return this.dataService.FireGET<INotification[]>(API.TestNotification).subscribe(result => {
      for (const notification of result) {
        if (notification.actor_type.includes('event')) {
          notification.title = notification.actor.name;
          notification.image_url = notification.actor.image_url || notification.actor.bodies[0].image_url;
        } else if (notification.actor_type.includes('newsentry')) {
          notification.title = notification.actor.title;
          notification.image_url = notification.actor.body.image_url;
        } else if (notification.actor_type.includes('blogentry')) {
          notification.title = notification.actor.title;
          notification.image_url = '/../../assets/logo.png';
        }
      }
      this.dataService.notifications = result;
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
