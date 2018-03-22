import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
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
  @Output() public load = new EventEmitter<boolean>();

  public event: Event;

  constructor(
    private activatedRoute: ActivatedRoute,
    public dataService: DataService,
    public router: Router,
  ) {}

  /** Refresh the component whenever passed eventId changes */
  ngOnChanges() {
    this.refresh();
  }

  /** Check if called with a url and update */
  ngOnInit() {
    if (!this.eventId) {
      this.activatedRoute.params.subscribe((params: Params) => {
        this.eventId = params['id'];
        this.refresh();
      });
    }
  }

  /** Call the events API and show data */
  refresh() {
    this.dataService.FillGetEvent(this.eventId).subscribe(result => {
      this.event = result;
      this.load.emit(true);
    }, () => {
      this.load.emit(false);
    });
  }

  /** Navigate back to feed (should be changed to last page) */
  closeEventDetails() {
    this.router.navigate(['feed']);
  }

  openEventEdit() {
    this.router.navigate(['edit-event', this.event.id]);
  }

}
