import { Component, OnInit, Input, OnChanges } from '@angular/core';
import { Event } from '../interfaces';
import { DataService } from '../data.service';
import { ActivatedRoute, Params, Router } from '@angular/router';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.css']
})
export class EventDetailsComponent implements OnChanges, OnInit {

  @Input() public eventId: string;
  public event: Event;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public router: Router,
  ) {
    dataService.showToolbar = false;
  }

  ngOnChanges() {
    this.refresh();
  }

  ngOnInit() {
    if (!this.eventId) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.eventId = params['id'];
        this.refresh();
      });
    }
  }

  refresh() {
    this.dataService.GetEvent(this.eventId).subscribe(result => {
      this.event = result;
      this.event.venues_str = this.event.venues.map(v => v.name).join(', ');
    });
  }

  closeEventDetails() {
    this.router.navigate(['/feed']);
  }

}
