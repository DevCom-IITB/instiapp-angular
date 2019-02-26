import { Component, Input, OnInit } from '@angular/core';
import { IBody } from '../interfaces';
import { DataService } from '../data.service';

@Component({
  selector: 'app-body-card',
  templateUrl: './body-card.component.html',
  styleUrls: ['./body-card.component.css']
})
export class BodyCardComponent implements OnInit {

  @Input() public body: IBody;
  @Input() public subtitle: string;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set fallback image explicitly */
    if (this.body && (!this.body.image_url || this.body.image_url === '')) {
      this.body.image_url = 'assets/lotus_placeholder.png';
    }
  }

}
