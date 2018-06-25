import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { XunkCalendarModule } from 'xunk-calendar';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { IEvent, IEnumContainer } from '../interfaces';
import { MediaMatcher } from '@angular/cdk/layout';
import { Helpers } from '../helpers';
import { API } from '../../api';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {
  public selDate = { date: 1, month: 1, year: 1 };
  public events: IEvent[];
  public selectedEvent: IEvent;

  constructor(
    public router: Router,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.selDate = XunkCalendarModule.getToday();

    /* Get dates for filtering (3 months) */
    const initial = new Date();
    initial.setMonth(initial.getMonth() - 1);
    const istr = initial.toJSON().toString();

    const final = new Date();
    final.setMonth(final.getMonth() + 1);
    const fstr = final.toJSON().toString();

    this.dataService.FireGET<IEnumContainer>(API.EventsFiltered, {start: istr, end: fstr}).subscribe(result => {
      this.events = result.data;
      this.dateChanged(this.selDate);
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

  /** Open the first event on date change */
  dateChanged(date: any) {
    if (this.dataService.isMobile()) { return; }
    const selEvents = this.GetDateEvents(date);
    if (selEvents.length > 0) {
      this.selectedEvent = selEvents[0];
    }
  }

  /** Gets human readable human count */
  GetCount(date: any): string {
    /* Return with 'today' if date is today */
    const now = new Date();
    if (date.date === now.getDate() &&
        date.month === now.getMonth() &&
        date.year === now.getFullYear()) {
          return this.GetCountPrefix(date) + ' Today';
    } else {
      return this.GetCountPrefix(date);
    }
  }

  /** Gets prefix of count */
  GetCountPrefix(date: any): string {
    const count = this.GetDateEvents(date).length;
    if (count === 0) {
      return 'No Events';
    } else if (count === 1) {
      return '1 Event';
    } else {
      return count + ' Events';
    }
  }

  dateToDate(date: any): Date {
    const ans = new Date();
    ans.setDate(date.date);
    ans.setMonth(date.month);
    ans.setFullYear(date.year);
    return ans;
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

}
