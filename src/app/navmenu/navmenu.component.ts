import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IUserProfile } from '../interfaces';

const DEFAULT_USERNAME = 'Guest';
const DEFAULT_LDAP = 'IITB User';
const DEFAULT_PROFILE_PIC = '/assets/useravatar.jpg';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  public userName = DEFAULT_USERNAME;
  public ldap = DEFAULT_LDAP;
  public profilePic = DEFAULT_PROFILE_PIC;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Get profile if the user is logged in */
    if (this.dataService.loggedIn) {
      this.getUser();
    }

    /* Get profile on login state change */
    this.monitorChange();
  }

  getUser() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.userName = user.name;
      this.ldap = user.roll_no;
      this.profilePic = user.profile_pic;
    });
  }

  /** Monitors change in login state */
  monitorChange() {
    this.dataService.loggedInObservable.subscribe(result => {
      if (result) {
        this.getUser();
      } else {
        this.userName = DEFAULT_USERNAME;
        this.ldap = DEFAULT_LDAP;
        this.profilePic = DEFAULT_PROFILE_PIC;
      }
    });
  }

}
