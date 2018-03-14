import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { Event } from '../interfaces';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit, AfterViewChecked {

  events: Event[];

  constructor(
    public dataService: DataService,
    public router: Router
  ) {}

  ngOnInit() {
    /*this.dataService.GetUserFollowedBodiesEvents(
      'fc4bb12b-2b29-4c57-b497-9ca69eef7ed1').subscribe(result => {
        this.events = result.data;
      });*/

      this.dataService.GetAllEvents().subscribe(result => {
          this.events = result.data;
      });
  }

  ngAfterViewChecked() {
    this.dataService.showToolbar = true;
  }

  /** Opens the event-details component */
  OpenEvent(event: Event) {
    this.router.navigate(['/event-details', event.id]);
  }

}
