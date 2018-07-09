import { Component, OnInit, Input } from '@angular/core';
import { DataService } from '../data.service';
import { IEvent, IEventContainer } from '../interfaces';
import { Router } from '@angular/router';
import * as moment from 'moment';

export const TITLE = 'Feed';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
})
export class FeedComponent implements OnInit {
  @Input() public containers: IEventContainer[];
  @Input() public nobig = false;
  public events: IEvent[];
  public selectedEvent: IEvent;
  public error: number;

  constructor(
    public dataService: DataService,
    public router: Router,
  ) { }

  /** Initialize initial list wiht API call */
  ngOnInit() {
    /* If this is a child component */
    if (this.containers) {
      return;
    }

    /* Set title */
    this.dataService.setTitle(TITLE);

    /* Get all events */
    this.dataService.GetAllEvents().subscribe(result => {
        this.events = result.data;
        if (this.events.length === 0) {
          this.error = 204;
        }
        this.containers = this.MakeContainers(result.data);
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

  /** Makes the events into containers */
  MakeContainers(events: IEvent[]): IEventContainer[] {
    /** Everything is one on mobile */
    if (this.dataService.isMobile()) {
      return [{
        title: '',
        events: events
      }];
    }

    const result: IEventContainer[] = [];

    /** Static first tab */
    result.push({
      title: 'Upcoming',
      events: events.splice(0, 3)
    });

    let prev = {title: this.getDateTitle(events[0]), events: []} as IEventContainer;
    for (const event of events) {
      event.venues_str = event.venues.map(v => v.short_name).join(', ');
      const title = this.getDateTitle(event);
      if (prev.title !== title) {
        result.push(prev);
        prev = {title: title, events: []} as IEventContainer;
      }
      prev.events.push(event);
    }
    return result;
  }

  /** Moment-fy date */
  getDateTitle(event: IEvent): string {
    if (event.start_time) {
      const date = moment(event.start_time);
      return date.format('DD MMM \'YY');
    }
    return 'More';
  }
}
