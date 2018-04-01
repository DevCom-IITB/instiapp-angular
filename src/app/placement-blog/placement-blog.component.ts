import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';

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
      this.feed = result;
    });
  }

  openLink(link: string) {
    window.open(link);
  }

}
