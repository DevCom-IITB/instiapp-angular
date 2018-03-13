import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-feed',
  templateUrl: './feed.component.html',
  styleUrls: ['./feed.component.css']
})
export class FeedComponent implements OnInit {

  events: Event[];

  constructor(public dataService: DataService) { }

  ngOnInit() {
    this.dataService.GetUserFollowedBodiesEvents(
      'fc4bb12b-2b29-4c57-b497-9ca69eef7ed1').subscribe(result => {
        this.events = result.data;
      });
  }

}
