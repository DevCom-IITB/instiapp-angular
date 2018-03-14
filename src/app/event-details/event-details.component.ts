import { Component, OnInit, Input } from '@angular/core';
import { Event } from '../interfaces';
import { DataService } from '../data.service';
import { ActivatedRoute, Params } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnInit {

  @Input() public eventId: string;
  public event: Event;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
  ) {
    dataService.showToolbar = false;
  }

  ngOnInit() {
    this.activatedRoute.params.subscribe((params: Params) => {
      if (!this.eventId && params['id']) {
        this.eventId = params['id'];
      }
    });

    this.dataService.GetEvent(this.eventId).subscribe(result => {
      this.event = result;
    });
  }

}
