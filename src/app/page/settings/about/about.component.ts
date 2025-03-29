import { Component, OnInit } from '@angular/core';
import { DataService } from '../../../data.service';
import { environment } from '../../../../environments/environment';

export const TITLE = 'About';

@Component({
    selector: 'app-about',
    templateUrl: './about.component.html',
    styleUrls: ['./about.component.css'],
    standalone: false
})
export class AboutComponent implements OnInit {

  public VERSION = environment.VERSION;

  constructor(
    public dataService: DataService
  ) { }

  ngOnInit() {
    /* Set title */
    this.dataService.setTitle(TITLE);
  }

}
