import { Component, Input, OnInit } from '@angular/core';
import { IEvent } from '../../interfaces';
import { DataService } from '../../data.service';

@Component({
    selector: 'app-event-card',
    templateUrl: './event-card.component.html',
    styleUrls: ['./event-card.component.css'],
    standalone: false
})
export class EventCardComponent implements OnInit {

  @Input() event: IEvent;
  @Input() overrideClick = false;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set fallback images explictly */
    if (this.event && (!this.event.image_url || this.event.image_url === '')) {
      this.event.image_url = this.event.bodies[0].image_url;
    }
  }

  /** Get the badge for the event */
  getBadge() {
    return this.event.offered_achievements.length > 0 ? 'assets/badge-medal.png' : null;
  }

}
