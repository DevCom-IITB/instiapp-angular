import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { DataService } from '../../data.service';
import { IEvent, IEnumContainer } from '../../interfaces';
import { Helpers } from '../../helpers';
import { API } from '../../../api';
import { Observable } from 'rxjs';
import { XunkCalendarComponent } from '../../comp/xunk-calendar/xunk-calendar.component';

interface XDate {
  date: number;
  month: number;
  year: number;
}

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public selDate: XDate = { date: 1, month: 1, year: 1 };
  public events: IEvent[];
  public selectedEvent: IEvent;
  public error: number;
  public hasEventsMonths: any[] = [];

  constructor(
    public router: Router,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set title */
    this.dataService.setTitle('Calendar');

    /* Initialize selected date */
    this.selDate = XunkCalendarComponent.getToday();

    /* Get dates for filtering (3 months) */
    this.fetchEventsForMonth(this.selDate).subscribe(result => {
      this.updateEvents(result.data, this.selDate);
      this.dateChanged(this.selDate);
    }, (e) => {
      this.error = e.status;
    });
  }

  /** Opens the event-details component */
  OpenEvent(event: IEvent) {
    if (this.dataService.isMobile()) {
      this.router.navigate(['event', event.str_id]);
    } else {
      this.selectedEvent = event;
    }
  }

  /** Get events for the date */
  GetDateEvents(date: XDate): IEvent[] {
    const selEvents: IEvent[] = [] as IEvent[];
    const cDate: Date = this.xdateToDate(date);

    /* Add events for the date */
    for (const event of this.events) {
      const start_date = this.zeroTime(new Date(event.start_time));
      const end_date = this.zeroTime(new Date(event.end_time));

      if (start_date <= cDate && end_date >= cDate) {
          selEvents.push(event);
      }
    }

    return selEvents;
  }

  /** Open the first event on date change */
  dateChanged(date: XDate) {
    if (this.dataService.isMobile()) { return; }
    const selEvents = this.GetDateEvents(date);
    if (selEvents.length > 0) {
      this.selectedEvent = selEvents[0];
    }
  }

  /** Gets human readable human count */
  GetCount(date: XDate): string {
    /* Return with 'today' if date is today */
    if (this.zeroTime(new Date()).valueOf() === this.xdateToDate(date).valueOf()) {
      return this.GetCountPrefix(date) + ' Today';
    } else {
      return this.GetCountPrefix(date);
    }
  }

  /** Gets prefix of count */
  GetCountPrefix(date: XDate): string {
    const count = this.GetDateEvents(date).length;
    if (count === 0) {
      return 'No Events';
    } else if (count === 1) {
      return '1 Event';
    } else {
      return count + ' Events';
    }
  }

  /** Convert a custom date object to a Date object */
  xdateToDate(date: XDate): Date {
    return this.zeroTime(new Date(date.year, date.month, date.date));
  }

  /** Sets the time of date to zero for comparison */
  zeroTime(date: Date): Date {
    date.setHours(0, 0, 0, 0);
    return date;
  }

  /** Gets the heat map for all events */
  getHeatMap() {
    const heatmap = {};
    /* Fill all events */
    for (const event of this.events) {
      const res = this.dateToString(event.start_time);
      if (res in heatmap) {
        heatmap[res] += 0.2;
      } else {
        heatmap[res] = 0.2;
      }
    }
    return heatmap;
  }

  /** Date to string for heatmap */
  dateToString(date: Date) {
    date = new Date(date);
    return Helpers.zeroPad(date.getFullYear(), 4) +
           Helpers.zeroPad((date.getMonth() + 1).toString(), 2) +
           Helpers.zeroPad(date.getDate().toString(), 2);
  }

  /** Update on changing month */
  monthChanged(e) {
    /* Check if we already have the month */
    const monthstring = JSON.stringify(this.resetMonth(e));
    if (!this.hasEventsMonths.includes(monthstring)) {
      /* Get new events */
      this.fetchEventsForMonth(e).subscribe(result => {
        this.updateEvents(result.data, e);
      });
    }
  }

  /** Update events to main directory */
  updateEvents(events: IEvent[], monthObj: XDate) {
    /* Mark that we have this month now */
    const monthstring = JSON.stringify(this.resetMonth(monthObj));
    this.hasEventsMonths.push(monthstring);

    /* Check for first update */
    if (!this.events) {
      this.events = events;
      return;
    }

    /* Get list of ids we already have */
    const haveIds = this.events.map(e => e.id);

    /* Push all events */
    for (const event of events) {
      if (!haveIds.includes(event.id)) {
        this.events.push(event);
      }
    }
  }

  /** Get a new object with Date of month object to 1 */
  resetMonth(monthObj: XDate): XDate {
    /** Set date to 1 */
    const monthStart = {...monthObj};
    monthStart.date = 1;
    return monthStart;
  }

  /** Get events for month with date */
  fetchEventsForMonth(monthObj: XDate): Observable<IEnumContainer> {
    /* Get initial and final date objects */
    const monthStart = this.resetMonth(monthObj);
    const initial = this.xdateToDate(monthStart);
    const final = this.xdateToDate(monthStart);
    initial.setDate(initial.getDate() - 1);
    final.setMonth(final.getMonth() + 1);

    /* Get the events */
    return this.fetchEventsForDate(initial, final);
  }

  /** Get events between dates */
  fetchEventsForDate(initial: Date, final: Date): Observable<IEnumContainer> {
    const istr = initial.toJSON().toString();
    const fstr = final.toJSON().toString();
    return this.dataService.FireGET<IEnumContainer>(API.EventsFiltered, {start: istr, end: fstr});
  }

}
