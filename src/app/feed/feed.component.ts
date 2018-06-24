import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IEvent } from '../interfaces';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  events: IEvent[];
  selectedEvent: IEvent;

  constructor(
    public dataService: DataService,
  ) { }

  /** Initialize initial list wiht API call */
  ngOnInit() {
    this.dataService.GetAllEvents().subscribe(result => {
        this.events = result.data;
        this.events[0].venues_str = this.events[0].venues.map(v => v.short_name).join(', ');
    });
  }

  /** Opens the event-details component */
  OpenEvent(event: IEvent) {
    this.selectedEvent = event;
  }
}
