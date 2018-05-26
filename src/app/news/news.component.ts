import { Component, OnInit, HostListener } from '@angular/core';
import { DataService } from '../data.service';
import { API } from '../../api';

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
    this.dataService.FireGET(API.NewsFeed, { from: 0, num: 10}).subscribe(result => {
      this.feed = result;
    });
  }

  openLink(link: string) {
    window.open(link);
  }

  /** Handles loading new data when the user reaches end of page */
  @HostListener('window:scroll', []) onScroll(): void {
    if (this.allLoaded || this.loading) { return; }

    /* Work around browser specific implementations
     * Try documentElement scrollHeight, then body and finally give up */
    let maxScroll = document.documentElement.scrollHeight;
    if (maxScroll === 0) { maxScroll = document.body.scrollHeight; }
    if (maxScroll === 0) { return; }

    if ((window.innerHeight + window.scrollY) >= maxScroll - 60) {
      this.loading = true;
      this.dataService.FireGET<any[]>(API.NewsFeed, { from: this.feed.length, num: 10}).subscribe(result => {
        if (result.length === 0) { this.allLoaded = true; }
        this.feed = this.feed.concat(result);
        this.loading = false;
      }, () => { this.loading = false; });
    }
  }
}
