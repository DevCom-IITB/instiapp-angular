import { Component, OnInit, AfterViewChecked, ChangeDetectorRef } from '@angular/core';
import { XunkCalendarModule } from 'xunk-calendar';
import { Router } from '@angular/router';
import { DataService } from '../data.service';
import { IEvent } from '../interfaces';
import { MediaMatcher } from '@angular/cdk/layout';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  mobileQuery: MediaQueryList;
  private _mobileQueryListener: () => void;

  public selDate = { date: 1, month: 1, year: 1 };
  public events: IEvent[];
  public selectedEvent: IEvent;

  constructor(
    public router: Router,
    public dataService: DataService,
    public changeDetectorRef: ChangeDetectorRef,
    media: MediaMatcher,
  ) {
    this.mobileQuery = media.matchMedia('(max-width: 767px)');
    this._mobileQueryListener = () => changeDetectorRef.detectChanges();
    this.mobileQuery.addListener(this._mobileQueryListener);
  }

  ngOnInit() {
    this.selDate = XunkCalendarModule.getToday();
    this.dataService.GetAllEvents().subscribe(result => {
      this.events = result.data;
      this.dateChanged(this.selDate);
    });
  }

  /** Opens the event-details component */
  OpenEvent(event: IEvent) {
    this.selectedEvent = event;
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
    if (this.mobileQuery.matches) { return; }
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

}
