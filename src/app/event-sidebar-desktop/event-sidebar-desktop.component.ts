import { Component, OnInit, Input, ChangeDetectorRef, OnChanges } from '@angular/core';
import { DataService } from '../data.service';
import { EnterRight, EnterLeft } from '../animations';

@Component({
  selector: 'app-event-sidebar-desktop',
  templateUrl: './event-sidebar-desktop.component.html',
  styleUrls: ['./event-sidebar-desktop.component.css'],
  animations: [EnterRight, EnterLeft]
})
export class EventSidebarDesktopComponent implements OnInit, OnChanges {
  showingEventDetails = false;
  animedEventDetails = false;
  hiddenEventDetails = true;
  eventDetailsId;

  @Input() event;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {
    if (!this.event) { return; }
    this.EventDetailsPane();
  }

  /** Open or update the side event-details pane */
  EventDetailsPane() {
    /* Open the bar for the first time */
    this.showingEventDetails = true;
    this.eventDetailsId = this.event.id;
  }

  /** boolean to boolean string */
  bstr(b: boolean) {
    return b ? 'true' : 'false';
  }

}
