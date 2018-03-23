import { Component, OnInit, Input, OnChanges, EventEmitter, Output } from '@angular/core';
import { IEvent } from '../interfaces';
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

  public event: IEvent;

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

  markInterested(e) {
    let status = 1;
    if (this.dataService.InterestedEvent(this.event.id) && !e.checked) {
      status = 0;
    }
    this.dataService.MarkUES(this.event, status).subscribe();
  }

  markGoing(e) {
    let status = 2;
    if (this.dataService.GoingEvent(this.event.id) && !e.checked) {
      status = 0;
    }
    this.dataService.MarkUES(this.event, status).subscribe();
  }

  /** Navigate back to feed (should be changed to last page) */
  closeEventDetails() {
    this.dataService.navigateBack();
  }

  openEventEdit() {
    this.router.navigate(['edit-event', this.event.id]);
  }

}
