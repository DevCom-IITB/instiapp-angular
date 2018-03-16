import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Event } from '../interfaces';
import { Time } from '@angular/common';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  public venues = new FormControl();
  public venuesList = [];

  public event: Event = {} as Event;

  public start_time = '00:00';
  public end_time = '00:00';

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

  }

  ngOnInit() {
  }

  /** Uses an extremely ugly hack to set time */
  timeChanged() {
    this.event.start_time.setHours(
      Number(this.start_time.substr(0, 2)),
      Number(this.start_time.substr(3, 2)));
    this.event.end_time.setHours(
      Number(this.end_time.substr(0, 2)),
      Number(this.end_time.substr(3, 2)));
  }

  /** POSTs to the server */
  create() {
    this.timeChanged();
    this.dataService.PostEvent(this.event).subscribe(result => {
      alert(result.name + ' created!');
      this.close();
    });
  }

  /** Navigate back */
  close() {
    this.router.navigate(['calendar']);
  }

}
