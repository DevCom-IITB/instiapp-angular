import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

export const TITLE = 'About';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    /* Set title */
    this.dataService.setTitle(TITLE);
  }

}
