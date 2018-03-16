import { Component, OnInit } from '@angular/core';
import { XunkCalendarModule } from 'xunk-calendar';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public selDate = { date: 1, month: 1, year: 1 };

  constructor() { }

  ngOnInit() {
    this.selDate = XunkCalendarModule.getToday();
  }

  /** Add a new event */
  AddEvent() {
    console.log('Add Event works!');
  }

}
