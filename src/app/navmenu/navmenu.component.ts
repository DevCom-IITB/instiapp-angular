import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { UserProfile } from '../interfaces';

@Component({
  selector: 'app-navmenu',
  templateUrl: './navmenu.component.html',
  styleUrls: ['./navmenu.component.css']
})
export class NavmenuComponent implements OnInit {

  public userName = 'Guest';
  public ldap = 'IITB User';
  public profilePic: string;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Get profile if the user is logged in */
    if (this.dataService.loggedIn) {
      this.getUser();
    }

    /* Get profile on login state change */
    this.dataService.loggedInObservable.subscribe(() => {
      this.getUser();
    });
  }

  getUser() {
    this.dataService.GetFillCurrentUser().subscribe(user => {
      this.userName = user.name;
      this.ldap = user.roll_no;
      this.profilePic = user.profile_pic;
    });
  }

}
