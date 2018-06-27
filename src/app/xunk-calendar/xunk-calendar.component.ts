import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';

@Component({
    selector: 'app-xunk-calendar',
    templateUrl: './xunk-calendar.component.html',
    styleUrls: ['./xunk-calendar.component.css']
  })
  export class XunkCalendarComponent implements OnInit {

    /** Today */
    @Input() public today;

    /** The page open with [xx, month, year] */
    @Input() public openPage;

    /** Currently selected date */
    @Input() public selectedDate;

    /** Array with all the calendar data */
    @Input() public calendar: any[] = [];

    /** Color for heat map */
    @Input() public heatMapColor = '#00ff00';

    /** Color for primary */
    @Input() public primaryColor = '#ff0000';

    /** Color for primary foreground */
    @Input() public primaryForeground = 'white';

    @Input() public heatmap = {};

    /** Emits the new date on change */
    @Output() change: EventEmitter<any> = new EventEmitter();

    private RGB_HM: any;
    private RGB_Primary: any;
    private RGB_Primary_FG: any;

    /** Constants */
    public readonly monthNames =
      [
        'January', 'February', 'March', 'April',
        'May', 'June', 'July', 'August',
        'September', 'October', 'November', 'December'
      ];
    public readonly dayNames =
      [
        'Sunday', 'Monday', 'Tuesday', 'Wednesday',
        'Thrusday', 'Friday', 'Saturday'
      ];

      /* Get RGB from CSS color */
    public static parseColor(input) {
      const div = document.createElement('div');
      div.style.color = input;
      document.body.appendChild(div);
      const m = getComputedStyle(div).color.match(/^rgb\s*\(\s*(\d+)\s*,\s*(\d+)\s*,\s*(\d+)\s*\)$/i);
      document.body.removeChild(div);

      if (m) {
        return {R: m[1], G: m[2], B: m[3]};
      } else {
        throw new Error('Color ' + input + ' could not be parsed.');
      }
    }

    /* Get today's date */
    public static getToday(): any {
      const dateNow = new Date();
      return {
        date: dateNow.getDate(),
        month: dateNow.getMonth(),
        year: dateNow.getFullYear()
      };
    }

    /** Pad number with zeros */
    public static zeropad(num, padlen, padchar = '0'): string {
      const pad_char = typeof padchar !== 'undefined' ? padchar : '0';
      const pad = new Array(1 + padlen).join(pad_char);
      return (pad + num).slice(-pad.length);
    }

    /** CalendarComponent */
    constructor() {
      /* Initialize */
      this.calendar = [];

      this.today = XunkCalendarComponent.getToday();
      this.openPage = {...this.today};
      this.selectedDate = {...this.today};
    }

    ngOnInit() {
      /* Parse colors*/
      this.RGB_HM = XunkCalendarComponent.parseColor(this.heatMapColor);
      this.RGB_Primary = XunkCalendarComponent.parseColor(this.primaryColor);
      this.RGB_Primary_FG = XunkCalendarComponent.parseColor(this.primaryForeground);

      /* Display initial */
      this.displayCalendar();
    }

    /**
     * Returns true if two dates are the same
     * with the date taken separately
     */
    public sameDate(date, a, b): boolean {
      return date === b.date &&
             a.month === b.month &&
             a.year === b.year;
    }

    /** Returns true if fab! */
    public isFab(col: number): string {
      /* Check if date is selected */
      if (this.sameDate(col, this.openPage, this.selectedDate)) {
        return 'primary';
      }

      /* No matches found */
      return '';
    }

    /** Returns 'primary' if col is today */
    isToday(col: number): string {
      if (this.sameDate(col, this.openPage, this.today)) {
        return 'primary';
      }
      return '';
    }

    /** Select a day in the open page */
    public selectDay(col: number) {
      this.selectedDate.date = col;
      this.selectedDate.month = this.openPage.month;
      this.selectedDate.year = this.openPage.year;
      this.change.emit(this.selectedDate);
    }

    /** Change the month +1 or -1 */
    public changeMonth(diff: number) {
      this.openPage.month += diff;

      /* See if the year switches */
      if (this.openPage.month >= 12 ) {
        this.openPage.month = 0;
        this.openPage.year++;
      }

      if (this.openPage.month < 0 ) {
        this.openPage.month = 11;
        this.openPage.year--;
      }

      /* Refresh */
      this.displayCalendar();
    }

    /** Compute the calendar */
    public displayCalendar() {
      /* Generate a new object */
      const newCalendar = [[]];

      const month = this.openPage.month;
      const year = this.openPage.year;

      /* Days in next month, and day of week */
      let col = new Date(year, month, 0).getDay();
      let row = 0, counter = 1;
      const numOfDays = Number(this.getDaysOfMonth(month, year));

      /* Loop to build the calendar body */
      while (counter <= numOfDays) {
         /* When to start new line */
         if (col > 6) {
             col = 0;
             newCalendar[++row] = [];
         }

         /* Set the value and increment */
         newCalendar[row][col++] = counter++;
      }

      /* Set the calendar to the newly computed one */
      this.calendar = newCalendar;
    }

    /** Gets the DaysPerMonth array */
    public getDaysOfMonth(month: number, year: number): number {
      /* Check leap years if February */
      if (month === 1 && this.leapYear(year)) {
        return 29;
      }

      /** Return the number of days */
      return [31, 28, 31, 30, 31, 30,
        31, 31, 30, 31, 30, 31][month];
    }

    /** Returns true if leap year */
    public leapYear(year): boolean {
      return ((year % 4 === 0) && (year % 100 !== 0)) || (year % 400 === 0);
    }

    /** Gets the heat map color */
    public getHM(day): string {
      /* If today */
      if (this.isFab(day)) {
        return `rgb(${this.RGB_Primary.R}, ${this.RGB_Primary.G}, ${this.RGB_Primary.B})`;
      }

      /* Return heatmap color */
      const zeropad = XunkCalendarComponent.zeropad;
      const ind = (zeropad(this.openPage.year, 4) + zeropad(this.openPage.month + 1, 2) + zeropad(day, 2));
      if (ind in this.heatmap) {
        return `rgba(${this.RGB_HM.R}, ${this.RGB_HM.G}, ${this.RGB_HM.B}, ${this.heatmap[ind]})`;
      } else {
        return 'inherit';
      }
    }

    public getForeground(day): string {
      /* If today */
      if (this.isFab(day)) {
        return `rgb(${this.RGB_Primary_FG.R}, ${this.RGB_Primary_FG.G}, ${this.RGB_Primary_FG.B})`;
      }
      if (this.isToday(day)) {
        return `rgb(${this.RGB_Primary.R}, ${this.RGB_Primary.G}, ${this.RGB_Primary.B})`;
      }
      return;
    }
}
