import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Event } from '../interfaces';
import { Time } from '@angular/common';

const PREV_PAGE = 'calendar';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {
  public venuesList = [];

  public event: Event = {} as Event;

  public start_time = '00:00';
  public end_time = '00:00';

  public networkBusy = false;

  constructor(
    public dataService: DataService,
    public router: Router,
  ) {
    dataService.showToolbar = false;

    /* Load locations */
    dataService.GetAllLocations().subscribe(result => {
      this.venuesList = result.map(r => r.name);
    });

    /* Initialize */
    this.event.start_time = new Date();
    this.event.end_time = new Date();
    this.event.bodies_id = [];
    this.event.venue_names = [''];

  }

  ngOnInit() {
    if (!this.dataService.loggedIn) {
      alert('Please login to continue!');
      this.router.navigate([PREV_PAGE]);
    }
  }

  /** Uses an extremely ugly hack to set time */
  timeChanged() {
    this.setTimeFrom(this.event.start_time, this.start_time);
    this.setTimeFrom(this.event.end_time, this.end_time);
  }

  /**
   * Returns a Date after setting the time from a string
   * @param date Date without proper time
   * @param time Time string HH:MM
   */
  setTimeFrom(date: Date, time: string) {
    date.setHours(
      Number(time.substr(0, 2)),
      Number(time.substr(3, 2)));
    return date;
  }

  uploadImage(files: FileList) {
    if (!this.MarkNetworkBusy()) { return; }

    this.dataService.UploadImage(files[0]).subscribe(result => {
      this.event.image_url = result.picture;
      this.networkBusy = false;
    }, () => {
      this.networkBusy = false;
    });
  }

  /** POSTs to the server */
  create() {
    if (!this.MarkNetworkBusy()) { return; }

    this.timeChanged();
    this.dataService.PostEvent(this.event).subscribe(result => {
      alert(result.name + ' created!');
      this.networkBusy = false;
      this.close();
    }, () => {
      this.networkBusy = false;
    });
  }

  /** Tries to mark the network as busy */
  MarkNetworkBusy(): Boolean {
    if (this.networkBusy) { return false; }
    this.networkBusy = true;
    return true;
  }

  /** Add a new venue */
  AddVenue() {
    this.event.venue_names.push('');
  }

  /** Removes venue at index */
  RemoveVenue(i: number) {
    this.event.venue_names.splice(i, 1);
  }

  /** Navigate back */
  close() {
    this.router.navigate([PREV_PAGE]);
  }

}
