import { Component, Input, OnInit } from '@angular/core';
import { IInterest } from '../../interfaces';
import { DataService } from '../../data.service';
import { UserDetailsComponent } from '../../page/user-details/user-details.component';
import { ActivatedRoute, Router } from '@angular/router';
import { MatSnackBar } from '@angular/material/snack-bar';

@Component({
  selector: 'app-interest-card',
  templateUrl: './interest-card.component.html',
  styleUrls: ['./interest-card.component.css']
})
export class InterestCardComponent implements OnInit {

  @Input() interest: IInterest;
  @Input() overrideClick = false;
  @Input() canDelete = false;
  @Input() deleteMethod: Function;

  constructor(
    public dataService: DataService,
    public activateRoute: ActivatedRoute,
    public snakbar: MatSnackBar,
    public router: Router,
  ) { }

  ngOnInit() {
    /* Set fallback images explictly */

    // console.log(this.canDelete)s
  }

  /** Get the badge for the event */
  getBadge() {
    // return this.event.offered_achievements.length > 0 ? 'assets/badge-medal.png' : null;
  }

  onNoClick(interest: IInterest) {
    if (this.deleteMethod) {
      this.deleteMethod(interest);
      return;
    }
    const myCompOneObj = new UserDetailsComponent(this.activateRoute, this.dataService, this.snakbar, this.router);
    // console.log(interest)
    myCompOneObj.deleteInterest(interest);
  }
}


