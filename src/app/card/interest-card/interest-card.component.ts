import { Component, Input, OnInit } from '@angular/core';
import { IInterest } from '../../interfaces';
import { DataService } from '../../data.service';

@Component({
  selector: 'app-interest-card',
  templateUrl: './interest-card.component.html',
  styleUrls: ['./interest-card.component.css']
})
export class InterestCardComponent implements OnInit {

  @Input() interest: IInterest;
  @Input() overrideClick = false;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set fallback images explictly */

  }

  /** Get the badge for the event */
  getBadge() {
    // return this.event.offered_achievements.length > 0 ? 'assets/badge-medal.png' : null;
  }

  onNoClick() {
    console.log("deleted")
  }

}
