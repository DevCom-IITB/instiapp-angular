import { Component, OnInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { DataService } from '../data.service';
import { MediaMatcher } from '@angular/cdk/layout';
import { EnterRight, EnterLeft } from '../animations';
import { IEvent } from '../interfaces';
import { Router } from '@angular/router';

@Component({
  selector: 'app-event-sidebar-desktop',
  templateUrl: './event-sidebar-desktop.component.html',
  styleUrls: ['./event-sidebar-desktop.component.css'],
  animations: [EnterRight, EnterLeft]
})
export class EventSidebarDesktopComponent implements OnInit, OnChanges {
  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;
  showingEventDetails = false;
  animedEventDetails = false;
  hiddenEventDetails = true;
  eventDetailsId;

  @Input() contentInited = false;
  @Input() event;

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

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.event) { return; }
    if (this.mobileQuery.matches) {
      this.NavigateEventDeatils(this.event);
    } else {
      this.EventDetailsPane();
    }
  }

  /** Navigate to event-details component */
  NavigateEventDeatils(event: IEvent) {
    this.router.navigate(['event', event.str_id]);
  }

  /** Open or update the side event-details pane */
  EventDetailsPane() {
    /* Open the bar for the first time */
    if (!this.showingEventDetails) {
      this.showingEventDetails = true;
      this.eventDetailsId = this.event.id;
      return;
    }

    /* Skip if animating */
    if (!this.animedEventDetails) { return; }

    /* Do some animation */
    this.animedEventDetails = false;
    setTimeout(() => {
      this.hiddenEventDetails = true;
      this.eventDetailsId = this.event.id;
    }, 250);
  }

  /** Animate back in after loading */
  eventDeatilsLoaded(success: boolean) {
    this.hiddenEventDetails = false;
    this.animedEventDetails = true;
  }

  /** boolean to boolean string */
  bstr(b: boolean) {
    return b ? 'true' : 'false';
  }

}
