import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

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
