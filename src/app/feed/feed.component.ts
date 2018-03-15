import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Event } from '../interfaces';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, AfterViewChecked {
  mobileQuery: MediaQueryList;
  events: Event[];
  showingEventDetails = false;
  eventDetailsId;

  private _mobileQueryListener: () => void;

  constructor(
    public dataService: DataService,
    changeDetectorRef: ChangeDetectorRef,
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

  /* Set showToolbar to true when coming to this view */
  ngAfterViewChecked() {
    this.dataService.showToolbar = true;
  }

  /** Opens the event-details component */
  OpenEvent(event: Event) {
    if (this.mobileQuery.matches) {
      this.router.navigate(['/event-details', event.id]);
    } else {
      this.eventDetailsId = event.id;
      this.showingEventDetails = true;
    }
  }
}
