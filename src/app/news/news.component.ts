import { Component, OnInit } from '@angular/core';
import { DataService } from '../data.service';
import { API } from '../../api';
import { ChangeEvent } from 'angular2-virtual-scroll';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit {
  public feed;
  loading = false;
  allLoaded = false;

  constructor(
    public dataService: DataService,
  ) { }

  ngOnInit() {
    this.dataService.FireGET(API.NewsFeed).subscribe(result => {
      this.feed = result;
    });
  }

  openLink(link: string) {
    window.open(link);
  }

  onListChange(event: ChangeEvent) {
    if (event.end !== this.feed.length || this.allLoaded) { return; }
    this.loading = true;
    this.dataService.FireGET<any[]>(API.NewsFeed, { from: this.feed.length, num: 10}).subscribe(result => {
      if (result.length === 0) { this.allLoaded = true; }
      this.feed = this.feed.concat(result);
      this.loading = false;
    }, () => { this.loading = false; });
  }

}
