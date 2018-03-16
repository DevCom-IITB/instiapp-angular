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
  venuesList = ['Extra cheese', 'Mushroom', 'Onion', 'Pepperoni', 'Sausage', 'Tomato'];

  constructor(
    public dataService: DataService,
    public router: Router,
  ) {
    dataService.showToolbar = false;
  }

  ngOnInit() {
  }

  close() {
    this.router.navigate(['calendar']);
  }

}
