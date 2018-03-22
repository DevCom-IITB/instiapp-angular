import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Event } from '../interfaces';
import { MediaMatcher } from '@angular/cdk/layout';
import { EnterLeft, EnterRight } from '../animations';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css'],
  animations: [EnterLeft, EnterRight]
})
export class FeedComponent implements OnInit {
  mobileQuery: MediaQueryList;
  events: Event[];
  showingEventDetails = false;
  animedEventDetails = false;
  hiddenEventDetails = true;
  eventDetailsId;

  private _mobileQueryListener: () => void;

  constructor(
    public dataService: DataService,
    public changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
    public router: Router,
  ) {
      this.mobileQuery = media.matchMedia('(max-width: 767px)');
      this._mobileQueryListener = () => changeDetectorRef.detectChanges();
      this.mobileQuery.addListener(this._mobileQueryListener);
  }

  /** Initialize initial list wiht API call */
  ngOnInit() {
    /*this.dataService.GetUserFollowedBodiesEvents(
      'fc4bb12b-2b29-4c57-b497-9ca69eef7ed1').subscribe(result => {
        this.events = result.data;
      });*/

      this.dataService.GetAllEvents().subscribe(result => {
          this.events = result.data;
          this.events.forEach(ev => {
            ev.venues_str = ev.venues.map(v => v.name).join(', ');
          });
      });
  }

  /** Opens the event-details component */
  OpenEvent(event: Event) {
    if (this.mobileQuery.matches) {
      this.NavigateEventDeatils(event);
    } else {
      /* Check if the event is already open */
      if (this.eventDetailsId === event.id) { return; }

      this.EventDetailsPane(event);
    }
  }

  /** Navigate to event-details component */
  NavigateEventDeatils(event: Event) {
    this.dataService.FillGetEvent(event.id).subscribe(() => {
      this.router.navigate(['/event-details', event.id]);
    });
  }

  /** Open or update the side event-details pane */
  EventDetailsPane(event: Event) {
    /* Open the bar for the first time */
    if (!this.showingEventDetails) {
      this.showingEventDetails = true;
      this.eventDetailsId = event.id;
      return;
    }

    /* Skip if animating */
    if (!this.animedEventDetails) { return; }

    /* Do some animation */
    this.animedEventDetails = false;
    setTimeout(() => {
      this.hiddenEventDetails = true;
      this.eventDetailsId = event.id;
    }, 250);
  }

  /** Animate back in after loading */
  eventDeatilsLoaded(success: boolean) {
    this.hiddenEventDetails = false;
    this.animedEventDetails = true;
  }

  /** any as boolean */
  abln(a: any): boolean {
    return a;
  }

  /** boolean to boolean string */
  bstr(b: boolean) {
    return b ? 'true' : 'false';
  }
}
