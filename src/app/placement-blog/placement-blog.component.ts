import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import * as Parser from 'rss-parser';

@Component({
  selector: 'app-placement-blog',
  templateUrl: './placement-blog.component.html',
  styleUrls: ['./placement-blog.component.css']
})
export class PlacementBlogComponent implements OnInit {
  public feed;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.getPlacementRSS().subscribe(result => {
      const parser = new Parser();
      this.feed = parser.parseString(result).__zone_symbol__value;
    });
  }

  openLink(link: string) {
    window.open(link);
  }

}
