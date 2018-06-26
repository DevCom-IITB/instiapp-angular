import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { IEvent } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  public events: IEvent[];
  public selectedEvent: IEvent;
  public error: number;

  constructor(
    public dataService: DataService,
    public router: Router,
  ) { }

  /** Initialize initial list wiht API call */
  ngOnInit() {
    this.dataService.GetAllEvents().subscribe(result => {
        this.events = result.data;
        this.events[0].venues_str = this.events[0].venues.map(v => v.short_name).join(', ');
        if (this.events.length === 0) {
          this.error = 204;
        }
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Opens the event-details component */
  OpenEvent(event: IEvent) {
    if (this.dataService.isMobile()) {
      this.router.navigate(['event', event.str_id]);
    } else {
      this.selectedEvent = event;
    }
  }
}
