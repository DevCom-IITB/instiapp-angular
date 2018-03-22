import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { XunkCalendarModule } from 'xunk-calendar';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { IEvent } from '../interfaces';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public selDate = { date: 1, month: 1, year: 1 };
  public events: IEvent[];

  constructor(
    public router: Router,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.selDate = XunkCalendarModule.getToday();
    this.dataService.GetAllEvents().subscribe(result => {
      this.events = result.data;
    });
  }

  /** Add a new event */
  AddEvent() {
    this.router.navigate(['add-event']);
  }

  /** Get events for the date */
  GetDateEvents(date: any): IEvent[] {
    const selEvents: IEvent[] = [] as IEvent[];
    /* Add events for the date */
    for (const event of this.events) {
      const start_date = new Date(event.start_time);
      const end_date = new Date(event.end_time);
      if (date.month === start_date.getMonth() &&
          date.year === start_date.getFullYear() &&
          (start_date.getDate() <= date.date && end_date.getDate() >= date.date)
        ) {
          selEvents.push(event);
      }
    }
    return selEvents;
  }

  /** Gets human readable human count */
  GetCount(date: any): string {
    const count = this.GetDateEvents(date).length;
    let prefix: string;
    if (count === 0) {
      prefix = 'No Events';
    } else if (count === 1) {
      prefix = '1 Event';
    } else {
      prefix = count + ' Events';
    }

    /* Return with 'today' if date is today */
    const now = new Date();
    if (date.date === now.getDate() &&
        date.month === now.getMonth() &&
        date.year === now.getFullYear()) {
          return prefix + ' Today';
    } else {
      return prefix;
    }
  }

  /** Open an event */
  openEvent(event: IEvent): void {
    this.router.navigate(['event-details', event.id]);
  }

}
