import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { DataService } from '../../data.service';

@Component({
    selector: 'app-event-sidebar-desktop',
    templateUrl: './event-sidebar-desktop.component.html',
    styleUrls: ['./event-sidebar-desktop.component.css'],
    standalone: false
})
export class EventSidebarDesktopComponent implements OnInit, OnChanges {
  showingEventDetails = false;
  showingGroupDetails = false;
  animedEventDetails = false;
  hiddenEventDetails = true;
  eventDetailsId;
  groupDetailsId;

  @Input() event;
  @Input() group;
  @Input() isgrouppage;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
  }

  ngOnChanges() {

    if (this.event) { this.EventDetailsPane(); }
    if (this.isgrouppage || this.group) { this.GroupDetailsPane(); }

    if (!this.event && !this.group) { return; }


  }

  /** Open or update the side event-details pane */
  EventDetailsPane() {
    /* Open the bar for the first time */
    this.showingEventDetails = true;
    this.eventDetailsId = this.event.id;
  }

  GroupDetailsPane() {
    this.showingGroupDetails = true;
    this.groupDetailsId = this.group.id;

  }

  /** boolean to boolean string */
  bstr(b: boolean) {
    return b ? 'true' : 'false';
  }

}
