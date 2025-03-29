import { Component, Input, OnInit } from '@angular/core';
import { IBody } from '../../interfaces';
import { DataService } from '../../data.service';

@Component({
    selector: 'app-body-card',
    templateUrl: './body-card.component.html',
    styleUrls: ['./body-card.component.css'],
    standalone: false
})
export class BodyCardComponent implements OnInit {

  @Input() public body: IBody;
  @Input() public subtitle: string;
  @Input() public route: string[];

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    /* Set fallback image explicitly */
    if (this.body && (!this.body.image_url || this.body.image_url === '')) {
      this.body.image_url = 'assets/lotus_placeholder.png';
    }

    /** Set router link */
    if (!this.route) {
      this.route = ['/org', this.body.str_id];
    }
  }

}
