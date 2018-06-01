import { Component, OnInit, HostListener, OnDestroy } from '@angular/core';
import { DataService } from '../data.service';
import { API } from '../../api';
import { Helpers } from '../helpers';
import { noop } from 'rxjs';
import { INewsEntry } from '../interfaces';

@Component({
  selector: 'app-news',
  templateUrl: './news.component.html',
  styleUrls: ['./news.component.css']
})
export class NewsComponent implements OnInit, OnDestroy {
  public feed: INewsEntry[];
  loading = false;
  allLoaded = false;

  constructor(
    public dataService: DataService,
  ) { }

  public reactions = [
    {id: 0, 'i': 'thumbsup'},
    {id: 1, 'i': 'heart'},
    {id: 2, 'i': 'laughing'},
    {id: 3, 'i': 'open_mouth'},
    {id: 4, 'i': 'disappointed'},
    {id: 5, 'i': 'angry'},
  ];

  ngOnInit() {
    this.dataService.FireGET<INewsEntry[]>(API.NewsFeed, { from: 0, num: 10}).subscribe(result => {
      this.feed = result;
    });

    /** Lazy load on scroll to bottom */
    this.dataService.scrollBottomFunction = () => { this.lazyLoad(); };

  }

  ngOnDestroy() {
    this.dataService.scrollBottomFunction = noop;
  }

  openLink(link: string) {
    window.open(link);
  }

  /** Lazy load 10 more entries */
  lazyLoad(): void {
    if (!this.feed || this.allLoaded || this.loading) { return; }
    Helpers.CheckScrollBottom(() => {
      this.loading = true;
      this.dataService.FireGET<any[]>(API.NewsFeed, { from: this.feed.length, num: 10}).subscribe(result => {
        if (result.length === 0) { this.allLoaded = true; }
        this.feed = this.feed.concat(result);
        this.loading = false;
      }, () => { this.loading = false; });
    });
  }

  do_reaction(news: INewsEntry, react: number) {
    if (news.user_reaction !== react) {
      this.dataService.MarkUNR(news, react).subscribe(() => {
        news.reactions_count[news.user_reaction]--;
        news.user_reaction = react;
        news.reactions_count[react]++;
      });
    } else {
      this.dataService.MarkUNR(news, -1).subscribe(() => {
        news.reactions_count[news.user_reaction]--;
        news.user_reaction = -1;
      });
    }
  }
}
