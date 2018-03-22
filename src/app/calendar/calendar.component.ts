import { Component, OnInit, AfterViewChecked } from '@angular/core';
import { XunkCalendarModule } from 'xunk-calendar';
import { Router } from '@angular/router';
import { DataService } from '../data.service';

@Component({
  selector: 'app-calendar',
  templateUrl: './calendar.component.html',
  styleUrls: ['./calendar.component.css']
})
export class CalendarComponent implements OnInit {

  public selDate = { date: 1, month: 1, year: 1 };

  constructor(
    public router: Router,
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.selDate = XunkCalendarModule.getToday();
  }

  /** Add a new event */
  AddEvent() {
    this.router.navigate(['add-event']);
  }

}
