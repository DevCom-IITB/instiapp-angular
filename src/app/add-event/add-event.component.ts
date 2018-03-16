import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  venues = new FormControl();
  venuesList = [];

  constructor(
    public dataService: DataService,
    public router: Router,
  ) {
    dataService.showToolbar = false;

    /* Load locations */
    dataService.GetAllLocations().subscribe(result => {
      this.venuesList = result.map(r => r.name);
    });

  }

  ngOnInit() {
  }

  close() {
    this.router.navigate(['calendar']);
  }

}
