import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

@Component({
  selector: 'app-add-event',
  templateUrl: './add-event.component.html',
  styleUrls: ['./add-event.component.css']
})
export class AddEventComponent implements OnInit {

  constructor(
    public dataService: DataService,
  ) {
    dataService.showToolbar = false;
  }

  ngOnInit() {
  }

}
