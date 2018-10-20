import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { API } from '../../api';

const DEFAULT_USERNAME = 'Guest';
const DEFAULT_LDAP = 'IITB User';
const DEFAULT_PROFILE_PIC = 'assets/useravatar.svg';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  public userName = DEFAULT_USERNAME;
  public ldap = DEFAULT_LDAP;
  public profilePic = DEFAULT_PROFILE_PIC;
  public api = API;

  constructor(
    public dataService: DataService,
    public router: Router,
  ) { }

  ngOnInit() {
    /* Get profile if the user is logged in */
    if (this.dataService.isLoggedIn()) {
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

  /** Open own profile or go to login screen if not logged in */
  OpenMyProfile() {
    if (this.dataService.isLoggedIn()) {
      const user = this.dataService.getCurrentUser();
      const id = user.ldap_id || user.id;
      this.router.navigate(['user', id]);
    } else {
      this.router.navigate(['login']);
    }
  }

}
